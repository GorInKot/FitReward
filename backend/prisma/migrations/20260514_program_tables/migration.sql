-- Program tables: generated training plan per user.
CREATE TYPE "ProgramStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

CREATE TABLE "Program" (
  "id"          TEXT NOT NULL,
  "userId"      TEXT NOT NULL,
  "structure"   "TrainingStructure" NOT NULL,
  "status"      "ProgramStatus" NOT NULL DEFAULT 'ACTIVE',
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "archivedAt"  TIMESTAMP(3),

  CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Program_userId_status_idx" ON "Program"("userId", "status");

ALTER TABLE "Program"
  ADD CONSTRAINT "Program_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ProgramDay" (
  "id"        TEXT NOT NULL,
  "programId" TEXT NOT NULL,
  "order"     INTEGER NOT NULL,
  "name"      TEXT NOT NULL,

  CONSTRAINT "ProgramDay_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProgramDay_programId_idx" ON "ProgramDay"("programId");

ALTER TABLE "ProgramDay"
  ADD CONSTRAINT "ProgramDay_programId_fkey"
  FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ProgramExerciseSlot" (
  "id"                TEXT NOT NULL,
  "programDayId"      TEXT NOT NULL,
  "order"             INTEGER NOT NULL,
  "exerciseCatalogId" TEXT NOT NULL,
  "slotName"          TEXT NOT NULL,
  "suggestedSets"     INTEGER NOT NULL,
  "suggestedRepsLow"  INTEGER NOT NULL,
  "suggestedRepsHigh" INTEGER NOT NULL,
  "suggestedRestSec"  INTEGER NOT NULL,

  CONSTRAINT "ProgramExerciseSlot_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProgramExerciseSlot_programDayId_idx" ON "ProgramExerciseSlot"("programDayId");

ALTER TABLE "ProgramExerciseSlot"
  ADD CONSTRAINT "ProgramExerciseSlot_programDayId_fkey"
  FOREIGN KEY ("programDayId") REFERENCES "ProgramDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProgramExerciseSlot"
  ADD CONSTRAINT "ProgramExerciseSlot_exerciseCatalogId_fkey"
  FOREIGN KEY ("exerciseCatalogId") REFERENCES "ExerciseCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
