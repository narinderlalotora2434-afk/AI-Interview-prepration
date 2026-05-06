import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Start interview - generate first question
router.post('/start', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, experienceLevel } = req.body;

    const prompt = `You are a professional technical interviewer. 
    Generate the first interview question for a ${experienceLevel} level ${role} position.
    The question should be engaging and appropriate for the start of an interview.
    Return ONLY JSON: { "question": "string" }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content || "{}";
    res.json(JSON.parse(responseContent));
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Evaluate answer and get follow-up
router.post('/evaluate', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      question, 
      answer, 
      track, 
      skills, 
      projects, 
      step 
    } = req.body;

    const systemPrompt = `You are a professional technical interviewer conducting a ${track} interview.

Candidate Details:
- Track: ${track}
- Extracted Skills: ${skills?.join(', ')}
- Extracted Projects: ${JSON.stringify(projects)}

STRICT INTERVIEW FLOW:
Step 1: Introduction (Tell me about yourself)
Step 2: Key skills and strengths
Step 3: Resume-based deep dive (Pick one project or skill)
Step 4+: Technical questions based on track

TRACK SPECIALIZATION:
If Track is 'software': Focus on DSA, System Design, Web/Backend concepts, and coding logic.
If Track is 'hardware': Focus on Digital/Analog Electronics, VLSI, Embedded Systems, and Circuit Design.

EVALUATION RULES:
1. Evaluate the answer based on: Technical correctness, clarity, depth, and communication.
2. Be conversational.
3. Increase difficulty gradually.
4. If the candidate is on Step ${step}, prepare the question for Step ${step + 1}.

Return ONLY JSON:
{
  "score": number (0-10),
  "strengths": string[],
  "weaknesses": string[],
  "improvedAnswer": string,
  "nextQuestion": string,
  "isCodingQuestion": boolean (true if the next question requires writing code)
}`;

    const userPrompt = `Current Step: ${step}
Last Question: ${question}
Candidate's Answer: ${answer}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content || "{}";
    res.json(JSON.parse(responseContent));
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});


export default router;
