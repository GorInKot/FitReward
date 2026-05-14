/**
 * Mirror of enums in prisma/schema.prisma.
 * Used in routes so TypeScript does not depend on generated @prisma/client exports for editor diagnostics.
 */

export const PrimaryGoal = {
  MUSCLE_GAIN: "MUSCLE_GAIN",
  FAT_LOSS: "FAT_LOSS",
  GENERAL_FITNESS: "GENERAL_FITNESS",
  STRENGTH: "STRENGTH",
  ENDURANCE: "ENDURANCE",
  BODY_RECOMPOSITION: "BODY_RECOMPOSITION",
  RETURN_AFTER_BREAK: "RETURN_AFTER_BREAK"
} as const;
export type PrimaryGoal = (typeof PrimaryGoal)[keyof typeof PrimaryGoal];

export const ExperienceLevel = {
  NEVER: "NEVER",
  LESS_THAN_6_MONTHS: "LESS_THAN_6_MONTHS",
  ONE_TO_TWO_YEARS: "ONE_TO_TWO_YEARS",
  THREE_PLUS_YEARS: "THREE_PLUS_YEARS"
} as const;
export type ExperienceLevel = (typeof ExperienceLevel)[keyof typeof ExperienceLevel];

export const TrainingEnvironment = {
  GYM: "GYM",
  HOME: "HOME",
  HOME_MINIMAL: "HOME_MINIMAL",
  BODYWEIGHT: "BODYWEIGHT"
} as const;
export type TrainingEnvironment = (typeof TrainingEnvironment)[keyof typeof TrainingEnvironment];

export const Limitation = {
  NONE: "NONE",
  LOWER_BACK: "LOWER_BACK",
  KNEES: "KNEES",
  SHOULDERS: "SHOULDERS",
  POST_INJURY: "POST_INJURY"
} as const;
export type Limitation = (typeof Limitation)[keyof typeof Limitation];

export const TrainingStructure = {
  FULL_BODY: "FULL_BODY",
  UPPER_LOWER: "UPPER_LOWER",
  PUSH_PULL_LEGS: "PUSH_PULL_LEGS",
  SPLIT: "SPLIT"
} as const;
export type TrainingStructure = (typeof TrainingStructure)[keyof typeof TrainingStructure];
