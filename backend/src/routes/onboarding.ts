import { Router } from "express";
import { z } from "zod";
import {
  ExperienceLevel,
  Limitation,
  PrimaryGoal,
  TrainingEnvironment,
  TrainingStructure
} from "../prismaEnums";
import { prisma } from "../utils/database";
import { recommendTrainingStructure } from "../services/trainingRecommendation";
import { generateAndSaveProgram } from "../services/programGenerator";
import { checkAndUnlockAchievements } from "../services/achievementEngine";
import { PROFILE_SELECT, serializeProfile } from "../utils/profileSerializer";

const router = Router();

const onboardingSchema = z.object({
  primaryGoal: z.nativeEnum(PrimaryGoal),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  trainingDaysPerWeek: z.number().int().min(2).max(7),
  trainingEnvironment: z.nativeEnum(TrainingEnvironment),
  limitations: z.array(z.nativeEnum(Limitation)).min(1).default([Limitation.NONE]),
  // Optional override: user can pick a different structure than recommended
  acceptedStructure: z.nativeEnum(TrainingStructure).optional()
});

router.post("/", async (req, res) => {
  const telegramId = req.telegramId;
  if (!telegramId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parsed = onboardingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const input = parsed.data;
  const recommendation = recommendTrainingStructure({
    experienceLevel: input.experienceLevel,
    trainingDaysPerWeek: input.trainingDaysPerWeek
  });

  const finalStructure = input.acceptedStructure ?? recommendation.structure;

  try {
    const user = await prisma.user.upsert({
      where: { telegramId },
      update: {
        primaryGoal: input.primaryGoal,
        experienceLevel: input.experienceLevel,
        trainingDaysPerWeek: input.trainingDaysPerWeek,
        trainingEnvironment: input.trainingEnvironment,
        limitations: input.limitations,
        recommendedStructure: finalStructure,
        onboardingCompletedAt: new Date()
      },
      create: {
        telegramId,
        primaryGoal: input.primaryGoal,
        experienceLevel: input.experienceLevel,
        trainingDaysPerWeek: input.trainingDaysPerWeek,
        trainingEnvironment: input.trainingEnvironment,
        limitations: input.limitations,
        recommendedStructure: finalStructure,
        onboardingCompletedAt: new Date()
      },
      select: PROFILE_SELECT
    });

    // Auto-generate the first program so the user lands on a populated Plans
    // page after onboarding. Failure here shouldn't fail the whole onboarding
    // — the user can hit "Regenerate" manually.
    let programGenerationError: string | null = null;
    try {
      await generateAndSaveProgram({
        userId: user.id,
        primaryGoal: input.primaryGoal,
        experienceLevel: input.experienceLevel,
        trainingDaysPerWeek: input.trainingDaysPerWeek,
        trainingEnvironment: input.trainingEnvironment,
        limitations: input.limitations,
        structure: finalStructure
      });
    } catch (error) {
      programGenerationError = String(error);
      console.error("[onboarding] Program generation failed", error);
    }

    // Fire-and-forget achievement check; failures shouldn't fail the request.
    void checkAndUnlockAchievements(user.id).catch((err) =>
      console.error("[onboarding] achievement check failed", err)
    );

    return res.json({
      profile: serializeProfile(user),
      recommendation: {
        suggestedStructure: recommendation.structure,
        finalStructure,
        reasons: recommendation.reasons,
        overridden: finalStructure !== recommendation.structure
      },
      programGenerationError
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save onboarding", details: String(error) });
  }
});

// Allows the wizard to preview the recommendation without committing.
router.post("/preview", (req, res) => {
  const previewSchema = z.object({
    experienceLevel: z.nativeEnum(ExperienceLevel),
    trainingDaysPerWeek: z.number().int().min(2).max(7)
  });
  const parsed = previewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  const recommendation = recommendTrainingStructure(parsed.data);
  return res.json(recommendation);
});

export default router;
