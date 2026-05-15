import { Router } from "express";
import { prisma } from "../utils/database";
import { RecentSession, detectFatigue } from "../services/fatigueDetector";

const router = Router();

type AuthResult =
  | { kind: "ok"; userId: string }
  | { kind: "err"; status: 401 | 404; message: string };

async function getUserOr401(telegramId: string | undefined): Promise<AuthResult> {
  if (!telegramId) return { kind: "err", status: 401, message: "Unauthorized" };
  const user = await prisma.user.findUnique({ where: { telegramId }, select: { id: true } });
  if (!user) return { kind: "err", status: 404, message: "User not found" };
  return { kind: "ok", userId: user.id };
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoDay(date: Date): string {
  return startOfDay(date).toISOString().slice(0, 10);
}

router.get("/", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") return res.status(auth.status).json({ error: auth.message });

  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [completedSessions, weekSessions, weightHistory, allCompletedSessionDays] = await Promise.all([
      prisma.workoutSession.count({
        where: { userId: auth.userId, completedAt: { not: null } }
      }),
      prisma.workoutSession.findMany({
        where: { userId: auth.userId, completedAt: { gte: sevenDaysAgo } },
        select: {
          id: true,
          completedAt: true,
          exercises: {
            select: { setLogs: { select: { weight: true, reps: true } } }
          }
        }
      }),
      prisma.bodyMetric.findMany({
        where: { userId: auth.userId, weight: { not: null } },
        orderBy: { date: "asc" },
        select: { date: true, weight: true }
      }),
      prisma.workoutSession.findMany({
        where: { userId: auth.userId, completedAt: { gte: thirtyDaysAgo } },
        select: { completedAt: true }
      })
    ]);

    // Week stats
    const weekVolume = weekSessions.reduce((sum, session) => {
      return (
        sum +
        session.exercises.reduce(
          (es, ex) =>
            es +
            ex.setLogs.reduce((ss, set) => ss + (set.weight ?? 0) * set.reps, 0),
          0
        )
      );
    }, 0);
    const weekMinutes = 0; // session durations not tracked yet
    const weekSessionsCount = weekSessions.filter((s) => s.completedAt).length;

    // Streak: count consecutive days back from today (or yesterday) that have at least one completed session.
    const completedDays = new Set(
      allCompletedSessionDays
        .filter((s) => s.completedAt)
        .map((s) => isoDay(s.completedAt!))
    );
    let streak = 0;
    let cursor = startOfDay(now);
    if (!completedDays.has(isoDay(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (completedDays.has(isoDay(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    // 30-day calendar
    const calendar: { date: string; trained: boolean }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const day = isoDay(d);
      calendar.push({ date: day, trained: completedDays.has(day) });
    }

    // Personal records — top 8 by max weight ever logged
    const recordsRaw = await prisma.setLog.findMany({
      where: {
        weight: { not: null },
        sessionExercise: {
          session: { userId: auth.userId, completedAt: { not: null } }
        }
      },
      select: {
        weight: true,
        reps: true,
        sessionExercise: {
          select: {
            slotName: true,
            exercise: { select: { id: true, slug: true, nameEn: true, nameRu: true } }
          }
        }
      }
    });
    type PrRow = {
      exerciseId: string;
      slug: string;
      nameEn: string;
      nameRu: string | null;
      slotName: string;
      weight: number;
      reps: number;
    };
    const prByExercise = new Map<string, PrRow>();
    for (const row of recordsRaw) {
      if (row.weight === null) continue;
      const exId = row.sessionExercise.exercise.id;
      const existing = prByExercise.get(exId);
      if (!existing || row.weight > existing.weight) {
        prByExercise.set(exId, {
          exerciseId: exId,
          slug: row.sessionExercise.exercise.slug,
          nameEn: row.sessionExercise.exercise.nameEn,
          nameRu: row.sessionExercise.exercise.nameRu,
          slotName: row.sessionExercise.slotName,
          weight: row.weight,
          reps: row.reps
        });
      }
    }
    const personalRecords = Array.from(prByExercise.values())
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 8);

    // Fatigue detection: pull last 5 completed sessions with their best sets
    // per slot, then run the rules.
    const recentForFatigue = await prisma.workoutSession.findMany({
      where: { userId: auth.userId, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      take: 5,
      select: {
        id: true,
        completedAt: true,
        perceivedFatigue: true,
        exercises: {
          select: {
            slotName: true,
            setLogs: { select: { weight: true, reps: true, rir: true } }
          }
        }
      }
    });
    const recentSessions: RecentSession[] = recentForFatigue.map((s) => ({
      id: s.id,
      completedAt: s.completedAt!,
      perceivedFatigue: s.perceivedFatigue,
      bestSets: s.exercises.map((ex) => {
        const best = [...ex.setLogs].sort((a, b) => {
          const aw = a.weight ?? -1;
          const bw = b.weight ?? -1;
          if (bw !== aw) return bw - aw;
          return b.reps - a.reps;
        })[0];
        return {
          slotName: ex.slotName,
          weight: best?.weight ?? null,
          rir: best?.rir ?? null
        };
      })
    }));
    const fatigue = detectFatigue(recentSessions);

    return res.json({
      stats: {
        completedSessions,
        weekSessionsCount,
        weekVolume: Math.round(weekVolume),
        weekMinutes,
        streak
      },
      weightHistory: weightHistory.map((m) => ({
        date: m.date.toISOString(),
        weight: m.weight
      })),
      calendar,
      personalRecords,
      fatigue
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load dashboard", details: String(error) });
  }
});

export default router;
