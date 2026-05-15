import { AchievementCategory } from "../prismaEnums";
import { prisma } from "../utils/database";

/**
 * The fixed set of achievements. Auto-seeded on startup via `seedAchievements()`.
 * All visible labels live in the frontend i18n dictionary under achievement.*.
 */
export const ACHIEVEMENT_CATALOG: Array<{
  key: string;
  category: AchievementCategory;
  threshold: number | null;
  reward: number;
}> = [
  { key: "onboarding_complete", category: "MILESTONE", threshold: null, reward: 10 },
  { key: "first_workout", category: "MILESTONE", threshold: null, reward: 20 },
  { key: "streak_3", category: "CONSISTENCY", threshold: 3, reward: 30 },
  { key: "streak_7", category: "CONSISTENCY", threshold: 7, reward: 70 },
  { key: "sessions_10", category: "MILESTONE", threshold: 10, reward: 50 },
  { key: "sessions_30", category: "MILESTONE", threshold: 30, reward: 150 },
  { key: "first_metric", category: "BODY", threshold: null, reward: 10 },
  { key: "first_pr", category: "STRENGTH", threshold: null, reward: 25 },
  { key: "volume_10000", category: "STRENGTH", threshold: 10000, reward: 100 },
  { key: "program_week_complete", category: "CONSISTENCY", threshold: null, reward: 80 }
];

export async function seedAchievements(): Promise<void> {
  for (const a of ACHIEVEMENT_CATALOG) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: { category: a.category, threshold: a.threshold, reward: a.reward },
      create: a
    });
  }
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoDay(date: Date): string {
  return startOfDay(date).toISOString().slice(0, 10);
}

async function currentStreak(userId: string): Promise<number> {
  const days = await prisma.workoutSession.findMany({
    where: { userId, completedAt: { not: null } },
    select: { completedAt: true }
  });
  const completedDays = new Set(days.filter((d) => d.completedAt).map((d) => isoDay(d.completedAt!)));
  let streak = 0;
  const cursor = startOfDay(new Date());
  if (!completedDays.has(isoDay(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (completedDays.has(isoDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * Returns whether the achievement's condition is satisfied for this user.
 * Each branch is purposely cheap — kicked off after any state-changing event.
 */
async function isUnlocked(userId: string, key: string): Promise<boolean> {
  switch (key) {
    case "onboarding_complete": {
      const u = await prisma.user.findUnique({
        where: { id: userId },
        select: { onboardingCompletedAt: true }
      });
      return Boolean(u?.onboardingCompletedAt);
    }
    case "first_workout":
    case "sessions_10":
    case "sessions_30": {
      const count = await prisma.workoutSession.count({
        where: { userId, completedAt: { not: null } }
      });
      const required = key === "first_workout" ? 1 : key === "sessions_10" ? 10 : 30;
      return count >= required;
    }
    case "streak_3":
    case "streak_7": {
      const streak = await currentStreak(userId);
      return streak >= (key === "streak_3" ? 3 : 7);
    }
    case "first_metric": {
      const count = await prisma.bodyMetric.count({ where: { userId } });
      return count > 0;
    }
    case "first_pr": {
      const set = await prisma.setLog.findFirst({
        where: {
          weight: { not: null },
          sessionExercise: {
            session: { userId, completedAt: { not: null } }
          }
        },
        select: { id: true }
      });
      return Boolean(set);
    }
    case "volume_10000": {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sessions = await prisma.workoutSession.findMany({
        where: { userId, completedAt: { gte: sevenDaysAgo } },
        select: { exercises: { select: { setLogs: { select: { weight: true, reps: true } } } } }
      });
      const volume = sessions.reduce(
        (sum, s) =>
          sum +
          s.exercises.reduce(
            (es, ex) => es + ex.setLogs.reduce((ss, set) => ss + (set.weight ?? 0) * set.reps, 0),
            0
          ),
        0
      );
      return volume >= 10000;
    }
    case "program_week_complete": {
      // Completed >= trainingDaysPerWeek sessions in the past 7 days.
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { trainingDaysPerWeek: true }
      });
      const required = user?.trainingDaysPerWeek ?? null;
      if (!required) return false;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const count = await prisma.workoutSession.count({
        where: { userId, completedAt: { gte: sevenDaysAgo } }
      });
      return count >= required;
    }
    default:
      return false;
  }
}

/**
 * Checks every achievement; inserts new UserAchievement rows for any that the
 * user just qualified for. Idempotent — unique constraint on (userId, achievementId)
 * prevents duplicates.
 *
 * Returns the keys of newly unlocked achievements (the caller can include
 * them in the response or fire-and-forget).
 */
export async function checkAndUnlockAchievements(userId: string): Promise<string[]> {
  const all = await prisma.achievement.findMany({
    include: {
      userAchievements: { where: { userId }, select: { id: true } }
    }
  });

  const newlyUnlocked: string[] = [];
  for (const ach of all) {
    if (ach.userAchievements.length > 0) continue; // already unlocked
    const ok = await isUnlocked(userId, ach.key);
    if (!ok) continue;
    try {
      await prisma.userAchievement.create({
        data: { userId, achievementId: ach.id }
      });
      newlyUnlocked.push(ach.key);
    } catch {
      // Unique constraint race — already unlocked, ignore.
    }
  }
  return newlyUnlocked;
}
