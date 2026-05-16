import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/database";
import {
  PROFILE_SELECT,
  SerializedProfile,
  serializeProfile
} from "../utils/profileSerializer";

const router = Router();

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  username: z.string().min(1).optional(),
  age: z.number().int().positive().max(120).nullable().optional(),
  weight: z.number().positive().max(500).nullable().optional(),
  height: z.number().int().positive().max(300).nullable().optional(),
  timezone: z.string().min(1).max(64).optional(),
  locale: z.enum(["ru", "en"]).optional(),
  reminderHour: z.number().int().min(0).max(23).optional(),
  remindersEnabled: z.boolean().optional()
});

const fallbackProfiles = new Map<string, SerializedProfile>();

function emptyProfile(telegramId: string): SerializedProfile {
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
    onboardingCompletedAt: null,
    onboardingCompleted: false,
    timezone: "UTC",
    locale: "en",
    reminderHour: 18,
    remindersEnabled: true
  };
}

function getFallbackProfile(telegramId: string): SerializedProfile {
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
      return res.json(serializeProfile(user));
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
      return res.json(serializeProfile(user));
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
