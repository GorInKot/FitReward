import { Router } from "express";
import {
  ExperienceLevel,
  Limitation,
  PrimaryGoal,
  TrainingEnvironment,
  TrainingStructure
} from "../prismaEnums";
import { z } from "zod";
import { prisma } from "../utils/database";

const router = Router();

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  username: z.string().min(1).optional(),
  age: z.number().int().positive().max(120).nullable().optional(),
  weight: z.number().positive().max(500).nullable().optional(),
  height: z.number().int().positive().max(300).nullable().optional()
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
  primaryGoal: PrimaryGoal | null;
  experienceLevel: ExperienceLevel | null;
  trainingDaysPerWeek: number | null;
  trainingEnvironment: TrainingEnvironment | null;
  limitations: Limitation[];
  recommendedStructure: TrainingStructure | null;
  recommendationReasons: string[];
  onboardingCompletedAt: string | null;
  onboardingCompleted: boolean;
};

const fallbackProfiles = new Map<string, ProfilePayload>();

function emptyProfile(telegramId: string): ProfilePayload {
  return {
    id: `local_${telegramId}`,
    telegramId,
    firstName: null,
    lastName: null,
    username: null,
    isPremium: false,
    age: null,
    weight: null,
    height: null,
    primaryGoal: null,
    experienceLevel: null,
    trainingDaysPerWeek: null,
    trainingEnvironment: null,
    limitations: [],
    recommendedStructure: null,
    recommendationReasons: [],
    onboardingCompletedAt: null,
    onboardingCompleted: false
  };
}

function getFallbackProfile(telegramId: string): ProfilePayload {
  const current = fallbackProfiles.get(telegramId);
  if (current) {
    return current;
  }
  const created = emptyProfile(telegramId);
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
  primaryGoal: true,
  experienceLevel: true,
  trainingDaysPerWeek: true,
  trainingEnvironment: true,
  limitations: true,
  recommendedStructure: true,
  recommendationReasons: true,
  onboardingCompletedAt: true
} as const;

type PrismaUser = {
  id: string;
  telegramId: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  isPremium: boolean;
  age: number | null;
  weight: number | null;
  height: number | null;
  primaryGoal: PrimaryGoal | null;
  experienceLevel: ExperienceLevel | null;
  trainingDaysPerWeek: number | null;
  trainingEnvironment: TrainingEnvironment | null;
  limitations: Limitation[];
  recommendedStructure: TrainingStructure | null;
  recommendationReasons: string[];
  onboardingCompletedAt: Date | null;
};

function serialize(user: PrismaUser): ProfilePayload {
  return {
    ...user,
    onboardingCompletedAt: user.onboardingCompletedAt ? user.onboardingCompletedAt.toISOString() : null,
    onboardingCompleted: Boolean(user.onboardingCompletedAt)
  };
}

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
        create: { telegramId },
        select: PROFILE_SELECT
      });
      return res.json(serialize(user));
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
      const current = getFallbackProfile(telegramId);
      const updated = { ...current, ...bodyParsed.data };
      fallbackProfiles.set(telegramId, updated);
      return res.json(updated);
    }

    try {
      const user = await prisma.user.upsert({
        where: { telegramId },
        update: bodyParsed.data,
        create: { telegramId, ...bodyParsed.data },
        select: PROFILE_SELECT
      });
      return res.json(serialize(user));
    } catch (error) {
      if (shouldUseMemoryFallback(error)) {
        console.warn("[profile] Database unavailable, using in-memory profile store");
        const current = getFallbackProfile(telegramId);
        const updated = { ...current, ...bodyParsed.data };
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
