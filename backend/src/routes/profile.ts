import { Router } from "express";
import { FitnessLevel, Goal } from "../prismaEnums";
import { z } from "zod";
import { prisma } from "../utils/database";

const router = Router();

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  username: z.string().min(1).optional(),
  age: z.number().int().positive().max(120).nullable().optional(),
  weight: z.number().positive().max(500).nullable().optional(),
  height: z.number().int().positive().max(300).nullable().optional(),
  fitnessLevel: z.nativeEnum(FitnessLevel).optional(),
  goals: z.array(z.nativeEnum(Goal)).optional()
});

type ProfilePayload = {
  id: string;
  telegramId: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  isPremium: boolean;
  age: number | null;
  weight: number | null;
  height: number | null;
  fitnessLevel: FitnessLevel;
  goals: Goal[];
};

const fallbackProfiles = new Map<string, ProfilePayload>();

function getFallbackProfile(telegramId: string): ProfilePayload {
  const current = fallbackProfiles.get(telegramId);
  if (current) {
    return current;
  }

  const created: ProfilePayload = {
    id: `local_${telegramId}`,
    telegramId,
    firstName: null,
    lastName: null,
    username: null,
    isPremium: false,
    age: null,
    weight: null,
    height: null,
    fitnessLevel: FitnessLevel.BEGINNER,
    goals: [Goal.GENERAL_FITNESS]
  };
  fallbackProfiles.set(telegramId, created);
  return created;
}

function useFallbackStorage() {
  return !process.env.DATABASE_URL;
}

function shouldUseMemoryFallback(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return (
    error.name === "PrismaClientInitializationError" ||
    error.message.includes("Can't reach database server") ||
    error.message.includes("P1001")
  );
}

function mergeProfileUpdate(
  telegramId: string,
  data: z.infer<typeof updateProfileSchema>
): ProfilePayload {
  const current = getFallbackProfile(telegramId);
  return {
    ...current,
    ...data,
    goals: data.goals ?? current.goals
  };
}

const PROFILE_SELECT = {
  id: true,
  telegramId: true,
  firstName: true,
  lastName: true,
  username: true,
  isPremium: true,
  age: true,
  weight: true,
  height: true,
  fitnessLevel: true,
  goals: true
} as const;

router.get("/me", async (req, res) => {
  const telegramId = req.telegramId;
  if (!telegramId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (useFallbackStorage()) {
      return res.json(getFallbackProfile(telegramId));
    }

    try {
      const user = await prisma.user.upsert({
        where: { telegramId },
        update: {},
        create: {
          telegramId,
          fitnessLevel: FitnessLevel.BEGINNER,
          goals: [Goal.GENERAL_FITNESS]
        },
        select: PROFILE_SELECT
      });

      return res.json(user);
    } catch (error) {
      if (shouldUseMemoryFallback(error)) {
        console.warn("[profile] Database unavailable, using in-memory profile store");
        return res.json(getFallbackProfile(telegramId));
      }
      throw error;
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to load profile", details: String(error) });
  }
});

router.put("/me", async (req, res) => {
  const telegramId = req.telegramId;
  if (!telegramId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const bodyParsed = updateProfileSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    if (useFallbackStorage()) {
      const updated = mergeProfileUpdate(telegramId, bodyParsed.data);
      fallbackProfiles.set(telegramId, updated);
      return res.json(updated);
    }

    try {
      const user = await prisma.user.upsert({
        where: { telegramId },
        update: bodyParsed.data,
        create: {
          telegramId,
          fitnessLevel: bodyParsed.data.fitnessLevel ?? FitnessLevel.BEGINNER,
          goals: bodyParsed.data.goals ?? [Goal.GENERAL_FITNESS],
          firstName: bodyParsed.data.firstName,
          lastName: bodyParsed.data.lastName,
          username: bodyParsed.data.username,
          age: bodyParsed.data.age ?? undefined,
          weight: bodyParsed.data.weight ?? undefined,
          height: bodyParsed.data.height ?? undefined
        },
        select: PROFILE_SELECT
      });

      return res.json(user);
    } catch (error) {
      if (shouldUseMemoryFallback(error)) {
        console.warn("[profile] Database unavailable, using in-memory profile store");
        const updated = mergeProfileUpdate(telegramId, bodyParsed.data);
        fallbackProfiles.set(telegramId, updated);
        return res.json(updated);
      }
      throw error;
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to update profile", details: String(error) });
  }
});

export default router;
