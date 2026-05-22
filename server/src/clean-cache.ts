import prisma from './db';

async function cleanCache() {
  console.log("Searching for all cached topics in the database...");
  const topics = await prisma.aptitudeTopic.findMany();
  console.log(`Found ${topics.length} cached topics in the database.`);

  for (const topic of topics) {
    console.log(`Purging children for topic: "${topic.title}" (ID: ${topic.id})...`);
    
    // Delete associated lessons
    const lessonsDeleted = await prisma.aptitudeLesson.deleteMany({
      where: { topicId: topic.id }
    });
    console.log(`- Deleted ${lessonsDeleted.count} lessons.`);

    // Delete associated practice questions
    const questionsDeleted = await prisma.aptitudePracticeQuestion.deleteMany({
      where: { topicId: topic.id }
    });
    console.log(`- Deleted ${questionsDeleted.count} practice questions.`);

    // Delete topic progress records if any
    const progressDeleted = await prisma.aptitudeTopicProgress.deleteMany({
      where: { topicId: topic.id }
    });
    console.log(`- Deleted ${progressDeleted.count} progress tracker records.`);

    // Delete the topic document itself
    await prisma.aptitudeTopic.delete({
      where: { id: topic.id }
    });
    console.log(`Successfully purged and deleted cache for topic: "${topic.title}"!\n`);
  }

  await prisma.$disconnect();
  console.log("Database cache fully cleared and ready for high-fidelity rebuilds!");
}

cleanCache();
