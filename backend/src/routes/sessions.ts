import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/database";
import { nextSuggestion } from "../services/progressionEngine";

const router = Router();

const sessionInclude = {
  exercises: {
    orderBy: { order: "asc" as const },
    include: {
      exercise: {
        select: {
          id: true,
          slug: true,
          nameEn: true,
          nameRu: true,
          category: true,
          primaryMuscles: true,
          equipment: true,
          difficulty: true,
          imageUrl: true,
          instructions: true
        }
      },
      setLogs: {
        orderBy: { setNumber: "asc" as const }
      }
    }
  }
};

interface PreviousBest {
  weight: number | null;
  reps: number;
  rir: number | null;
  completedAt: string;
}

interface ProgressionInfo {
  previous: PreviousBest | null;
  suggestion: {
    suggestedWeight: number | null;
    suggestedReps: number;
    rationaleKey: string;
  } | null;
}

/**
 * For each exercise in the session, look up the user's most recent completed
 * session containing the same exerciseCatalogId. Take the heaviest set
 * (max weight, then max reps) and compute a progression suggestion.
 *
 * Excludes the current session from the lookup so a freshly-started session
 * doesn't reference itself.
 */
async function buildProgressionMap(
  userId: string,
  exerciseCatalogIds: string[],
  excludeSessionId: string
): Promise<Map<string, ProgressionInfo>> {
  const result = new Map<string, ProgressionInfo>();
  if (exerciseCatalogIds.length === 0) return result;

  // One query per exercise — N is small (5-8 per session). Keeps logic simple.
  await Promise.all(
    exerciseCatalogIds.map(async (catalogId) => {
      const lastExercise = await prisma.sessionExercise.findFirst({
        where: {
          exerciseCatalogId: catalogId,
          session: {
            userId,
            completedAt: { not: null },
            id: { not: excludeSessionId }
          }
        },
        orderBy: {
          session: { completedAt: "desc" }
        },
        include: {
          setLogs: true,
          session: { select: { completedAt: true } }
        }
      });

      if (!lastExercise || lastExercise.setLogs.length === 0) {
        result.set(catalogId, { previous: null, suggestion: null });
        return;
      }

      // Pick heaviest set (max weight, ties broken by reps).
      const best = [...lastExercise.setLogs].sort((a, b) => {
        const aw = a.weight ?? -1;
        const bw = b.weight ?? -1;
        if (bw !== aw) return bw - aw;
        return b.reps - a.reps;
      })[0];

      const previous: PreviousBest = {
        weight: best.weight,
        reps: best.reps,
        rir: best.rir,
        completedAt: lastExercise.session.completedAt!.toISOString()
      };

      const suggestion = nextSuggestion({
        lastWeight: best.weight,
        lastReps: best.reps,
        lastRir: best.rir,
        targetRepsLow: lastExercise.suggestedRepsLow,
        targetRepsHigh: lastExercise.suggestedRepsHigh
      });

      result.set(catalogId, { previous, suggestion });
    })
  );

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function attachProgression(session: any, userId: string): Promise<any> {
  if (!session) return session;
  const catalogIds: string[] = session.exercises.map((e: { exerciseCatalogId: string }) => e.exerciseCatalogId);
  const map = await buildProgressionMap(userId, catalogIds, session.id);
  return {
    ...session,
    exercises: session.exercises.map((e: { exerciseCatalogId: string }) => ({
      ...e,
      ...(map.get(e.exerciseCatalogId) ?? { previous: null, suggestion: null })
    }))
  };
}

type AuthResult =
  | { kind: "ok"; userId: string }
  | { kind: "err"; status: 401 | 404; message: string };

async function getUserOr401(telegramId: string | undefined): Promise<AuthResult> {
  if (!telegramId) {
    return { kind: "err", status: 401, message: "Unauthorized" };
  }
  const user = await prisma.user.findUnique({
    where: { telegramId },
    select: { id: true }
  });
  if (!user) {
    return { kind: "err", status: 404, message: "User not found" };
  }
  return { kind: "ok", userId: user.id };
}

router.get("/active", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") {
    return res.status(auth.status).json({ error: auth.message });
  }
  try {
    const session = await prisma.workoutSession.findFirst({
      where: { userId: auth.userId, completedAt: null },
      orderBy: { startedAt: "desc" },
      include: sessionInclude
    });
    return res.json({ session: await attachProgression(session, auth.userId) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load active session", details: String(error) });
  }
});

router.get("/", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") {
    return res.status(auth.status).json({ error: auth.message });
  }
  try {
    const sessions = await prisma.workoutSession.findMany({
      where: { userId: auth.userId },
      orderBy: { startedAt: "desc" },
      take: 20,
      select: {
        id: true,
        dayName: true,
        startedAt: true,
        completedAt: true,
        perceivedFatigue: true
      }
    });
    return res.json({ sessions });
  } catch (error) {
    return res.status(500).json({ error: "Failed to list sessions", details: String(error) });
  }
});

