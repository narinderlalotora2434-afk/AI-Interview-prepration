import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { generateAptitudeTopic } from '../utils/aiGenerator';

const router = Router();

// Predefined set of high-quality standard aptitude topics to render in the UI
const STANDARD_TOPICS = [
  { 
    title: "Percentage", 
    slug: "percentage", 
    description: "Master percentages, fractions, successive changes, and real-world commercial math applications.", 
    level: "Beginner", 
    duration: "2 hours" 
  },
  { 
    title: "Profit and Loss", 
    slug: "profit-and-loss", 
    description: "Master cost price, selling price, margins, marked price, discounts, and successive discounts.", 
    level: "Intermediate", 
    duration: "3 hours" 
  },
  { 
    title: "Ratio and Proportion", 
    slug: "ratio-and-proportion", 
    description: "Learn ratios, direct/inverse proportions, dividing values, compound ratios, and partnerships.", 
    level: "Beginner", 
    duration: "2.5 hours" 
  },
  { 
    title: "Time and Work", 
    slug: "time-and-work", 
    description: "Learn principles of work rates, efficiency, combined rates, wages, and the men-days-hours formula.", 
    level: "Intermediate", 
    duration: "3 hours" 
  },
  { 
    title: "Pipes and Cisterns", 
    slug: "pipes-and-cisterns", 
    description: "Solve inlet and outlet flows, leakage calculations, and sequential pipe openings using work rate concepts.", 
    level: "Intermediate", 
    duration: "2.5 hours" 
  },
  { 
    title: "Average", 
    slug: "average", 
    description: "Understand mean calculations, weighted averages, consecutive numbers, and group inclusion/exclusion rules.", 
    level: "Beginner", 
    duration: "2 hours" 
  },
  { 
    title: "Probability", 
    slug: "probability", 
    description: "Master coin, card, dice, ball selection probabilities, conditional events, and permutations relevance.", 
    level: "Advanced", 
    duration: "3 hours" 
  },
  { 
    title: "Number System", 
    slug: "number-system", 
    description: "Master HCF-LCM, divisibility rules, unit digits, remainders, factorials, and prime factorization patterns.", 
    level: "Beginner", 
    duration: "3 hours" 
  },
  { 
    title: "Time, Speed and Distance", 
    slug: "time-speed-distance", 
    description: "Solve relative speed, average speed, train problems, sound propagation times, and circular tracks.", 
    level: "Intermediate", 
    duration: "3.5 hours" 
  },
  { 
    title: "Simple and Compound Interest", 
    slug: "simple-compound-interest", 
    description: "Calculate simple interests, compounding frequencies, successive interest rates, and installment systems.", 
    level: "Intermediate", 
    duration: "3 hours" 
  },
  { 
    title: "Boats and Streams", 
    slug: "boats-and-streams", 
    description: "Master relative speeds of upstream, downstream, stream velocities, and stationary water speeds.", 
    level: "Intermediate", 
    duration: "2 hours" 
  }
];

// Helper to get or generate the topic dynamically and cache it in MongoDB
async function getOrGenerateTopic(slug: string) {
  // 1. Check MongoDB cache via Prisma
  let topic = await prisma.aptitudeTopic.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { orderIndex: 'asc' }
      },
      practiceQuestions: true
    }
  });

  if (topic) {
    console.log(`[Cache Hit] Topic "${slug}" found in MongoDB.`);
    return topic;
  }

  console.log(`[Cache Miss] Generating curriculum for "${slug}" using AI...`);

  // 2. Generate topic content dynamically via AI service
  const generated = await generateAptitudeTopic(slug);

  // 3. Cache the generated content in MongoDB
  topic = await prisma.aptitudeTopic.create({
    data: {
      title: generated.title,
      slug: generated.slug,
      description: generated.description,
      level: generated.level,
      duration: generated.duration,
      lessons: {
        create: generated.lessons.map((lesson, idx) => ({
          title: lesson.title,
          content: lesson.content,
          formula: lesson.formula || null,
          example: lesson.example || null,
          shortcut: lesson.shortcut || null,
          commonMistake: lesson.commonMistake || null,
          difficulty: lesson.difficulty || 'Intermediate',
          orderIndex: idx
        }))
      },
      practiceQuestions: {
        create: generated.practiceQuestions.map(q => ({
          questionText: q.questionText,
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || null,
          difficulty: q.difficulty || 'Intermediate',
          examTags: q.examTags || []
        }))
      }
    },
    include: {
      lessons: {
        orderBy: { orderIndex: 'asc' }
      },
      practiceQuestions: true
    }
  });

  console.log(`[Cache Save] Topic "${slug}" successfully saved in MongoDB.`);
  return topic;
}

