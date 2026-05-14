/**
 * Seeds ExerciseCatalog from wger.de open dataset (CC-BY-SA 4.0).
 *
 * Run locally against the production DB:
 *   DATABASE_URL='<neon-url>' npx tsx scripts/seed-exercises.ts
 *
 * Idempotent: skips inserts that already exist (by slug). Re-run to pull new
 * exercises added upstream.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import type {
  Difficulty,
  Equipment,
  MovementCategory,
  MuscleGroup
} from "../src/prismaEnums";

const prisma = new PrismaClient();

const WGER_BASE = "https://wger.de/api/v2";
const LANG_EN = 2;
const LANG_RU = 7;
const PAGE_SIZE = 100;

interface WgerMuscle {
  id: number;
  name: string;
  name_en?: string;
  is_front?: boolean;
}

interface WgerEquipment {
  id: number;
  name: string;
}

interface WgerCategory {
  id: number;
  name: string;
}

interface WgerTranslation {
  id: number;
  name: string;
  description?: string;
  language: number;
}

interface WgerExercise {
  id: number;
  uuid: string;
  category: WgerCategory;
  muscles: WgerMuscle[];
  muscles_secondary: WgerMuscle[];
  equipment: WgerEquipment[];
  images: { image: string }[];
  translations: WgerTranslation[];
}

interface WgerPage<T> {
  count: number;
  next: string | null;
  results: T[];
}

// wger category id -> our MovementCategory
const CATEGORY_MAP: Record<number, MovementCategory> = {
  8: "CORE", // Abs
  9: "PULL", // Arms (mostly biceps/triceps mixed; we'll refine via muscles)
  10: "LEGS", // Legs
  11: "PUSH", // Chest
  12: "PULL", // Back
  13: "PUSH", // Shoulders
  14: "LEGS", // Calves
  15: "CARDIO" // Cardio
};

// wger muscle id -> our MuscleGroup
const MUSCLE_MAP: Record<number, MuscleGroup> = {
  1: "BICEPS", // Biceps brachii
  2: "SHOULDERS_FRONT", // Anterior deltoid
  3: "CHEST", // Serratus anterior
  4: "CHEST", // Pectoralis major
  5: "TRICEPS", // Triceps brachii
  6: "ABS", // Rectus abdominis
  7: "CALVES", // Gastrocnemius
  8: "GLUTES", // Gluteus maximus
  9: "UPPER_BACK", // Trapezius
  10: "QUADS", // Quadriceps femoris
  11: "HAMSTRINGS", // Biceps femoris
  12: "LATS", // Latissimus dorsi
  13: "BICEPS", // Brachialis (close enough)
  14: "OBLIQUES", // Obliquus externus
  15: "CALVES", // Soleus
  16: "LOWER_BACK" // Erector spinae
};

// wger equipment id -> our Equipment
const EQUIPMENT_MAP: Record<number, Equipment> = {
  1: "BARBELL",
  2: "BARBELL", // SZ-Bar
  3: "DUMBBELL",
  4: "BODYWEIGHT", // Gym mat
  5: "SWISS_BALL",
  6: "PULL_UP_BAR",
  7: "BODYWEIGHT", // none
  8: "BENCH",
  9: "BENCH", // Incline bench
  10: "KETTLEBELL"
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
}

function dedupe<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function inferDifficulty(equipment: Equipment[]): Difficulty {
  if (equipment.includes("BARBELL")) return "INTERMEDIATE";
  if (equipment.includes("GYMNASTIC_RINGS")) return "ADVANCED";
  return "BEGINNER";
}

async function fetchAll(): Promise<WgerExercise[]> {
  const all: WgerExercise[] = [];
  let next: string | null = `${WGER_BASE}/exerciseinfo/?limit=${PAGE_SIZE}`;
  let page = 0;

  while (next) {
    page += 1;
    console.log(`Fetching page ${page} (${all.length} so far)...`);
    const response = await fetch(next);
    if (!response.ok) {
      throw new Error(`wger fetch failed: ${response.status} ${response.statusText}`);
    }
    const data = (await response.json()) as WgerPage<WgerExercise>;
    all.push(...data.results);
    next = data.next;
  }

  console.log(`Total fetched: ${all.length}`);
  return all;
}

interface NormalizedExercise {
  slug: string;
  nameEn: string;
  nameRu: string | null;
  category: MovementCategory;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment[];
  difficulty: Difficulty;
  instructions: string | null;
  imageUrl: string | null;
  sourceId: string;
}

function normalize(exercise: WgerExercise): NormalizedExercise | null {
  const en = exercise.translations.find((t) => t.language === LANG_EN);
  if (!en || !en.name) {
    return null;
  }
  const ru = exercise.translations.find((t) => t.language === LANG_RU);

  const category = CATEGORY_MAP[exercise.category.id];
  if (!category) {
    return null;
  }

  const primaryMuscles = dedupe(
    exercise.muscles.map((m) => MUSCLE_MAP[m.id]).filter((m): m is MuscleGroup => Boolean(m))
  );
  const secondaryMuscles = dedupe(
    exercise.muscles_secondary
      .map((m) => MUSCLE_MAP[m.id])
      .filter((m): m is MuscleGroup => Boolean(m))
      .filter((m) => !primaryMuscles.includes(m))
  );
  if (primaryMuscles.length === 0 && category !== "CARDIO") {
    return null;
  }

  const equipment = dedupe(
    exercise.equipment.map((e) => EQUIPMENT_MAP[e.id] ?? ("OTHER" as Equipment))
  );
  if (equipment.length === 0) {
    equipment.push("BODYWEIGHT");
  }

  const slug = slugify(en.name);
  if (!slug) {
    return null;
  }

  return {
    slug,
    nameEn: en.name,
    nameRu: ru?.name ?? null,
    category,
    primaryMuscles,
    secondaryMuscles,
    equipment,
    difficulty: inferDifficulty(equipment),
    instructions: en.description ? stripHtml(en.description) : null,
    imageUrl: exercise.images[0]?.image ?? null,
    sourceId: String(exercise.id)
  };
}

async function main() {
  console.log("=== FitReward exercise seeder ===");
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const raw = await fetchAll();
  const normalized: NormalizedExercise[] = [];
  const seenSlugs = new Set<string>();
  let skipped = 0;

  for (const exercise of raw) {
    const norm = normalize(exercise);
    if (!norm) {
      skipped += 1;
      continue;
    }
    // Dedupe within the same import batch — wger sometimes has variants with same name.
    if (seenSlugs.has(norm.slug)) {
      skipped += 1;
      continue;
    }
    seenSlugs.add(norm.slug);
    normalized.push(norm);
  }

  console.log(`Normalized: ${normalized.length} (skipped ${skipped})`);

  const result = await prisma.exerciseCatalog.createMany({
    data: normalized,
    skipDuplicates: true
  });

  console.log(`Inserted: ${result.count}`);
  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
