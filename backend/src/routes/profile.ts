import { FitnessLevel, Goal } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/database";

const router = Router();

const telegramIdSchema = z.object({
  telegramId: z.string().min(1)
});

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

router.get("/:telegramId", async (req, res) => {
  const parsed = telegramIdSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid telegramId" });
  }

  try {
    if (useFallbackStorage()) {
      return res.json(getFallbackProfile(parsed.data.telegramId));
    }

    const user = await prisma.user.upsert({
      where: { telegramId: parsed.data.telegramId },
      update: {},
      create: {
        telegramId: parsed.data.telegramId,
        fitnessLevel: FitnessLevel.BEGINNER,
        goals: [Goal.GENERAL_FITNESS]
      },
      select: {
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
      }
    });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load profile", details: String(error) });
  }
});

router.put("/:telegramId", async (req, res) => {
  const paramParsed = telegramIdSchema.safeParse(req.params);
  if (!paramParsed.success) {
    return res.status(400).json({ error: "Invalid telegramId" });
  }

  const bodyParsed = updateProfileSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    if (useFallbackStorage()) {
      const current = getFallbackProfile(paramParsed.data.telegramId);
      const updated: ProfilePayload = {
        ...current,
        ...bodyParsed.data,
        goals: bodyParsed.data.goals ?? current.goals
      };
      fallbackProfiles.set(paramParsed.data.telegramId, updated);
      return res.json(updated);
    }

    const user = await prisma.user.upsert({
      where: { telegramId: paramParsed.data.telegramId },
      update: bodyParsed.data,
      create: {
        telegramId: paramParsed.data.telegramId,
        fitnessLevel: bodyParsed.data.fitnessLevel ?? FitnessLevel.BEGINNER,
        goals: bodyParsed.data.goals ?? [Goal.GENERAL_FITNESS],
        firstName: bodyParsed.data.firstName,
        lastName: bodyParsed.data.lastName,
        username: bodyParsed.data.username,
        age: bodyParsed.data.age ?? undefined,
        weight: bodyParsed.data.weight ?? undefined,
        height: bodyParsed.data.height ?? undefined
      },
      select: {
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
      }
    });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update profile", details: String(error) });
  }
});

export default router;
