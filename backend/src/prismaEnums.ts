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

export const MovementCategory = {
  PUSH: "PUSH",
  PULL: "PULL",
  LEGS: "LEGS",
  CORE: "CORE",
  CARDIO: "CARDIO",
  FULL_BODY_COMPOUND: "FULL_BODY_COMPOUND"
} as const;
export type MovementCategory = (typeof MovementCategory)[keyof typeof MovementCategory];

export const MuscleGroup = {
  CHEST: "CHEST",
  UPPER_BACK: "UPPER_BACK",
  LATS: "LATS",
  LOWER_BACK: "LOWER_BACK",
  SHOULDERS_FRONT: "SHOULDERS_FRONT",
  SHOULDERS_SIDE: "SHOULDERS_SIDE",
  SHOULDERS_REAR: "SHOULDERS_REAR",
  BICEPS: "BICEPS",
  TRICEPS: "TRICEPS",
  FOREARMS: "FOREARMS",
  QUADS: "QUADS",
  HAMSTRINGS: "HAMSTRINGS",
  GLUTES: "GLUTES",
  CALVES: "CALVES",
  ABS: "ABS",
  OBLIQUES: "OBLIQUES"
} as const;
export type MuscleGroup = (typeof MuscleGroup)[keyof typeof MuscleGroup];

export const Equipment = {
  BARBELL: "BARBELL",
  DUMBBELL: "DUMBBELL",
  KETTLEBELL: "KETTLEBELL",
  MACHINE: "MACHINE",
  CABLE: "CABLE",
  BODYWEIGHT: "BODYWEIGHT",
  RESISTANCE_BAND: "RESISTANCE_BAND",
  BENCH: "BENCH",
  PULL_UP_BAR: "PULL_UP_BAR",
  GYMNASTIC_RINGS: "GYMNASTIC_RINGS",
  SWISS_BALL: "SWISS_BALL",
  OTHER: "OTHER"
} as const;
export type Equipment = (typeof Equipment)[keyof typeof Equipment];

export const Difficulty = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED"
} as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const ProgramStatus = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED"
} as const;
export type ProgramStatus = (typeof ProgramStatus)[keyof typeof ProgramStatus];

export const AchievementCategory = {
  CONSISTENCY: "CONSISTENCY",
  MILESTONE: "MILESTONE",
  STRENGTH: "STRENGTH",
  BODY: "BODY"
} as const;
export type AchievementCategory = (typeof AchievementCategory)[keyof typeof AchievementCategory];
