import { Equipment, Limitation, MuscleGroup, TrainingEnvironment } from "../prismaEnums";

/**
 * Which equipment the user can plausibly use given their environment.
 * BODYWEIGHT is always available — every gym, every home, every park.
 */
const ENVIRONMENT_EQUIPMENT: Record<TrainingEnvironment, Equipment[]> = {
  GYM: [
    "BARBELL",
    "DUMBBELL",
    "KETTLEBELL",
    "MACHINE",
    "CABLE",
    "BODYWEIGHT",
    "BENCH",
    "PULL_UP_BAR",
    "GYMNASTIC_RINGS",
    "RESISTANCE_BAND",
    "SWISS_BALL",
    "OTHER"
  ],
  HOME: [
    "BARBELL",
    "DUMBBELL",
    "KETTLEBELL",
    "BODYWEIGHT",
    "BENCH",
    "PULL_UP_BAR",
    "RESISTANCE_BAND",
    "SWISS_BALL"
  ],
  HOME_MINIMAL: ["DUMBBELL", "KETTLEBELL", "BODYWEIGHT", "RESISTANCE_BAND", "PULL_UP_BAR"],
  BODYWEIGHT: ["BODYWEIGHT", "PULL_UP_BAR"]
};

export function equipmentForEnvironment(env: TrainingEnvironment): Equipment[] {
  return ENVIRONMENT_EQUIPMENT[env];
}

/**
 * Equipment priority for ranking candidates (higher = preferred).
 * Prefer compound free-weight options first; bodyweight as last resort
 * for slots where it's not the primary tool.
 */
const EQUIPMENT_RANK: Record<Equipment, number> = {
  BARBELL: 10,
  DUMBBELL: 9,
  KETTLEBELL: 7,
  MACHINE: 6,
  CABLE: 6,
  BENCH: 5,
  PULL_UP_BAR: 5,
  GYMNASTIC_RINGS: 4,
  RESISTANCE_BAND: 3,
  SWISS_BALL: 2,
  BODYWEIGHT: 2,
  OTHER: 1
};

export function rankByEquipment(equipment: Equipment[]): number {
  if (equipment.length === 0) return 0;
  return Math.max(...equipment.map((e) => EQUIPMENT_RANK[e] ?? 0));
}

/**
 * Returns the set of primaryMuscles that should be EXCLUDED based on limitations.
 * Conservative — we'd rather skip an exercise than risk re-injury.
 *
 * SHOULDERS limitation is NOT included here because filtering all shoulder
 * exercises would leave most upper-body programs incomplete. Document as a
 * known limitation; revisit when we add safer-variant tagging.
 */
export function excludedMusclesFor(limitations: Limitation[]): MuscleGroup[] {
  const excluded: MuscleGroup[] = [];
  if (limitations.includes("LOWER_BACK")) {
    excluded.push("LOWER_BACK");
  }
  return excluded;
}

/**
 * For POST_INJURY, restrict difficulty to BEGINNER to avoid heavy compound work.
 */
export function maxDifficultyFor(limitations: Limitation[]): "BEGINNER" | "INTERMEDIATE" | "ADVANCED" {
  if (limitations.includes("POST_INJURY")) {
    return "BEGINNER";
  }
  return "ADVANCED";
}
