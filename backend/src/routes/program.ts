import { Router } from "express";
import { prisma } from "../utils/database";
import { generateAndSaveProgram } from "../services/programGenerator";

const router = Router();

async function loadActiveProgram(userId: string) {
  return prisma.program.findFirst({
    where: { userId, status: "ACTIVE" },
    include: {
      days: {
        orderBy: { order: "asc" },
        include: {
          exercises: {
            orderBy: { order: "asc" },
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
                  imageUrl: true
                }
              }
            }
          }
        }
      }
    }
  });
}

type GenerateResult =
  | { kind: "ok"; program: Awaited<ReturnType<typeof loadActiveProgram>> }
  | { kind: "err"; status: 400 | 404; message: string };

async function generateForCurrentUser(telegramId: string): Promise<GenerateResult> {
  const user = await prisma.user.findUnique({
    where: { telegramId },
    select: {
      id: true,
      primaryGoal: true,
      experienceLevel: true,
      trainingDaysPerWeek: true,
      trainingEnvironment: true,
      limitations: true,
      recommendedStructure: true,
      onboardingCompletedAt: true
    }
  });
  if (!user) {
    return { kind: "err", status: 404, message: "User not found" };
  }
  if (
    !user.onboardingCompletedAt ||
    !user.primaryGoal ||
    !user.experienceLevel ||
    !user.trainingDaysPerWeek ||
    !user.trainingEnvironment ||
    !user.recommendedStructure
  ) {
    return { kind: "err", status: 400, message: "Onboarding not completed" };
  }

  const programId = await generateAndSaveProgram({
    userId: user.id,
    primaryGoal: user.primaryGoal,
    experienceLevel: user.experienceLevel,
    trainingDaysPerWeek: user.trainingDaysPerWeek,
    trainingEnvironment: user.trainingEnvironment,
    limitations: user.limitations,
    structure: user.recommendedStructure
  });

  const program = await prisma.program.findUnique({
    where: { id: programId },
    include: {
      days: {
        orderBy: { order: "asc" },
        include: {
          exercises: {
            orderBy: { order: "asc" },
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
                  imageUrl: true
                }
              }
            }
          }
        }
      }
    }
  });
  return { kind: "ok", program };
}

router.get("/current", async (req, res) => {
  const telegramId = req.telegramId;
  if (!telegramId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { telegramId },
      select: { id: true }
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const program = await loadActiveProgram(user.id);
    return res.json({ program });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load program", details: String(error) });
  }
});

router.post("/generate", async (req, res) => {
  const telegramId = req.telegramId;
  if (!telegramId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await generateForCurrentUser(telegramId);
    if (result.kind === "err") {
      return res.status(result.status).json({ error: result.message });
    }
    return res.json({ program: result.program });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate program", details: String(error) });
  }
});

router.post("/regenerate", async (req, res) => {
  const telegramId = req.telegramId;
  if (!telegramId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await generateForCurrentUser(telegramId);
    if (result.kind === "err") {
      return res.status(result.status).json({ error: result.message });
    }
    return res.json({ program: result.program });
  } catch (error) {
    return res.status(500).json({ error: "Failed to regenerate program", details: String(error) });
  }
});

export default router;
