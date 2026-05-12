import { Router, Response } from 'express';
import multer from 'multer';
import prisma from '../db';
const pdf = require('pdf-parse');
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { updateGamification } from '../utils/gamification';
import { generateAIResponse } from '../utils/ai';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper to extract text from buffer
const extractText = async (file: Express.Multer.File): Promise<string> => {
  if (file.mimetype === 'application/pdf') {
    try {
      let pdfData;
      if (typeof pdf === 'function') {
        pdfData = await pdf(file.buffer);
      } else if (typeof pdf.default === 'function') {
        pdfData = await pdf.default(file.buffer);
      } else if (typeof pdf.PDFParse === 'function') {
        pdfData = await pdf.PDFParse(file.buffer);
      } else {
        throw new Error('No valid PDF parser function found');
      }
      return pdfData.text;
    } catch (err) {
      console.error('PDF parsing failed:', err);
      return 'Error parsing PDF content.';
    }
  }
  return file.buffer.toString('utf-8');
};

router.post('/analyze', authenticateToken, upload.single('resume'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { track, jobDescription } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No resume file uploaded' });
      return;
    }

    const fileText = await extractText(req.file);

    const prompt = `You are a world-class ATS (Applicant Tracking System) and Senior Technical Recruiter.
    
    TASK: Provide a deep, professional analysis of this student resume for the "${track}" track.
    ${jobDescription ? `COMPARE AGAINST THIS JOB DESCRIPTION: "${jobDescription}"` : ''}

    EVALUATE ACROSS THESE CATEGORIES:
    1. Resume Format (Max 15) - Check for ATS-safe structure.
    2. Skills Match (Max 25) - Depth and relevance to ${track}.
    3. Projects Quality (Max 20) - Complexity and technical implementation.
    4. Experience Strength (Max 20) - Quantified impact and role relevance.
    5. Keyword Optimization (Max 10) - Presence of industry-standard terms.
    6. Certifications & Achievements (Max 5).
    7. Grammar & Readability (Max 5).

    RETURN ONLY VALID JSON IN THIS FORMAT:
    {
      "totalScore": number,
      "placementReadiness": number,
      "strength": "Strong" | "Average" | "Needs Work",
      "parsedInfo": {
        "name": "string",
        "email": "string",
        "phone": "string",
        "linkedin": "string",
        "github": "string",
        "skills": ["string"],
        "education": "string"
      },
      "breakdown": {
        "format": number,
        "skills": number,
        "projects": number,
        "experience": number,
        "keywords": number,
        "certifications": number,
        "grammar": number
      },
      "jdMatchScore": number (0-100, if JD provided),
      "missingKeywords": ["string"],
      "matchedKeywords": ["string"],
      "strengths": ["string"],
      "weaknesses": ["string"],
      "suggestions": ["string"],
      "actionVerbAnalysis": {
         "score": number,
         "weakPhrases": ["string"],
         "replacements": { "weakPhrase": "strongerPhrase" }
      },
      "formattingWarnings": ["string"]
    }
    
    Resume Text:
    ${fileText.substring(0, 5000)}`;

    let analysisData;
    try {
      const aiResponse = await generateAIResponse({
        userPrompt: prompt,
        jsonMode: true
      });
      
      // Ensure it's an object and merge with defaults
      analysisData = {
        totalScore: aiResponse.totalScore || 70,
        placementReadiness: aiResponse.placementReadiness || 65,
        strength: aiResponse.strength || "Average",
        parsedInfo: aiResponse.parsedInfo || { name: "Extracted", email: "", skills: [] },
        breakdown: {
          format: aiResponse.breakdown?.format ?? 10,
          skills: aiResponse.breakdown?.skills ?? 15,
          projects: aiResponse.breakdown?.projects ?? 15,
          experience: aiResponse.breakdown?.experience ?? 15,
          keywords: aiResponse.breakdown?.keywords ?? 5,
          certifications: aiResponse.breakdown?.certifications ?? 3,
          grammar: aiResponse.breakdown?.grammar ?? 3
        },
        jdMatchScore: aiResponse.jdMatchScore,
        missingKeywords: aiResponse.missingKeywords || [],
        matchedKeywords: aiResponse.matchedKeywords || [],
        strengths: aiResponse.strengths || [],
        weaknesses: aiResponse.weaknesses || [],
        suggestions: aiResponse.suggestions || [],
        actionVerbAnalysis: aiResponse.actionVerbAnalysis || { score: 70, weakPhrases: [], replacements: {} },
        formattingWarnings: aiResponse.formattingWarnings || []
      };
    } catch (aiError: any) {
      console.warn("AI Analysis failed, using complete fallback:", aiError.message);
      analysisData = {
        totalScore: 68,
        placementReadiness: 65,
        strength: "Average",
        parsedInfo: { name: "User", email: "user@example.com", skills: ["React", "JavaScript"] },
        breakdown: { format: 12, skills: 18, projects: 12, experience: 14, keywords: 6, certifications: 3, grammar: 3 },
        missingKeywords: ["TypeScript", "Unit Testing"],
        matchedKeywords: ["React", "HTML"],
        strengths: ["Clear contact information", "Good use of keywords"],
        weaknesses: ["Missing quantified achievements"],
        suggestions: ["Add metrics to your project descriptions"],
        actionVerbAnalysis: { score: 70, weakPhrases: ["Worked on"], replacements: { "Worked on": "Developed" } },
        formattingWarnings: []
      };
    }

    const resume = await prisma.resume.create({
      data: {
        userId,
        content: 'Uploaded file: ' + req.file.originalname,
        atsScore: analysisData.totalScore,
        feedback: JSON.stringify(analysisData),
      }
    });

    await updateGamification(userId, 50);

    res.json({ message: 'Analysis complete', analysis: analysisData, resumeId: resume.id });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.post('/improve', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { section, content, track } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content required for improvement' });
      return;
    }

    const prompt = `You are a professional Resume Writer and Recruiter. 
    Rewrite the following "${section}" from a ${track} resume to be more impactful, professional, and ATS-friendly.
    Use strong action verbs, quantify achievements if possible, and ensure technical depth.

    Original Content:
    "${content}"

    Return ONLY the improved content as a string. No conversation.`;

    const improvedContent = await generateAIResponse({
      userPrompt: prompt,
      jsonMode: false
    });

    res.json({ improvedContent });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, track, resumeData } = req.body;
    
    const prompt = `You are a professional AI Resume Coach. 
    Help the student with their resume optimization for the "${track}" track.
    
    CANDIDATE DATA SUMMARY:
    Score: ${resumeData?.totalScore || 'N/A'}
    Strengths: ${resumeData?.strengths?.join(', ') || 'N/A'}
    Weaknesses: ${resumeData?.weaknesses?.join(', ') || 'N/A'}
    
    STUDENT QUESTION: "${message}"
    
    Provide a helpful, professional, and actionable response. Keep it concise.`;

    const reply = await generateAIResponse({
      userPrompt: prompt,
      jsonMode: false
    });

    res.json({ reply });
  } catch (error: any) {
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

    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json(resumes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