router.get("/:id", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") {
    return res.status(auth.status).json({ error: auth.message });
  }
  try {
    const session = await prisma.workoutSession.findFirst({
      where: { id: req.params.id, userId: auth.userId },
      include: sessionInclude
    });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    return res.json({ session: await attachProgression(session, auth.userId) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load session", details: String(error) });
  }
});

const startSchema = z.object({
  programDayId: z.string().min(1)
});

router.post("/", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") {
    return res.status(auth.status).json({ error: auth.message });
  }
  const parsed = startSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  try {
    // Reject if there's an active (uncompleted) session — user should complete or abandon first.
    const existing = await prisma.workoutSession.findFirst({
      where: { userId: auth.userId, completedAt: null },
      select: { id: true }
    });
    if (existing) {
      return res.status(409).json({ error: "Active session exists", activeSessionId: existing.id });
    }

    // Load the program day with its slots so we can snapshot them.
    const programDay = await prisma.programDay.findFirst({
      where: {
        id: parsed.data.programDayId,
        program: { userId: auth.userId, status: "ACTIVE" }
      },
      include: {
        exercises: {
          orderBy: { order: "asc" }
        }
      }
    });
    if (!programDay) {
      return res.status(404).json({ error: "Program day not found" });
    }

    const session = await prisma.workoutSession.create({
      data: {
        userId: auth.userId,
        programDayId: programDay.id,
        dayName: programDay.name,
        exercises: {
          create: programDay.exercises.map((slot) => ({
            order: slot.order,
            slotName: slot.slotName,
            exerciseCatalogId: slot.exerciseCatalogId,
            suggestedSets: slot.suggestedSets,
            suggestedRepsLow: slot.suggestedRepsLow,
            suggestedRepsHigh: slot.suggestedRepsHigh,
            suggestedRestSec: slot.suggestedRestSec
          }))
        }
      },
      include: sessionInclude
    });

    return res.status(201).json({ session: await attachProgression(session, auth.userId) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to start session", details: String(error) });
  }
});

const logSetSchema = z.object({
  sessionExerciseId: z.string().min(1),
  setNumber: z.number().int().positive(),
  reps: z.number().int().positive().max(500),
  weight: z.number().nonnegative().max(1000).nullable().optional(),
  rir: z.number().int().min(0).max(10).nullable().optional()
});

router.post("/:id/sets", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") {
    return res.status(auth.status).json({ error: auth.message });
  }
  const parsed = logSetSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  try {
    // Verify the sessionExercise belongs to this user's session and the session is active.
    const sessionExercise = await prisma.sessionExercise.findFirst({
      where: {
        id: parsed.data.sessionExerciseId,
        session: { id: req.params.id, userId: auth.userId, completedAt: null }
      },
      select: { id: true }
    });
    if (!sessionExercise) {
      return res.status(404).json({ error: "Session exercise not found or session already completed" });
    }

    const set = await prisma.setLog.create({
      data: {
        sessionExerciseId: parsed.data.sessionExerciseId,
        setNumber: parsed.data.setNumber,
        reps: parsed.data.reps,
        weight: parsed.data.weight ?? null,
        rir: parsed.data.rir ?? null
      }
    });

    return res.status(201).json({ set });
  } catch (error) {
    return res.status(500).json({ error: "Failed to log set", details: String(error) });
  }
});

