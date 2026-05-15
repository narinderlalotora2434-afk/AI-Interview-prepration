import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { generateAIResponse } from '../utils/ai';

const router = Router();

router.post('/chat', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { message } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Fetch Context (Analytics, Resume Score, Recent Interview)
    const [analytics, recentResume, recentInterview, history] = await Promise.all([
      prisma.analytics.findUnique({ where: { userId } }),
      prisma.resume.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      prisma.interview.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      prisma.assistantChat.findMany({ 
        where: { userId }, 
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    const context = {
      mockInterviews: analytics?.mockInterviewCount || 0,
      avgScore: analytics?.avgScore || 0,
      xp: analytics?.xp || 0,
      streak: analytics?.streak || 0,
      strongTopics: JSON.parse(analytics?.strongTopics || '[]'),
      weakTopics: JSON.parse(analytics?.weakTopics || '[]'),
      lastAtsScore: recentResume?.atsScore || 'N/A',
      recentInterviewScore: recentInterview?.score || 'N/A'
    };

    const chatHistory = history.reverse().map(h => `${h.role === 'user' ? 'Student' : 'PrepAI'}: ${h.content}`).join('\n');

    const systemPrompt = `You are "PrepAI Assistant", a premium, friendly, and highly intelligent AI placement mentor for college students. 
    Your goal is to help students get placed in top companies.
    
    STUDENT CONTEXT:
    ${JSON.stringify(context, null, 2)}
    
    RECENT CHAT HISTORY:
    ${chatHistory}
    
    GUIDELINES:
    1. Be motivating, professional, and solution-oriented.
    2. For coding errors: Explain the mistake, provide the fix, and explain time complexity.
    3. For aptitude: Teach shortcuts and step-by-step solutions.
    4. For resumes: Suggest ATS optimizations based on their context.
    5. Be proactive: If they haven't practiced weak topics, remind them.
    6. Maintain a "Mini ChatGPT" feel - support long, natural conversations.
    7. Use markdown for code and lists.
    8. Use emojis sparingly but effectively (🚀, 💡, 🎯).`;

    const reply = await generateAIResponse({
      systemPrompt,
      userPrompt: message,
      jsonMode: false
    });

    // 2. Save Conversation
    await prisma.$transaction([
      prisma.assistantChat.create({ data: { userId, role: 'user', content: message } }),
      prisma.assistantChat.create({ data: { userId, role: 'ai', content: reply } })
    ]);

    res.json({ reply });
  } catch (error: any) {
    console.error('Assistant Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const history = await prisma.assistantChat.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 50
    });

    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/history', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await prisma.assistantChat.deleteMany({ where: { userId } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
