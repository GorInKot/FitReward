-- Exercise catalog: source-of-truth of available movements, seeded from wger.de
CREATE TYPE "MovementCategory" AS ENUM (
  'PUSH',
  'PULL',
  'LEGS',
  'CORE',
  'CARDIO',
  'FULL_BODY_COMPOUND'
);

CREATE TYPE "MuscleGroup" AS ENUM (
  'CHEST',
  'UPPER_BACK',
  'LATS',
  'LOWER_BACK',
  'SHOULDERS_FRONT',
  'SHOULDERS_SIDE',
  'SHOULDERS_REAR',
  'BICEPS',
  'TRICEPS',
  'FOREARMS',
  'QUADS',
  'HAMSTRINGS',
  'GLUTES',
  'CALVES',
  'ABS',
  'OBLIQUES'
);

CREATE TYPE "Equipment" AS ENUM (
  'BARBELL',
  'DUMBBELL',
  'KETTLEBELL',
  'MACHINE',
  'CABLE',
  'BODYWEIGHT',
  'RESISTANCE_BAND',
  'BENCH',
  'PULL_UP_BAR',
  'GYMNASTIC_RINGS',
  'SWISS_BALL',
  'OTHER'
);

CREATE TYPE "Difficulty" AS ENUM (
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED'
);

CREATE TABLE "ExerciseCatalog" (
  "id"               TEXT NOT NULL,
  "slug"             TEXT NOT NULL,
  "nameEn"           TEXT NOT NULL,
  "nameRu"           TEXT,
  "category"         "MovementCategory" NOT NULL,
  "primaryMuscles"   "MuscleGroup"[] DEFAULT ARRAY[]::"MuscleGroup"[],
  "secondaryMuscles" "MuscleGroup"[] DEFAULT ARRAY[]::"MuscleGroup"[],
  "equipment"        "Equipment"[] DEFAULT ARRAY[]::"Equipment"[],
  "difficulty"       "Difficulty" NOT NULL DEFAULT 'BEGINNER',
  "instructions"     TEXT,
  "imageUrl"         TEXT,
  "sourceId"         TEXT,
  "source"           TEXT NOT NULL DEFAULT 'wger',
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ExerciseCatalog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ExerciseCatalog_slug_key" ON "ExerciseCatalog"("slug");
CREATE INDEX "ExerciseCatalog_category_idx" ON "ExerciseCatalog"("category");
CREATE INDEX "ExerciseCatalog_source_sourceId_idx" ON "ExerciseCatalog"("source", "sourceId");
