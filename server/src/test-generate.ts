import { generateAptitudeTopic } from './utils/aiGenerator';
import prisma from './db';

async function test() {
  try {
    const slug = 'simple-compound-interest';
    console.log("Checking if topic simple-compound-interest exists in DB...");
    const existing = await prisma.aptitudeTopic.findUnique({
      where: { slug }
    });
    console.log("Existing topic:", existing);

    console.log("Generating topic content via AI/Fallback...");
    const topic = await generateAptitudeTopic(slug);
    console.log("Generated topic details:", topic.title);

    const pTopic = await prisma.aptitudeTopic.findUnique({
      where: { slug: 'percentage' },
      include: { lessons: true, practiceQuestions: true }
    });
    console.log("PERCENTAGE CACHE IN DB:");
    console.log("- Title:", pTopic?.title);
    console.log("- Lessons count:", pTopic?.lessons?.length);
    console.log("- First Lesson Content:", pTopic?.lessons?.[0]?.content);

    const plTopic = await prisma.aptitudeTopic.findUnique({
      where: { slug: 'profit-and-loss' },
      include: { lessons: true, practiceQuestions: true }
    });
    console.log("PROFIT AND LOSS CACHE IN DB:");
    console.log("- Title:", plTopic?.title);
    console.log("- Lessons count:", plTopic?.lessons?.length);
    console.log("- First Lesson Content:", plTopic?.lessons?.[0]?.content);
  } catch (err: any) {
    console.error("DIAGNOSTIC FAILED WITH ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
