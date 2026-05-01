import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// Get questions by category
router.get('/questions/:category', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.params;
    const { difficulty, limit = 10 } = req.query;
    
    let finalQuestions = [];

    if (category === 'Mixed') {
      const categories = ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Data Interpretation", "Coding Aptitude"];
      
      for (const cat of categories) {
        const where: any = { category: cat };
        if (difficulty && difficulty !== 'Mixed') where.difficulty = difficulty;

        const catQuestions = await prisma.aptitudeQuestion.findMany({
          where,
          take: 50 // fetch pool
        });

        // Shuffle and take 10 from each category
        const shuffled = catQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
        finalQuestions.push(...shuffled);
      }
      
      // Final shuffle of all combined questions
      finalQuestions = finalQuestions.sort(() => 0.5 - Math.random());
    } else {
      const where: any = { category };
      if (difficulty && difficulty !== 'Mixed') where.difficulty = difficulty;

      const questions = await prisma.aptitudeQuestion.findMany({
        where,
        take: 100 // fetch pool
      });
      
      finalQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, Number(limit));
    }

    const safeQuestions = finalQuestions.map(q => ({
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      topic: q.topic,
      type: q.type,
      questionText: q.questionText,
      options: JSON.parse(q.options)
    }));

    res.json(safeQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Submit a test
router.post('/submit', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { category, difficulty, answers, timeTaken, totalQuestions } = req.body;
    
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let skipped = 0;
    
    const detailedResults = [];

    // Optimize by fetching all questions in one go
    const questionIds = Object.keys(answers);
    const questions = await prisma.aptitudeQuestion.findMany({
      where: { id: { in: questionIds } }
    });

    const questionMap = new Map(questions.map(q => [q.id, q]));

    for (const [qId, ans] of Object.entries(answers)) {
      const answerVal = ans as string | null;
      if (answerVal === null || answerVal === undefined || answerVal === "") {
        skipped++;
        detailedResults.push({ questionId: qId, answer: null, correct: false });
        continue;
      }
      
      const q = questionMap.get(qId);
      if (q) {
        if (q.correctAnswer === answerVal) {
          correctAnswers++;
          detailedResults.push({ 
            questionId: qId, 
            questionText: q.questionText,
            answer: answerVal, 
            correct: true, 
            explanation: q.explanation 
          });
        } else {
          wrongAnswers++;
          detailedResults.push({ 
            questionId: qId, 
            questionText: q.questionText,
            answer: answerVal, 
            correct: false, 
            correctAnswer: q.correctAnswer, 
            explanation: q.explanation 
          });
        }
      }
    }

    const unattemptedCount = totalQuestions - questionIds.length;
    skipped += unattemptedCount;

    // +1 for correct, -0.25 for wrong
    const score = correctAnswers - (wrongAnswers * 0.25);

    const accuracy = correctAnswers > 0 ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100) : 0;
    const aiFeedback = `You scored ${score} out of ${totalQuestions}. Your accuracy is ${accuracy}%. ${accuracy < 60 ? 'Focus on accuracy over speed.' : 'Great job on accuracy! Try to improve your speed.'}`;

    const attempt = await prisma.aptitudeAttempt.create({
      data: {
        userId,
        category,
        difficulty,
        score,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        skipped,
        timeTaken,
        details: JSON.stringify(detailedResults),
        aiFeedback
      }
    });

    res.json(attempt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit test' });
  }
});

// Get user history
router.get('/history', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const history = await prisma.aptitudeAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get single attempt details
router.get('/history/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const id = String(req.params.id);
    const attempt = await prisma.aptitudeAttempt.findUnique({
      where: { id }
    });
    
    if (!attempt || attempt.userId !== userId) {
      res.status(404).json({ error: 'Attempt not found' });
      return;
    }
    
    res.json(attempt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attempt' });
  }
});

// Get Leaderboard
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const topPerformers = await prisma.aptitudeAttempt.groupBy({
      by: ['userId'],
      _sum: { score: true },
      orderBy: { _sum: { score: 'desc' } },
      take: 10
    });

    const leaderboard = await Promise.all(topPerformers.map(async (p) => {
      const user = await prisma.user.findUnique({ where: { id: p.userId }, select: { name: true, profilePic: true } });
      return {
        userId: p.userId,
        name: user?.name || 'Anonymous',
        profilePic: user?.profilePic,
        totalScore: p._sum.score
      };
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
// Force IDE Reload
