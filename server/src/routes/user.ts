import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/dashboard', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const analytics = await prisma.analytics.findUnique({
      where: { userId }
    });

    const recentInterviews = await prisma.interview.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    const recentResumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const recentAptitude = await prisma.aptitudeAttempt.findMany({
      where: { userId },
      take: 20,
      orderBy: { createdAt: 'desc' }
    });

    const recentCoding = await prisma.codeSubmission.findMany({
      where: { userId },
      take: 20,
      orderBy: { createdAt: 'desc' }
    });

    const allActivity = [
      ...recentInterviews.map(i => ({ type: 'Interview', date: i.createdAt, score: i.score })),
      ...recentResumes.map(r => ({ type: 'Resume', date: r.createdAt, score: r.atsScore })),
      ...recentAptitude.map(a => ({ type: 'Aptitude', date: a.createdAt, score: a.score })),
      ...recentCoding.map(c => ({ type: 'Coding', date: c.createdAt, score: c.status === 'Accepted' ? 100 : 0 }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePic: true, name: true, email: true }
    });

    res.json({
      analytics: analytics || { mockInterviewCount: 0, codingRoundCount: 0, avgScore: 0, xp: 0, streak: 0, badges: "[]" },
      recentInterviews,
      recentResumes,
      allActivity,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Update profile photo
router.post('/update-profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { profilePic } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePic },
      select: { id: true, name: true, email: true, profilePic: true }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
// Force IDE Reload
