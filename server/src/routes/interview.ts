import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { updateGamification } from '../utils/gamification';

const router = Router();
const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a new mock interview
router.post('/generate', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, experienceLevel, company, resumeId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let resumeContext = "";
    if (resumeId) {
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId, userId }
      });
      if (resume) {
        resumeContext = `Candidate Resume Context:
        - ATS Analysis & Feedback: ${resume.feedback}
        - Content Note: ${resume.content}`;
      }
    }

    let questionsData = [];
    try {
      // Call OpenAI to generate questions based on role, experience, company, and resume
      const prompt = `Generate 5 interview questions for a ${experienceLevel} level ${role} ${company ? `at ${company}` : ''}. 
      ${resumeContext ? `IMPORTANT: Tailor these questions to the candidate's actual resume provided below. Focus on their specific Skills, Projects, Experience, and Achievements. Challenge them on their claims.
      
      ${resumeContext}` : ''}
      
      If a company is specified, tailor the questions to their known interview style.
      Return ONLY a JSON array of objects with 'question' and 'expectedAnswer' keys. No other text.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const responseContent = completion.choices[0]?.message?.content || "[]";
      const cleanJson = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
      questionsData = JSON.parse(cleanJson);
    } catch (openaiError: any) {
      console.warn("OpenAI API failed, using mock questions:", openaiError.message);
      // Fallback for Demo Mode
      questionsData = [
        { question: `Tell me about a challenging project you worked on as a ${role}.`, expectedAnswer: "Star method, specific technical details, outcome." },
        { question: `How do you stay updated with the latest trends in ${role} technologies?`, expectedAnswer: "Blogs, community, side projects." },
        { question: "Explain the difference between synchronous and asynchronous programming.", expectedAnswer: "Blocking vs non-blocking, event loop." },
        { question: "How do you handle conflicts within a technical team?", expectedAnswer: "Communication, empathy, focus on goals." },
        { question: `What is your approach to testing and debugging in a ${experienceLevel} role?`, expectedAnswer: "Unit tests, integration tests, logging." }
      ];
    }

    const interview = await prisma.interview.create({
      data: {
        userId,
        type: 'MOCK',
        questions: {
          create: questionsData.map((q: any) => ({
            content: q.question,
            expectedAnswer: q.expectedAnswer,
          }))
        }
      },
      include: {
        questions: true
      }
    });

    res.status(201).json({ interview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Evaluate answers
router.post('/:id/evaluate', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const interviewId = String(req.params.id);
    const { answers } = req.body; // Array of { questionId, content }
    const userId = String(req.user?.userId);

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { questions: true }
    });

    if (!interview || interview.userId !== userId) {
      res.status(404).json({ error: 'Interview not found' });
      return;
    }

    let totalScore = 0;
    const evaluatedAnswers = await Promise.all(answers.map(async (ans: any) => {
      const question = interview.questions.find((q: any) => q.id === ans.questionId);
      if (!question) return null;

      let evalData = { score: 8, feedback: "Demo Mode: Good answer. Try to be more specific with examples." };

      try {
        const prompt = `Evaluate the following interview answer. 
        Question: ${question.content}
        Expected Answer concept: ${question.expectedAnswer}
        Candidate Answer: ${ans.content}
        
        Score the candidate out of 10 and provide brief feedback. 
        Return ONLY JSON with 'score' (number) and 'feedback' (string). No other text.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        });

        const responseContent = completion.choices[0]?.message?.content || "{}";
        const cleanJson = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
        evalData = JSON.parse(cleanJson);
      } catch (openaiError: any) {
        console.warn("OpenAI API failed, using mock evaluation:", openaiError.message);
      }

      totalScore += evalData.score;

      return prisma.answer.create({
        data: {
          questionId: ans.questionId,
          content: ans.content,
          score: evalData.score,
          feedback: evalData.feedback,
        }
      });
    }));

    const avgScore = (totalScore / answers.length) * 10; // Convert to percentage

    await prisma.interview.update({
      where: { id: interviewId },
      data: { score: Math.round(avgScore) }
    });

    // Update analytics
    const analytics = await prisma.analytics.findUnique({ where: { userId: userId } });
    if (analytics) {
      const newMockCount = analytics.mockInterviewCount + 1;
      const newAvgScore = ((analytics.avgScore * analytics.mockInterviewCount) + avgScore) / newMockCount;
      await prisma.analytics.update({
        where: { userId: userId },
        data: {
          mockInterviewCount: newMockCount,
          avgScore: newAvgScore,
        }
      });
      // Reward XP
      await updateGamification(userId, 50);
    }

    res.json({ message: 'Evaluation complete', score: avgScore, evaluatedAnswers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
