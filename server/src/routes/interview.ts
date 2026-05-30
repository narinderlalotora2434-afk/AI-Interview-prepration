import { Router, Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { updateGamification } from '../utils/gamification';
import { generateAIResponse } from '../utils/ai';
import { z } from 'zod';

const router = Router();

const generateSchema = z.object({
  role: z.string().min(1).max(100).optional(),
  experienceLevel: z.string().optional(),
  company: z.string().optional(),
  resumeId: z.string().optional(),
  interviewType: z.string().optional(),
  difficulty: z.string().optional(),
  duration: z.number().optional(),
  features: z.any().optional(),
});

// Initialize a dynamic mock interview
router.post('/generate', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = generateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
      return;
    }
    const { role, experienceLevel, company, resumeId, interviewType, difficulty, duration, features } = parsed.data;
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

    // Step 1: Introduction Round or Specific Start
    const systemPrompt = `You are a world-class expert interviewer at a top-tier tech company (like Google, Amazon, or a specialized ECE firm like NVIDIA).
    Your goal is to conduct a highly professional, realistic, and adaptive ${interviewType} for a ${experienceLevel} ${role} candidate.
    
    SESSION CONTEXT: ${interviewType}
    - If Technical: Assess domain fundamentals, project depth, and practical logic.
    - If HR: Assess personality, communication, culture fit, and soft skills.
    - If Behavioral: Use the STAR methodology to probe situational thinking.
    - If DSA: Provide a coding problem and assess algorithmic thinking.
    - If System Design: Discuss architecture, scalability, and trade-offs.
    - If Aptitude: Ask a logical, quantitative, or analytical puzzle.
    - If Resume-Based: Deep dive into the candidate's specific projects and skills.
    
    ${resumeContext ? `CANDIDATE RESUME: ${resumeContext}` : ''}
    
    INTERVIEW STYLE:
    - Be professional, conversational, and encouraging but firm.
    - Ask ONE question at a time.
    - Do NOT be robotic. Act like a real person.
    - Adapt difficulty based on the ${experienceLevel} level.
    
    Return ONLY JSON: { "question": "string", "expectedAnswer": "string", "category": "string" }`;

    let userPrompt = `Generate the first question for this ${interviewType} session.`;
    if (interviewType === "Resume-Based Interview" && resumeContext) {
      userPrompt = `Based on the candidate's resume, start with a deep dive into their most significant project or core skill.`;
    } else if (interviewType === "Aptitude Round") {
      userPrompt = `Start with a challenging logical reasoning or quantitative aptitude question appropriate for a ${role} role.`;
    } else if (interviewType === "DSA Round") {
      userPrompt = `Provide the first DSA problem description. Keep it concise.`;
    } else {
      userPrompt = `Start with a professional greeting and the first question (e.g., "Tell me about yourself" or a core technical concept).`;
    }

    const responseContent = await generateAIResponse({
      systemPrompt,
      userPrompt,
      jsonMode: true
    });

    // Defensive check for AI response
    const questionContent = responseContent.question || responseContent.nextQuestion || "Welcome! To start, could you introduce yourself and tell me about your background?";
    const expectedAnswer = responseContent.expectedAnswer || "A professional introduction and overview of skills/experience.";

    const interview = await prisma.interview.create({
      data: {
        userId,
        type: 'MOCK',
        category: interviewType || 'Technical Interview',
        role: role || 'General Candidate',
        experienceLevel: experienceLevel || 'Intermediate',
        questions: {
          create: [{
            content: questionContent,
            expectedAnswer: expectedAnswer,
          }]
        }
      },
      include: {
        questions: true
      }
    });

    res.status(201).json({ interview, nextQuestion: questionContent });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

const nextSchema = z.object({
  answer: z.string(),
  currentStep: z.any().optional(),
});

// Dynamic Next Question logic
router.post('/:id/next', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = nextSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
      return;
    }
    const interviewId = String(req.params.id);
    const { answer, currentStep } = parsed.data;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { 
        questions: { 
          include: { answers: true },
          orderBy: { createdAt: 'asc' }
        } 
      }
    });

    if (!interview || interview.userId !== userId) {
      res.status(404).json({ error: 'Interview not found' });
      return;
    }

    const lastQuestion = interview.questions[interview.questions.length - 1];
    
    // Save user's answer
    const savedAnswer = await prisma.answer.create({
      data: {
        questionId: lastQuestion.id,
        content: answer,
      }
    });

    // Evaluate and get next question
    const history = interview.questions.map(q => ({
      question: q.content,
      answer: q.answers[0]?.content || (q.id === lastQuestion.id ? answer : "")
    }));

    const systemPrompt = `You are a world-class AI interviewer continuing a ${interview.category || 'Technical Interview'} session for a ${interview.role || 'candidate'} position at a top-tier company.
    
    CURRENT MODE: ${interview.category}
    - If Technical: Drill down into specific domain knowledge, edge cases, and architectural understanding.
    - If HR: Focus on culture fit, leadership principles, and soft skills.
    - If Behavioral: Ask follow-ups based on the STAR method (Situation, Task, Action, Result).
    - If DSA: Evaluate their current approach and provide hints or ask about complexity if they seem stuck.
    - If System Design: Challenge their choices on scalability, databases, and bottlenecks.
    
    DIFFICULTY: ${interview.difficulty || 'Medium'}
    
    CONVERSATION HISTORY:
    ${JSON.stringify(history)}
    
    CANDIDATE'S LAST ANSWER: "${answer}"
    
    INSTRUCTIONS:
    1. Evaluate the last answer for accuracy, technical depth, and communication.
    2. Decide if the session is finished (usually after 4-5 questions).
    3. If not finished, generate the NEXT question relevant to the ${interview.category} context.
    4. If finished, provide a final overall evaluation.
    
    Return ONLY JSON: 
    { 
      "isFinished": boolean, 
      "evaluation": { 
        "score": number (0-10), 
        "feedback": "string",
        "topic": "string (e.g., Arrays, Strings, DP, Recursion, Trees, Graphs)",
        "timeComplexity": "string (e.g., O(n), O(log n))",
        "spaceComplexity": "string (e.g., O(1))",
        "testCasesPassed": number,
        "totalTestCases": number,
        "metrics": {
           "technical": number,
           "communication": number,
           "logic": number,
           "confidence": number
        }
      },
      "nextQuestion": "string",
      "expectedAnswer": "string",
      "isFinished": boolean
    }`;

    const response = await generateAIResponse({
      systemPrompt,
      userPrompt: `History: ${JSON.stringify(history)} \n\n Current Answer: ${answer}`,
      jsonMode: true
    });

    // Defensive check for AI response
    if (!response || !response.evaluation) {
      throw new Error("Invalid AI response format");
    }

    // Update evaluation for the last answer
    await prisma.answer.update({
      where: { id: savedAnswer.id },
      data: {
        score: Math.round(Number(response.evaluation.score) || 0),
        feedback: response.evaluation.feedback || "No feedback provided",
        timeComplexity: response.evaluation.timeComplexity,
        spaceComplexity: response.evaluation.spaceComplexity,
        testCasesPassed: response.evaluation.testCasesPassed,
        totalTestCases: response.evaluation.totalTestCases
      }
    });

    if (response.isFinished) {
      // Calculate final score and metrics
      const allAnswers = await prisma.answer.findMany({
        where: { question: { interviewId } },
        include: { question: true }
      });
      
      const totalAnswers = allAnswers.length || 1;
      const avgScore = (allAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / totalAnswers) * 10;
      
      // Aggregate Topic Performance
      const topicScores: Record<string, number[]> = {};
      allAnswers.forEach(a => {
        const topic = a.question.topic || response.evaluation.topic || "General";
        if (!topicScores[topic]) topicScores[topic] = [];
        topicScores[topic].push(a.score || 0);
      });

      const performanceMetrics = {
        accuracy: (allAnswers.filter(a => (a.score || 0) >= 7).length / totalAnswers) * 100,
        avgComplexity: "Optimized",
        communication: 8.5, // AI could provide this per session
        confidence: 9.0
      };

      await prisma.interview.update({
        where: { id: interviewId },
        data: { 
          score: Math.round(avgScore),
          metrics: JSON.stringify(performanceMetrics)
        }
      });

      // Update User Analytics
      const analytics = await prisma.analytics.findUnique({ where: { userId } });
      if (analytics) {
         const newMockCount = analytics.mockInterviewCount + 1;
         const newAvgScore = ((analytics.avgScore * analytics.mockInterviewCount) + avgScore) / newMockCount;
         
         const currentTopicPerf = JSON.parse(analytics.topicPerformance);
         Object.entries(topicScores).forEach(([topic, scores]) => {
           const avgTopicScore = scores.reduce((a, b) => a + b, 0) / scores.length;
           currentTopicPerf[topic] = Math.round(((currentTopicPerf[topic] || avgTopicScore) + avgTopicScore) / 2);
         });

         const weakTopics = Object.entries(currentTopicPerf)
            .filter(([_, score]) => (score as number) < 6)
            .map(([topic]) => topic);
         
         const strongTopics = Object.entries(currentTopicPerf)
            .filter(([_, score]) => (score as number) >= 8)
            .map(([topic]) => topic);

         // Generate simple AI Roadmap if weak topics exist
         let roadmap = analytics.roadmap;
         if (weakTopics.length > 0) {
           roadmap = JSON.stringify({
             title: "Personalized DSA Mastery Path",
             steps: weakTopics.map(t => ({
               topic: t,
               priority: "High",
               resources: [`Mastering ${t} fundamentals`, `Advanced ${t} problems`]
             }))
           });
         }

         const lastActiveDate = new Date(analytics.lastActive).toDateString();
         const todayDate = new Date().toDateString();
         let newStreak = analytics.streak;
         if (lastActiveDate !== todayDate) {
           const yesterday = new Date();
           yesterday.setDate(yesterday.getDate() - 1);
           newStreak = lastActiveDate === yesterday.toDateString()
             ? analytics.streak + 1
             : 1;
         }

         await prisma.analytics.update({
           where: { userId },
           data: {
             mockInterviewCount: newMockCount,
             avgScore: newAvgScore,
             topicPerformance: JSON.stringify(currentTopicPerf),
             weakTopics: JSON.stringify(weakTopics),
             strongTopics: JSON.stringify(strongTopics),
             roadmap,
             lastActive: new Date(),
             streak: newStreak
           }
         });
         
         // Update Gamification
         await updateGamification(userId, 100);
      }

      res.json({ isFinished: true, score: avgScore, metrics: performanceMetrics });
    } else {
      // Add next question to DB
      const nextQ = await prisma.question.create({
        data: {
          interviewId,
          content: response.nextQuestion || "Can you tell me more about that?",
          expectedAnswer: response.expectedAnswer || "",
          topic: response.evaluation.topic
        }
      });

      res.json({ 
        isFinished: false, 
        nextQuestion: nextQ.content, 
        evaluation: response.evaluation 
      });
    }

  } catch (error: any) {
    console.error("Interview Progression Error:", error);
    res.status(500).json({ error: error.message || 'Failed to progress interview' });
  }
});

const evaluateSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    content: z.string(),
  })),
});

// Evaluate answers
router.post('/:id/evaluate', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = evaluateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
      return;
    }
    const interviewId = String(req.params.id);
    const { answers } = parsed.data; // Array of { questionId, content }
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

    const results = await Promise.all(answers.map(async (ans: any) => {
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

        evalData = await generateAIResponse({
          userPrompt: prompt,
          jsonMode: true
        });
      } catch (aiError: any) {
        console.warn("AI Evaluation failed, using mock evaluation:", aiError.message);
      }

      const answer = await prisma.answer.create({
        data: {
          questionId: ans.questionId,
          content: ans.content,
          score: evalData.score,
          feedback: evalData.feedback,
        }
      });
      return { score: evalData.score, answer };
    }));

    const validResults = (results.filter(r => r !== null) as { score: number, answer: any }[]);
    const totalScore = validResults.reduce((sum, r) => sum + r.score, 0);
    const evaluatedAnswers = validResults.map(r => r.answer);

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
      // Reward XP (Normalized with next endpoint)
      await updateGamification(userId, 100);
    }

    res.json({ message: 'Evaluation complete', score: avgScore, evaluatedAnswers });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.get('/:id/summary', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const interview = await prisma.interview.findUnique({
      where: { id: String(req.params.id) },
      include: { questions: { include: { answers: true }, orderBy: { createdAt: 'asc' } } }
    });
    if (!interview || interview.userId !== userId) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(interview);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
