import {
  Difficulty,
  Equipment,
  ExperienceLevel,
  Limitation,
  MovementCategory,
  MuscleGroup,
  PrimaryGoal,
  TrainingEnvironment,
  TrainingStructure
} from "../prismaEnums";
import { prisma } from "../utils/database";
import {
  equipmentForEnvironment,
  excludedMusclesFor,
  maxDifficultyFor,
  rankByEquipment
} from "./equipmentFilters";
import { prescriptionFor, slotCountFor } from "./prescription";
import { Slot, getDayTemplates } from "./programTemplates";

export interface GeneratorInput {
  userId: string;
  primaryGoal: PrimaryGoal;
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
  trainingEnvironment: TrainingEnvironment;
  limitations: Limitation[];
  structure: TrainingStructure;
}

interface CatalogCandidate {
  id: string;
  slug: string;
  nameEn: string;
  nameRu: string | null;
  category: MovementCategory;
  primaryMuscles: MuscleGroup[];
  equipment: Equipment[];
  difficulty: Difficulty;
}

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3
};

function difficultyAllowed(diff: Difficulty, max: Difficulty): boolean {
  return DIFFICULTY_RANK[diff] <= DIFFICULTY_RANK[max];
}

function preferredDifficulty(experience: ExperienceLevel): Difficulty {
  switch (experience) {
    case "NEVER":
    case "LESS_THAN_6_MONTHS":
      return "BEGINNER";
    case "ONE_TO_TWO_YEARS":
      return "INTERMEDIATE";
    case "THREE_PLUS_YEARS":
      return "ADVANCED";
  }
}

function scoreCandidate(
  candidate: CatalogCandidate,
  slot: Slot,
  prefDifficulty: Difficulty
): number {
  let score = 0;

  // Strong preference: primaryMuscle match
  if (slot.primaryMuscle && candidate.primaryMuscles.includes(slot.primaryMuscle)) {
    score += 100;
  }

  // Category match is already filtered for, but reward exact match
  if (candidate.category === slot.category) {
    score += 10;
  }

  // Difficulty preference
  if (candidate.difficulty === prefDifficulty) {
    score += 25;
  } else if (
    Math.abs(DIFFICULTY_RANK[candidate.difficulty] - DIFFICULTY_RANK[prefDifficulty]) === 1
  ) {
    score += 10;
  }

  // Equipment quality
  score += rankByEquipment(candidate.equipment);

  return score;
}

interface PickedSlot {
  slot: Slot;
  exercise: CatalogCandidate;
}

interface GeneratedDay {
  name: string;
  picks: PickedSlot[];
}

export interface GeneratedProgram {
  structure: TrainingStructure;
  days: GeneratedDay[];
}

/**
 * Generates a program and persists it (archiving any previously active one).
 * Returns the generated Program id.
 */
export async function generateAndSaveProgram(input: GeneratorInput): Promise<string> {
  const generated = await generateProgram(input);

  return prisma.$transaction(async (tx) => {
    // Archive previous active programs.
    await tx.program.updateMany({
      where: { userId: input.userId, status: "ACTIVE" },
      data: { status: "ARCHIVED", archivedAt: new Date() }
    });

    const program = await tx.program.create({
      data: {
        userId: input.userId,
        structure: generated.structure,
        status: "ACTIVE",
        days: {
          create: generated.days.map((day, dayIndex) => ({
            order: dayIndex + 1,
            name: day.name,
            exercises: {
              create: day.picks.map((pick, slotIndex) => {
                const presc = prescriptionFor(input.primaryGoal, pick.slot.isCompound);
                return {
                  order: slotIndex + 1,
                  slotName: pick.slot.name,
                  exerciseCatalogId: pick.exercise.id,
                  suggestedSets: presc.sets,
                  suggestedRepsLow: presc.repsLow,
                  suggestedRepsHigh: presc.repsHigh,
                  suggestedRestSec: presc.restSec
                };
              })
            }
          }))
        }
      },
      select: { id: true }
    });

    return program.id;
  });
}

/**
 * Pure generation logic — picks exercises for each day without persisting.
 * Exposed for testing/preview.
 */
export async function generateProgram(input: GeneratorInput): Promise<GeneratedProgram> {
  const availableEquipment = equipmentForEnvironment(input.trainingEnvironment);
  const excludedMuscles = excludedMusclesFor(input.limitations);
  const maxDifficulty = maxDifficultyFor(input.limitations);
  const prefDifficulty = preferredDifficulty(input.experienceLevel);
  const slotCount = slotCountFor(input.experienceLevel);

  const dayTemplates = getDayTemplates(input.structure);
  const dayCount = Math.max(1, Math.min(7, input.trainingDaysPerWeek));

  // Per-day candidate fetcher with caching: same slot may appear in multiple days.
  // We cache by category+muscle+difficulty cap to avoid round trips.
  const cache = new Map<string, CatalogCandidate[]>();
  async function candidatesFor(slot: Slot): Promise<CatalogCandidate[]> {
    const key = `${slot.category}|${slot.primaryMuscle ?? ""}`;
    const cached = cache.get(key);
    if (cached) return cached;

    const where = {
      category: slot.category,
      ...(slot.primaryMuscle ? { primaryMuscles: { has: slot.primaryMuscle } } : {}),
      equipment: { hasSome: availableEquipment }
    };

    const rows = await prisma.exerciseCatalog.findMany({
      where,
      select: {
        id: true,
        slug: true,
        nameEn: true,
        nameRu: true,
        category: true,
        primaryMuscles: true,
        equipment: true,
        difficulty: true
      },
      take: 100
    });

    const filtered = rows.filter((row) => {
      if (!difficultyAllowed(row.difficulty, maxDifficulty)) return false;
      if (excludedMuscles.some((m) => row.primaryMuscles.includes(m))) return false;
      return true;
    });

    cache.set(key, filtered);
    return filtered;
  }

  const usedSlugs = new Set<string>();
  const days: GeneratedDay[] = [];

  for (let dayIndex = 0; dayIndex < dayCount; dayIndex++) {
    const template = dayTemplates[dayIndex % dayTemplates.length];
    const slotsForDay = template.slots.slice(0, slotCount);
    const picks: PickedSlot[] = [];
    const dayUsed = new Set<string>();

    for (const slot of slotsForDay) {
      const all = await candidatesFor(slot);
      if (all.length === 0) continue;

      // Rank: not yet used (in program) > not yet used today > anything
      const ranked = all
        .map((c) => ({
          c,
          score: scoreCandidate(c, slot, prefDifficulty),
          freshness: usedSlugs.has(c.slug) ? 0 : 2 - (dayUsed.has(c.slug) ? 1 : 0)
        }))
        .sort((a, b) => {
          if (b.freshness !== a.freshness) return b.freshness - a.freshness;
          return b.score - a.score;
        });

      const pick = ranked[0]?.c;
      if (!pick) continue;
      picks.push({ slot, exercise: pick });
      usedSlugs.add(pick.slug);
      dayUsed.add(pick.slug);
    }

    const dayName = dayTemplates.length === 1
      ? `День ${dayIndex + 1}: ${template.name}`
      : `День ${dayIndex + 1}: ${template.name}`;

    days.push({ name: dayName, picks });
  }

  return { structure: input.structure, days };
}
