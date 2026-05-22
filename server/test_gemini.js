const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const getKeys = (keyStr) => {
  if (!keyStr) return [];
  return keyStr.split(',').map(k => k.trim().replace(/^["']|["']$/g, '')).filter(k => k);
};

const geminiKeys = getKeys(process.env.GEMINI_API_KEY);
console.log(`Found ${geminiKeys.length} Gemini keys to test.`);

async function testKeys() {
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  
  for (let i = 0; i < geminiKeys.length; i++) {
    const key = geminiKeys[i];
    console.log(`\n--- Testing Key #${i+1} (ending in ...${key.slice(-4)}) ---`);
    const genAI = new GoogleGenerativeAI(key);
    
    for (const m of models) {
      const startTime = Date.now();
      try {
        console.log(`  Trying model: ${m}`);
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("Hi");
        console.log(`  [SUCCESS] ${m} loaded in ${Date.now() - startTime}ms. Response: "${result.response.text().trim()}"`);
        break; // stop trying other models for this key if one works
      } catch (err) {
        console.log(`  [FAILED] ${m} in ${Date.now() - startTime}ms: ${err.message}`);
      }
    }
  }
}

testKeys();
