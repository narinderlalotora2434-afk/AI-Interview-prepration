import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Get all module progresses
router.get('/progress', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const progresses = await prisma.moduleProgress.findMany({
      where: { userId },
      orderBy: { lastActivity: 'desc' }
    });

    res.json(progresses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update or create module progress
router.post('/update', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { moduleId, category, title, progress, status, state, accuracy, estimatedTime, recommendation } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const updated = await prisma.moduleProgress.upsert({
      where: {
        userId_moduleId: { userId, moduleId }
      },
      update: {
        progress,
        status,
        state: typeof state === 'string' ? state : JSON.stringify(state),
        lastActivity: new Date(),
        accuracy,
        estimatedTime,
        recommendation,
        streak: { increment: 1 }
      },
      create: {
        userId,
        moduleId,
        category,
        title,
        progress: progress || 0,
        status: status || "In Progress",
        state: typeof state === 'string' ? state : JSON.stringify(state || {}),
        accuracy: accuracy || 0,
        estimatedTime,
        recommendation
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
