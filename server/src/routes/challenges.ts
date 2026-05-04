import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.get('/daily', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let challenge = await prisma.dailyChallenge.findFirst({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    if (!challenge) {
      // Generate new challenges using AI
      try {
        const prompt = `Generate a set of 3 daily interview prep tasks for today (${today.toDateString()}):
        1. A Coding Problem (Object with title, description, starterCode).
        2. A Technical Interview Question (String).
        3. A Behavioral Interview Question (String).
        
        Return ONLY JSON with keys: codingProblem, techQuestion, behavioralQuestion. No other text.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        });

        const data = JSON.parse(completion.choices[0]?.message?.content?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}");

        challenge = await prisma.dailyChallenge.create({
          data: {
            date: today,
            codingProblem: JSON.stringify(data.codingProblem),
            techQuestion: data.techQuestion,
            behavioralQuestion: data.behavioralQuestion
          }
        });
      } catch (e) {
        // Fallback
        challenge = await prisma.dailyChallenge.upsert({
          where: { date: today },
          update: {},
          create: {
            date: today,
            codingProblem: JSON.stringify({
              title: "Reverse a String",
              description: "Write a function that reverses a string.",
              starterCode: "function reverseString(s) {\n  // Your code here\n}"
            }),
            techQuestion: "Explain the difference between '==' and '===' in JavaScript.",
            behavioralQuestion: "Tell me about a time you handled a conflict within a team."
          }
        });
      }
    }

    res.json(challenge);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
