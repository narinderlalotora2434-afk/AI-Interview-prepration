import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateGamification = async (userId: string, xpGain: number) => {
  try {
    const analytics = await prisma.analytics.findUnique({ where: { userId } });
    if (!analytics) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActive = new Date(analytics.lastActive);
    lastActive.setHours(0, 0, 0, 0);

    let newStreak = analytics.streak;
    const diffTime = today.getTime() - lastActive.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays === 1) {
      // Streak continues
      newStreak += 1;
    } else if (diffDays > 1) {
      // Streak broken
      newStreak = 1;
    } else if (analytics.streak === 0) {
      // First activity
      newStreak = 1;
    }

    // Badge logic
    const currentBadges = JSON.parse(analytics.badges);
    const newXP = analytics.xp + xpGain;
    
    if (newXP >= 100 && !currentBadges.includes('early_adopter')) {
      currentBadges.push('early_adopter');
    }
    if (newStreak >= 7 && !currentBadges.includes('week_warrior')) {
      currentBadges.push('week_warrior');
    }

    await prisma.analytics.update({
      where: { userId },
      data: {
        xp: newXP,
        streak: newStreak,
        lastActive: new Date(),
        badges: JSON.stringify(currentBadges)
      }
    });
  } catch (error) {
    console.error("Gamification update failed", error);
  }
};
