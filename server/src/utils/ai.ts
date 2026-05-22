import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

/**
 * Helper to get multiple keys from a comma-separated env variable
 */
const getKeys = (keyStr: string | undefined): string[] => {
  if (!keyStr) return [];
  // Split by comma and remove potential quotes or spaces
  return keyStr.split(',').map(k => k.trim().replace(/^["']|["']$/g, '')).filter(k => k && k !== "YOUR_OPENAI_API_KEY" && k !== "YOUR_GEMINI_API_KEY");
};

export interface AIRequestOptions {
  model?: string;
  systemPrompt?: string;
  userPrompt: string;
  jsonMode?: boolean;
}

/**
 * Extracts and parses JSON from a string that might contain markdown code blocks.
 */
function parseAIJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (e2) {
        throw new Error("Failed to parse JSON from AI response: " + text);
      }
    }
    throw new Error("Invalid JSON format from AI: " + text);
  }
}

/**
 * Fallback Mock Responses to keep the interview going if all API quotas are hit
 */
function getMockResponse(prompt: string): any {
  console.warn("Using Mock AI Response due to API Quota/Limit issues.");
  const p = prompt.toLowerCase();
  
  // Extract history length to prevent repetition
  const historyMatch = prompt.match(/"question":/g);
  const questionCount = historyMatch ? historyMatch.length : 0;

  if (p.includes("evaluation") || p.includes("score")) {
    let mockNextQuestion = "";
    let mockExpected = "";
    
    if (p.includes("dsa") || p.includes("algorithm") || p.includes("coding")) {
       const dsaQuestions = [
         "Can you explain the time complexity of your solution and how you might optimize it?",
         "How would you handle edge cases like empty inputs or very large datasets in this problem?",
         "Could you explain the difference between a Hash Map and a Tree Map in terms of performance?",
         "If we had to solve this using a recursive approach, what would the base case be?",
         "What are the trade-offs between using an Array-based list versus a Linked List for this problem?",
         "How would you implement a basic LRU cache using the data structures we discussed?",
         "Can you explain the concept of Dynamic Programming and how it might apply to optimization problems?",
         "What is the difference between Depth First Search (DFS) and Breadth First Search (BFS)?",
         "How does a Binary Search Tree maintain its structure during an insertion?",
         "What is a 'Stable Sort' and why might it be important in certain applications?",
         "Explain the concept of Amortized Analysis in the context of a Dynamic Array (ArrayList)."
       ];
       mockNextQuestion = dsaQuestions[questionCount % dsaQuestions.length];
       mockExpected = "Optimization details, time/space complexity, or specific data structure trade-offs.";
    } else if (p.includes("hr") || p.includes("behavioral")) {
       const hrQuestions = [
         "Tell me about a time you faced a significant challenge in a team setting and how you resolved it.",
         "Where do you see yourself professionally in the next 3 to 5 years?",
         "What is your preferred style of communication when working on a high-pressure project?",
         "Describe a situation where you had to learn a new technology quickly to meet a deadline.",
         "How do you handle constructive criticism or negative feedback from a peer or manager?",
         "Tell me about a time you had to deal with a difficult teammate. What did you do?",
         "What motivates you most in a professional environment?",
         "Describe your ideal work culture and why you think you would thrive there.",
         "Tell me about a project you are most proud of and your specific contribution to it.",
         "How do you prioritize your tasks when you have multiple competing deadlines?"
       ];
       mockNextQuestion = hrQuestions[questionCount % hrQuestions.length];
       mockExpected = "STAR method response (Situation, Task, Action, Result).";
    } else {
       const techQuestions = [
         "Could you explain the difference between a process and a thread in an operating system?",
         "What are the key principles of Object-Oriented Programming (OOP)?",
         "How does a REST API differ from a GraphQL API in terms of data fetching?",
         "Can you explain the concept of 'closures' in JavaScript and provide an example?",
         "What is the role of a virtual DOM in modern frontend frameworks like React?",
         "How do indexes in a database improve query performance, and what are the downsides?",
         "Explain the difference between SQL and NoSQL databases and when to use each.",
         "What is the purpose of a middleware in a web server architecture?",
         "How does HTTPS ensure security during data transmission?",
         "Explain the concept of 'deadlocks' in concurrent programming and how to prevent them."
       ];
       mockNextQuestion = techQuestions[questionCount % techQuestions.length];
       mockExpected = "Technical conceptual explanation with practical examples.";
    }
    
    return {
      evaluation: {
        score: 8,
        feedback: "Good answer! You demonstrated solid logic and clear communication. (Note: AI API Limit reached, using demo feedback).",
        metrics: { technical: 8, communication: 9, logic: 8 }
      },
      nextQuestion: mockNextQuestion,
      expectedAnswer: mockExpected,
      isFinished: questionCount > 7 // Finish after a reasonable number of rounds
    };
  }
  
  return {
    question: "Welcome to the interview! Can you start by introducing yourself and your professional background?",
    expectedAnswer: "Name, education, and professional experience summary.",
    category: "General"
  };
}

function getMockTextResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("resume") || p.includes("coach")) {
    return "I'm currently experiencing high demand, but I'm here to help! To optimize your resume, focus on using achievement-oriented bullet points (e.g., 'Increased revenue by 20%') instead of just listing tasks. Ensure your skills section matches the job description precisely.";
  }
  if (p.includes("interview") || p.includes("practice")) {
    return "Keep practicing! A great way to improve is to use the STAR method (Situation, Task, Action, Result) for all your behavioral answers. Would you like to try another mock question?";
  }
  return "That's a great point! I'm processing a lot of requests right now, but generally, I recommend keeping your resume to one page and using a clean, ATS-friendly format. What else can I help with?";
}

const aiCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Circuit Breakers for broken/rate-limited keys
const brokenOpenAIKeys = new Map<string, number>(); // key -> expiration timestamp
const brokenGeminiKeys = new Map<string, number>(); // key -> expiration timestamp
const brokenKeyModels = new Map<string, number>(); // key:model -> expiration timestamp
const BROKEN_CACHE_TTL = 1000 * 60 * 15; // 15 minutes cache for broken status

export async function generateAIResponse(options: AIRequestOptions): Promise<any> {
  const { systemPrompt, userPrompt, jsonMode = true } = options;
  
  // Cache key based on prompts and mode
  const cacheKey = `${systemPrompt || ''}:${userPrompt}:${jsonMode}`;
  const cached = aiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const openAIKeys = getKeys(process.env.OPENAI_API_KEY);
  const geminiKeys = getKeys(process.env.GEMINI_API_KEY);

  // --- Try OpenAI Keys ---
  for (const key of openAIKeys) {
    if (brokenOpenAIKeys.has(key) && (brokenOpenAIKeys.get(key) || 0) > Date.now()) {
      console.log(`[AI Circuit Breaker] Skipping broken OpenAI key ending in ...${key.slice(-4)}`);
      continue;
    }
    try {
      const openai = new OpenAI({ apiKey: key });
      const completion = await openai.chat.completions.create({
        model: options.model || "gpt-4o-mini",
        messages: [
          ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
          { role: "user" as const, content: userPrompt }
        ],
        response_format: jsonMode ? { type: "json_object" } : undefined,
      });

      const content = completion.choices[0]?.message?.content || "";
      const result = jsonMode ? parseAIJSON(content) : content;
      aiCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (error: any) {
      console.warn(`OpenAI Key Failed (ending in ...${key.slice(-4)}):`, error.message);
      // Mark key as broken
      brokenOpenAIKeys.set(key, Date.now() + BROKEN_CACHE_TTL);
      if (error.status === 429 || error.status === 401) continue; // Try next key
      break; // Non-quota error, move to Gemini
    }
  }

  // --- Try Gemini Keys ---
  const modelsToTry = ["gemini-flash-latest", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  
  for (const key of geminiKeys) {
    if (brokenGeminiKeys.has(key) && (brokenGeminiKeys.get(key) || 0) > Date.now()) {
      console.log(`[AI Circuit Breaker] Skipping broken Gemini key ending in ...${key.slice(-4)}`);
      continue;
    }
    const genAI = new GoogleGenerativeAI(key);
    
    for (const modelName of modelsToTry) {
      const keyModel = `${key}:${modelName}`;
      if (brokenKeyModels.has(keyModel) && (brokenKeyModels.get(keyModel) || 0) > Date.now()) {
        continue;
      }
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: jsonMode ? { responseMimeType: "application/json" } : undefined
        });

        let retries = 3;
        let success = false;
        let finalResult: any = null;

        while (retries > 0 && !success) {
          try {
            const prompt = systemPrompt ? `System: ${systemPrompt}\n\nUser: ${userPrompt}` : userPrompt;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            finalResult = jsonMode ? parseAIJSON(text) : text;
            success = true;
          } catch (err: any) {
            const errText = err.message || "";
            if (errText.includes("429") || errText.includes("quota")) {
              retries--;
              if (retries > 0) {
                const waitTime = (3 - retries) * 3000; // 3 seconds, then 6 seconds delay
                console.warn(`Gemini hit rate limit (429) for ${modelName}. Retrying in ${waitTime}ms... (${retries} attempts left)`);
                await new Promise(r => setTimeout(r, waitTime));
                continue;
              }
            }
            throw err; // Propagate non-429 errors or final failure after retries
          }
        }

        aiCache.set(cacheKey, { data: finalResult, timestamp: Date.now() });
        return finalResult;
      } catch (error: any) {
        const errorMsg = error.message || "";
        console.warn(`Gemini Error (${modelName}, ...${key.slice(-4)}):`, errorMsg);
        
        // Mark specific key-model combination as broken
        brokenKeyModels.set(keyModel, Date.now() + BROKEN_CACHE_TTL);
        
        if (errorMsg.includes("429") || errorMsg.includes("quota")) {
           brokenGeminiKeys.set(key, Date.now() + BROKEN_CACHE_TTL); // Entire key is out of quota
           break; // Break model loop to try next GEMINI KEY
        }
        
        if (errorMsg.includes("API_KEY_INVALID") || errorMsg.includes("API key not valid") || errorMsg.includes("403") || errorMsg.includes("400")) {
          brokenGeminiKeys.set(key, Date.now() + BROKEN_CACHE_TTL); // Key itself is invalid/unauthorized
          break; // Break model loop to try next GEMINI KEY
        }
        
        if (errorMsg.includes("404") || errorMsg.includes("not found")) continue;
        break;
      }
    }
  }

  // Cache the successful response
  if (jsonMode) {
    const response = getMockResponse(userPrompt + (systemPrompt || ""));
    aiCache.set(cacheKey, { data: response, timestamp: Date.now() });
    return response;
  }

  const response = getMockTextResponse(userPrompt + (systemPrompt || ""));
  aiCache.set(cacheKey, { data: response, timestamp: Date.now() });
  return response;
}
