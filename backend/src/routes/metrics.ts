import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/database";

const router = Router();

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

const createSchema = z.object({
  date: z.string().datetime().optional(),
  weight: z.number().positive().max(500).nullable().optional(),
  bodyFat: z.number().min(0).max(100).nullable().optional(),
  notes: z.string().max(500).nullable().optional()
});

router.get("/", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") return res.status(auth.status).json({ error: auth.message });

  const limit = Math.min(200, Math.max(1, Number(req.query.limit ?? 50)));
  try {
    const metrics = await prisma.bodyMetric.findMany({
      where: { userId: auth.userId },
      orderBy: { date: "desc" },
      take: limit,
      select: { id: true, date: true, weight: true, bodyFat: true, notes: true }
    });
    return res.json({ metrics });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load metrics", details: String(error) });
  }
});

router.post("/", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") return res.status(auth.status).json({ error: auth.message });

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }
  if (parsed.data.weight == null && parsed.data.bodyFat == null && !parsed.data.notes) {
    return res.status(400).json({ error: "At least one field (weight, bodyFat, notes) is required" });
  }

  try {
    const metric = await prisma.bodyMetric.create({
      data: {
        userId: auth.userId,
        date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
        weight: parsed.data.weight ?? null,
        bodyFat: parsed.data.bodyFat ?? null,
        notes: parsed.data.notes ?? null
      },
      select: { id: true, date: true, weight: true, bodyFat: true, notes: true }
    });
    return res.status(201).json({ metric });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create metric", details: String(error) });
  }
});

router.delete("/:id", async (req, res) => {
  const auth = await getUserOr401(req.telegramId);
  if (auth.kind === "err") return res.status(auth.status).json({ error: auth.message });

  try {
    const metric = await prisma.bodyMetric.findFirst({
      where: { id: req.params.id, userId: auth.userId },
      select: { id: true }
    });
    if (!metric) return res.status(404).json({ error: "Not found" });
    await prisma.bodyMetric.delete({ where: { id: metric.id } });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete metric", details: String(error) });
  }
});

export default router;