// Controller logic for getting all topics
const getTopicsHandler = async (req: AuthRequest, res: Response) => {
  try {
    const dbTopics = await prisma.aptitudeTopic.findMany({
      include: {
        _count: {
          select: { lessons: true, practiceQuestions: true }
        }
      }
    });

    const userId = req.user!.userId;
    const progresses = await prisma.aptitudeTopicProgress.findMany({
      where: { userId }
    });

    // Merge standard static list with MongoDB cached state
    const result = STANDARD_TOPICS.map(std => {
      const dbTopic = dbTopics.find(t => t.slug === std.slug);
      const prog = dbTopic ? progresses.find(p => p.topicId === dbTopic.id) : null;
      
      return {
        id: dbTopic ? dbTopic.id : `not-generated-${std.slug}`,
        title: dbTopic ? dbTopic.title : std.title,
        slug: std.slug,
        description: dbTopic ? dbTopic.description : std.description,
        level: dbTopic ? dbTopic.level : std.level,
        duration: dbTopic ? dbTopic.duration : std.duration,
        progress: prog ? prog.progressPercent : 0,
        aiGenerated: !!dbTopic,
        _count: {
          lessons: dbTopic ? dbTopic._count.lessons : 0,
          practiceQuestions: dbTopic ? dbTopic._count.practiceQuestions : 0
        }
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
};

// Controller logic for getting single topic details (and auto generating if cache miss)
const getTopicDetailsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const slug = String(req.params.slug);
    
    // Automatically trigger cache/generator pipeline
    const topic = await getOrGenerateTopic(slug);

    const userId = req.user!.userId;
    const progress = await prisma.aptitudeTopicProgress.findUnique({
      where: { userId_topicId: { userId, topicId: topic.id } }
    });

    res.json({
      topic,
      progress: progress ? progress.progressPercent : 0,
      completedLessons: progress ? progress.completedLessons : []
    });
  } catch (error) {
    console.error('Error fetching topic details:', error);
    res.status(500).json({ error: 'Failed to fetch topic details' });
  }
};

// Controller logic for manually/explicitly generating a topic curriculum
const generateTopicHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.body;
    if (!slug) {
      res.status(400).json({ error: 'Topic slug is required' });
      return;
    }

    const topic = await getOrGenerateTopic(slug);
    
    const userId = req.user!.userId;
    const progress = await prisma.aptitudeTopicProgress.findUnique({
      where: { userId_topicId: { userId, topicId: topic.id } }
    });

    res.json({
      success: true,
      topic,
      progress: progress ? progress.progressPercent : 0,
      completedLessons: progress ? progress.completedLessons : []
    });
  } catch (error) {
    console.error('Error in manual topic generation:', error);
    res.status(500).json({ error: 'Failed to generate topic curriculum' });
  }
};

// Set up routes matching both patterns (existing frontend prefix and pure /api/topics paths)
router.get('/topics', authenticateToken, getTopicsHandler);
router.get('/topics/:slug', authenticateToken, getTopicDetailsHandler);
router.post('/topics/generate', authenticateToken, generateTopicHandler);

router.get('/', authenticateToken, getTopicsHandler);
router.get('/:slug', authenticateToken, getTopicDetailsHandler);
router.post('/generate', authenticateToken, generateTopicHandler);

// Update progress (xp, streaks, lessons completed)
router.post('/progress', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { topicId, lessonId } = req.body;

    const topic = await prisma.aptitudeTopic.findUnique({
      where: { id: topicId },
      include: { lessons: true }
    });

    if (!topic) {
      res.status(404).json({ error: 'Topic not found' });
      return;
    }

    let progress = await prisma.aptitudeTopicProgress.findUnique({
      where: { userId_topicId: { userId, topicId } }
    });

    let completed = progress ? [...progress.completedLessons] : [];
    let isNewCompletion = false;
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      isNewCompletion = true;
    }

    const percent = Math.round((completed.length / topic.lessons.length) * 100);

    if (progress) {
      progress = await prisma.aptitudeTopicProgress.update({
        where: { id: progress.id },
        data: {
          completedLessons: completed,
          progressPercent: percent
        }
      });
    } else {
      progress = await prisma.aptitudeTopicProgress.create({
        data: {
          userId,
          topicId,
          completedLessons: completed,
          progressPercent: percent
        }
      });
    }

    // Award XP and update user progress metrics if a new lesson is completed
    if (isNewCompletion) {
      const xpEarned = 15; // 15 XP per lesson completed
      const userAnalytics = await prisma.analytics.findUnique({ where: { userId } });
      
      if (userAnalytics) {
        // Calculate new streak
        const lastActiveDate = new Date(userAnalytics.lastActive).toDateString();
        const todayDate = new Date().toDateString();
        let newStreak = userAnalytics.streak;

        if (lastActiveDate !== todayDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (new Date(userAnalytics.lastActive).toDateString() === yesterday.toDateString()) {
            newStreak += 1;
          } else if (newStreak === 0) {
            newStreak = 1;
          }
        }

        await prisma.analytics.update({
          where: { userId },
          data: {
            xp: { increment: xpEarned },
            streak: newStreak,
            lastActive: new Date()
          }
        });
      } else {
        await prisma.analytics.create({
          data: {
            userId,
            xp: xpEarned,
            streak: 1,
            lastActive: new Date()
          }
        });
      }
    }

    res.json({ success: true, progress });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Seed data (Legacy endpoint, preserved for compliance)
router.post('/seed', async (req, res) => {
  try {
    await getOrGenerateTopic('percentage');
    res.json({ success: true, message: 'Seeded Percentage' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to seed percentage' });
  }
});

// Seed Profit & Loss data (Legacy endpoint, preserved for compliance)
router.post('/seed-profit-loss', async (req, res) => {
  try {
    await getOrGenerateTopic('profit-and-loss');
    res.json({ success: true, message: 'Seeded Profit & Loss' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to seed Profit & Loss' });
  }
});

export default router;
