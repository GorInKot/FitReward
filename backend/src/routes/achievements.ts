import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/database";
import { checkAndUnlockAchievements } from "../services/achievementEngine";

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

router.get("/", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") return res.status(auth.status).json({ error: auth.message });
  try {
    // Backfill: re-run rules in case the user qualifies from data created
    // before this endpoint existed, or events were missed. Idempotent.
    await checkAndUnlockAchievements(auth.userId);

    const achievements = await prisma.achievement.findMany({
      include: {
        userAchievements: {
          where: { userId: auth.userId },
          select: { unlockedAt: true, notifiedAt: true }
        }
      },
      orderBy: { reward: "asc" }
    });
    return res.json({
      achievements: achievements.map((a) => ({
        key: a.key,
        category: a.category,
        threshold: a.threshold,
        reward: a.reward,
        unlockedAt: a.userAchievements[0]?.unlockedAt?.toISOString() ?? null,
        notifiedAt: a.userAchievements[0]?.notifiedAt?.toISOString() ?? null
      }))
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to list achievements", details: String(error) });
  }
});

const seenSchema = z.object({ keys: z.array(z.string().min(1)).min(1) });

router.post("/seen", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") return res.status(auth.status).json({ error: auth.message });
  const parsed = seenSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });
  try {
    await prisma.userAchievement.updateMany({
      where: {
        userId: auth.userId,
        achievement: { key: { in: parsed.data.keys } },
        notifiedAt: null
      },
      data: { notifiedAt: new Date() }
    });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: "Failed to mark seen", details: String(error) });
  }
});

export default router;
