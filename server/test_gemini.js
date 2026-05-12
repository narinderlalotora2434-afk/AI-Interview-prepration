const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // The SDK doesn't have a direct listModels but we can try different names
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
    for (const m of models) {
      try {
        console.log(`Testing model: ${m}`);
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("Hi");
        console.log(`Success with ${m}:`, result.response.text());
        break;
      } catch (err) {
        console.log(`Failed with ${m}:`, err.message);
      }
    }
  } catch (e) {
    console.error("General Error:", e.message);
  }
}

listModels();
