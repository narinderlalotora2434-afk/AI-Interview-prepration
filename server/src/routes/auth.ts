import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = Router();
const prisma = new PrismaClient();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'ethereal_user',
    pass: process.env.SMTP_PASS || 'ethereal_pass'
  }
});

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        analytics: {
          create: {
            mockInterviewCount: 0,
            codingRoundCount: 0,
            avgScore: 0,
          }
        }
      },
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({ error: `Registration failed: ${error.message || 'Server Error'}` });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ error: `Login failed: ${error.message || 'Server Error'}` });
  }
});

router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Prevent email enumeration
      res.json({ message: 'If that email exists, we have sent a reset link to it.' });
      return;
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Token valid for 15 minutes
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: tokenExpiry,
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: '"AI Interview Platform" <noreply@yourdomain.com>',
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="color: #555; font-size: 16px;">Hello ${user.name || 'User'},</p>
          <p style="color: #555; font-size: 16px;">We received a request to reset your password. Click the button below to choose a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
          </div>
          <p style="color: #555; font-size: 14px;"><strong>Note:</strong> This link will expire in 15 minutes.</p>
          <p style="color: #555; font-size: 14px;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} AI Interview Prep Platform. All rights reserved.</p>
        </div>
      `
    };

    // In a real app with real SMTP, this sends the email. 
    // Here it might fail if credentials aren't set, but we catch it.
    try {
      await transporter.sendMail(mailOptions);
    } catch (_mailError) {
      console.warn("Failed to send email. Ensure SMTP is configured. Returning token for local testing:", resetToken);
      // For local testing without SMTP, we might return the token. In production, remove this!
      if (process.env.NODE_ENV !== 'production') {
        res.json({ message: 'If that email exists, we have sent a reset link to it.', testToken: resetToken });
        return;
      }
    }

    res.json({ message: 'If that email exists, we have sent a reset link to it.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400).json({ error: 'Token and new password are required' });
      return;
    }

    // Hash token to compare with DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { gt: new Date() } // Must not be expired
      }
    });

    if (!user) {
      res.status(400).json({ error: 'Token is invalid or has expired' });
      return;
    }

    // Enforce basic password validation logic here as well (redundant to frontend but secure)
    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Update password and invalidate token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      }
    });

    res.json({ message: 'Password has been successfully reset' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
// Force IDE Reload 2
