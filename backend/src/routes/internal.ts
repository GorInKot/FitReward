import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/database";
import { trainingWeekdays, zonedParts } from "../services/trainingSchedule";

/**
 * Routes consumed by the bot service, not by the Mini App. Protected by a
 * shared secret instead of Telegram auth. Mounted at /internal.
 */
const router = Router();

function requireInternalSecret(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    return res.status(503).json({ error: "Internal API not configured" });
  }
  if (req.header("x-internal-secret") !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
}

router.use(requireInternalSecret);

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoDay(date: Date): string {
  return startOfDay(date).toISOString().slice(0, 10);
}

/** Next program day name for the user, following completed-session history. */
async function computeNextDayName(userId: string): Promise<string | null> {
  const program = await prisma.program.findFirst({
    where: { userId, status: "ACTIVE" },
    include: { days: { orderBy: { order: "asc" }, select: { id: true, name: true } } }
  });
  if (!program || program.days.length === 0) return null;

  const last = await prisma.workoutSession.findFirst({
    where: { userId, completedAt: { not: null } },
    orderBy: { completedAt: "desc" },
    select: { programDayId: true }
  });
  if (!last?.programDayId) return program.days[0].name;

  const idx = program.days.findIndex((d) => d.id === last.programDayId);
  if (idx === -1) return program.days[0].name;
  return program.days[(idx + 1) % program.days.length].name;
}

/** True if the user has any workout session that falls on `dateKey` in `tz`. */
async function hasSessionOn(userId: string, dateKey: string, tz: string): Promise<boolean> {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const sessions = await prisma.workoutSession.findMany({
    where: { userId, startedAt: { gte: twoDaysAgo } },
    select: { startedAt: true }
  });
  return sessions.some((s) => zonedParts(s.startedAt, tz).dateKey === dateKey);
}

/** Consecutive-day streak of completed sessions, counted back from today. */
async function computeStreak(userId: string): Promise<number> {
  const sessions = await prisma.workoutSession.findMany({
    where: { userId, completedAt: { not: null } },
    orderBy: { completedAt: "desc" },
    take: 120,
    select: { completedAt: true }
  });
  const days = new Set(sessions.map((s) => isoDay(s.completedAt!)));
  let streak = 0;
  const cursor = startOfDay(new Date());
  if (!days.has(isoDay(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (days.has(isoDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

async function countWeekSessions(userId: string): Promise<number> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return prisma.workoutSession.count({
    where: { userId, completedAt: { gte: sevenDaysAgo } }
  });
}

/**
 * Returns the users to remind right now: reminders enabled, current local hour
 * equals their reminderHour, today is a training weekday, no session logged
 * today, and not already reminded today. Marks lastReminderSentAt for them.
 */
router.post("/reminder-targets", async (_req, res) => {
  try {
    const now = new Date();
    const users = await prisma.user.findMany({
      where: {
        remindersEnabled: true,
        onboardingCompletedAt: { not: null },
        trainingDaysPerWeek: { not: null }
      },
      select: {
        id: true,
        telegramId: true,
        locale: true,
        timezone: true,
        reminderHour: true,
        trainingDaysPerWeek: true,
        lastReminderSentAt: true
      }
    });

    const targets: { telegramId: string; locale: string; nextDayName: string | null }[] = [];
    const sentUserIds: string[] = [];

    for (const user of users) {
      const today = zonedParts(now, user.timezone);
      if (today.hour !== user.reminderHour) continue;
      if (!trainingWeekdays(user.trainingDaysPerWeek ?? 3).includes(today.weekday)) continue;
      if (
        user.lastReminderSentAt &&
        zonedParts(user.lastReminderSentAt, user.timezone).dateKey === today.dateKey
      ) {
        continue;
      }
      if (await hasSessionOn(user.id, today.dateKey, user.timezone)) continue;

      const nextDayName = await computeNextDayName(user.id);
      targets.push({ telegramId: user.telegramId, locale: user.locale, nextDayName });
      sentUserIds.push(user.id);
    }

    if (sentUserIds.length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: sentUserIds } },
        data: { lastReminderSentAt: now }
      });
    }

    return res.json({ targets });
  } catch (error) {
    return res.status(500).json({ error: "Failed to compute reminder targets", details: String(error) });
  }
});

/** Compact user snapshot for the bot's /today, /streak and /profile commands. */
router.get("/user-summary", async (req, res) => {
  const telegramId = String(req.query.telegramId ?? "").trim();
  if (!telegramId) {
    return res.status(400).json({ error: "telegramId required" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { telegramId },
      select: {
        id: true,
        firstName: true,
        locale: true,
        timezone: true,
        trainingDaysPerWeek: true,
        onboardingCompletedAt: true
      }
    });
    if (!user) {
      return res.json({ found: false });
    }

    const today = zonedParts(new Date(), user.timezone);
    const isTrainingDay = user.trainingDaysPerWeek
      ? trainingWeekdays(user.trainingDaysPerWeek).includes(today.weekday)
      : false;

    const [streak, weekSessions, nextDayName, trainedToday] = await Promise.all([
      computeStreak(user.id),
      countWeekSessions(user.id),
      computeNextDayName(user.id),
      hasSessionOn(user.id, today.dateKey, user.timezone)
    ]);

    return res.json({
      found: true,
      firstName: user.firstName,
      locale: user.locale,
      onboardingCompleted: Boolean(user.onboardingCompletedAt),
      streak,
      weekSessions,
      nextDayName,
      trainedToday,
      isTrainingDay
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load user summary", details: String(error) });
  }
});

export default router;
