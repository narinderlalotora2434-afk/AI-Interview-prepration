import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// Get all branches
router.get('/branches', async (req: Request, res: Response) => {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// Get a specific branch with its roadmaps and tracks
router.get('/branches/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = String(req.params.slug);
    const branch = await prisma.branch.findUnique({
      where: { slug },
      include: {
        roadmaps: {
          include: {
            modules: {
              orderBy: { orderIndex: 'asc' },
              include: {
                topics: {
                  orderBy: { orderIndex: 'asc' },
                  include: {
                    resources: true
                  }
                }
              }
            },
            companyTracks: true
          }
        }
      }
    });

    if (!branch) {
      res.status(404).json({ error: 'Branch not found' });
      return;
    }

    res.json(branch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch branch details' });
  }
});

// Update user progress for a specific topic
router.post('/progress', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { topicId, status } = req.body;

    if (!topicId || !status) {
      res.status(400).json({ error: 'topicId and status are required' });
      return;
    }

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_topicId: {
          userId,
          topicId
        }
      },
      update: {
        status,
        completedAt: status === 'Completed' ? new Date() : null
      },
      create: {
        userId,
        topicId,
        status,
        completedAt: status === 'Completed' ? new Date() : null
      }
    });

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get user progress for a branch
router.get('/progress/:branchId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const branchId = String(req.params.branchId);

    // Fetch all topic IDs for this branch
    const roadmaps = await prisma.roadmap.findMany({
      where: { branchId },
      include: {
        modules: {
          include: {
            topics: true
          }
        }
      }
    });

    const topicIds = roadmaps.flatMap((r: any) => r.modules.flatMap((m: any) => m.topics.map((t: any) => t.id)));

    // Fetch progress for those topics
    const progress = await prisma.userProgress.findMany({
      where: {
        userId,
        topicId: { in: topicIds }
      }
    });

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;
