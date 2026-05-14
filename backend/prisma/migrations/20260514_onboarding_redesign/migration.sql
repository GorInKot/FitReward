-- Drop old workout/exercise/progress/achievement tables and their FKs.
DROP TABLE IF EXISTS "UserAchievement" CASCADE;
DROP TABLE IF EXISTS "Achievement" CASCADE;
DROP TABLE IF EXISTS "Progress" CASCADE;
DROP TABLE IF EXISTS "Exercise" CASCADE;
DROP TABLE IF EXISTS "Workout" CASCADE;

-- Strip old columns from User before dropping their enum types.
ALTER TABLE "User"
  DROP COLUMN IF EXISTS "fitnessLevel",
  DROP COLUMN IF EXISTS "goals";

-- Drop old enum types.
DROP TYPE IF EXISTS "FitnessLevel";
DROP TYPE IF EXISTS "Goal";
DROP TYPE IF EXISTS "WorkoutType";
DROP TYPE IF EXISTS "ExerciseType";
DROP TYPE IF EXISTS "AchievementType";

-- New onboarding enums.
CREATE TYPE "PrimaryGoal" AS ENUM (
  'MUSCLE_GAIN',
  'FAT_LOSS',
  'GENERAL_FITNESS',
  'STRENGTH',
  'ENDURANCE',
  'BODY_RECOMPOSITION',
  'RETURN_AFTER_BREAK'
);

CREATE TYPE "ExperienceLevel" AS ENUM (
  'NEVER',
  'LESS_THAN_6_MONTHS',
  'ONE_TO_TWO_YEARS',
  'THREE_PLUS_YEARS'
);

CREATE TYPE "TrainingEnvironment" AS ENUM (
  'GYM',
  'HOME',
  'HOME_MINIMAL',
  'BODYWEIGHT'
);

CREATE TYPE "Limitation" AS ENUM (
  'NONE',
  'LOWER_BACK',
  'KNEES',
  'SHOULDERS',
  'POST_INJURY'
);

CREATE TYPE "TrainingStructure" AS ENUM (
  'FULL_BODY',
  'UPPER_LOWER',
  'PUSH_PULL_LEGS',
  'SPLIT'
);

-- Add onboarding fields to User.
ALTER TABLE "User"
  ADD COLUMN "primaryGoal" "PrimaryGoal",
  ADD COLUMN "experienceLevel" "ExperienceLevel",
  ADD COLUMN "trainingDaysPerWeek" INTEGER,
  ADD COLUMN "trainingEnvironment" "TrainingEnvironment",
  ADD COLUMN "limitations" "Limitation"[] DEFAULT ARRAY[]::"Limitation"[],
  ADD COLUMN "recommendedStructure" "TrainingStructure",
  ADD COLUMN "recommendationReasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "onboardingCompletedAt" TIMESTAMP(3);
