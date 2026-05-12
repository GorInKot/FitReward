/**
 * Mirror of enums in prisma/schema.prisma.
 * Used in routes so TypeScript does not depend on generated @prisma/client exports for editor diagnostics.
 */
export const FitnessLevel = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED"
} as const;

export type FitnessLevel = (typeof FitnessLevel)[keyof typeof FitnessLevel];

export const Goal = {
  WEIGHT_LOSS: "WEIGHT_LOSS",
  MUSCLE_GAIN: "MUSCLE_GAIN",
  ENDURANCE: "ENDURANCE",
  STRENGTH: "STRENGTH",
  GENERAL_FITNESS: "GENERAL_FITNESS"
} as const;

export type Goal = (typeof Goal)[keyof typeof Goal];
