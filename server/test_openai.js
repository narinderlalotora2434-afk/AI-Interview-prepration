const OpenAI = require("openai");
require('dotenv').config();

async function testOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.log("No OpenAI key found in env.");
    return;
  }
  console.log(`Testing OpenAI Key: ...${key.slice(-10)}`);
  try {
    const openai = new OpenAI({ apiKey: key });
    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hi" }],
    });
    console.log(`[SUCCESS] Loaded in ${Date.now() - startTime}ms. Response: "${completion.choices[0].message.content.trim()}"`);
  } catch (err) {
    console.log(`[FAILED]: ${err.message}`);
  }
}

testOpenAI();
