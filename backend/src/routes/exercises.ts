import { Router } from "express";
import { z } from "zod";
import { Equipment, MovementCategory, MuscleGroup } from "../prismaEnums";
import { prisma } from "../utils/database";

const router = Router();

const querySchema = z.object({
  category: z.nativeEnum(MovementCategory).optional(),
  equipment: z.nativeEnum(Equipment).optional(),
  muscle: z.nativeEnum(MuscleGroup).optional(),
  search: z.string().min(1).max(80).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

router.get("/", async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query", details: parsed.error.flatten() });
  }

  const { category, equipment, muscle, search, limit, offset } = parsed.data;

  try {
    const where = {
      ...(category ? { category } : {}),
      ...(equipment ? { equipment: { has: equipment } } : {}),
      ...(muscle ? { primaryMuscles: { has: muscle } } : {}),
      ...(search
        ? {
            OR: [
              { nameEn: { contains: search, mode: "insensitive" as const } },
              { nameRu: { contains: search, mode: "insensitive" as const } }
            ]
          }
        : {})
    };

    const [exercises, total] = await Promise.all([
      prisma.exerciseCatalog.findMany({
        where,
        orderBy: { nameEn: "asc" },
        take: limit,
        skip: offset,
        select: {
          id: true,
          slug: true,
          nameEn: true,
          nameRu: true,
          category: true,
          primaryMuscles: true,
          secondaryMuscles: true,
          equipment: true,
          difficulty: true,
          imageUrl: true
        }
      }),
      prisma.exerciseCatalog.count({ where })
    ]);

    return res.json({ exercises, total, limit, offset });
  } catch (error) {
    return res.status(500).json({ error: "Failed to list exercises", details: String(error) });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const exercise = await prisma.exerciseCatalog.findUnique({
      where: { slug: req.params.slug }
    });
    if (!exercise) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.json(exercise);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch exercise", details: String(error) });
  }
});

export default router;