router.delete("/:id/sets/:setId", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") {
    return res.status(auth.status).json({ error: auth.message });
  }
  try {
    const set = await prisma.setLog.findFirst({
      where: {
        id: req.params.setId,
        sessionExercise: { session: { id: req.params.id, userId: auth.userId, completedAt: null } }
      },
      select: { id: true }
    });
    if (!set) {
      return res.status(404).json({ error: "Set not found" });
    }
    await prisma.setLog.delete({ where: { id: set.id } });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete set", details: String(error) });
  }
});

const completeExerciseSchema = z.object({
  sessionExerciseId: z.string().min(1)
});

router.post("/:id/exercises/complete", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") {
    return res.status(auth.status).json({ error: auth.message });
  }
  const parsed = completeExerciseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const sessionExercise = await prisma.sessionExercise.findFirst({
      where: {
        id: parsed.data.sessionExerciseId,
        session: { id: req.params.id, userId: auth.userId, completedAt: null }
      },
      select: { id: true }
    });
    if (!sessionExercise) {
      return res.status(404).json({ error: "Session exercise not found" });
    }
    const updated = await prisma.sessionExercise.update({
      where: { id: sessionExercise.id },
      data: { completedAt: new Date() }
    });
    return res.json({ sessionExercise: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to mark complete", details: String(error) });
  }
});

const completeSessionSchema = z.object({
  perceivedFatigue: z.number().int().min(1).max(10).nullable().optional(),
  notes: z.string().max(1000).nullable().optional()
});

router.patch("/:id/complete", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") {
    return res.status(auth.status).json({ error: auth.message });
  }
  const parsed = completeSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  try {
    const session = await prisma.workoutSession.findFirst({
      where: { id: req.params.id, userId: auth.userId },
      select: { id: true, completedAt: true }
    });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    if (session.completedAt) {
      return res.status(409).json({ error: "Session already completed" });
    }
    const updated = await prisma.workoutSession.update({
      where: { id: session.id },
      data: {
        completedAt: new Date(),
        perceivedFatigue: parsed.data.perceivedFatigue ?? null,
        notes: parsed.data.notes ?? null
      },
      include: sessionInclude
    });
    return res.json({ session: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to complete session", details: String(error) });
  }
});

router.delete("/:id", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") {
    return res.status(auth.status).json({ error: auth.message });
  }
  try {
    const session = await prisma.workoutSession.findFirst({
      where: { id: req.params.id, userId: auth.userId, completedAt: null },
      select: { id: true }
    });
    if (!session) {
      return res.status(404).json({ error: "Active session not found" });
    }
    await prisma.workoutSession.delete({ where: { id: session.id } });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: "Failed to abandon session", details: String(error) });
  }
});

router.get("/program/next-day", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") {
    return res.status(auth.status).json({ error: auth.message });
  }
  try {
    const program = await prisma.program.findFirst({
      where: { userId: auth.userId, status: "ACTIVE" },
      include: { days: { orderBy: { order: "asc" } } }
    });
    if (!program || program.days.length === 0) {
      return res.json({ nextDay: null });
    }
    const lastSession = await prisma.workoutSession.findFirst({
      where: { userId: auth.userId, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      select: { programDayId: true }
    });
    if (!lastSession || !lastSession.programDayId) {
      return res.json({ nextDay: program.days[0] });
    }
    const lastIndex = program.days.findIndex((d) => d.id === lastSession.programDayId);
    if (lastIndex === -1) {
      return res.json({ nextDay: program.days[0] });
    }
    const nextIndex = (lastIndex + 1) % program.days.length;
    return res.json({ nextDay: program.days[nextIndex] });
  } catch (error) {
    return res.status(500).json({ error: "Failed to compute next day", details: String(error) });
  }
});

export default router;
