-- Workout session tables: actual training logs with sets/reps/RIR.
CREATE TABLE "WorkoutSession" (
  "id"               TEXT NOT NULL,
  "userId"           TEXT NOT NULL,
  "programDayId"     TEXT,
  "dayName"          TEXT NOT NULL,
  "startedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt"      TIMESTAMP(3),
  "perceivedFatigue" INTEGER,
  "notes"            TEXT,

  CONSTRAINT "WorkoutSession_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WorkoutSession_userId_completedAt_idx" ON "WorkoutSession"("userId", "completedAt");
CREATE INDEX "WorkoutSession_userId_startedAt_idx" ON "WorkoutSession"("userId", "startedAt");

ALTER TABLE "WorkoutSession"
  ADD CONSTRAINT "WorkoutSession_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkoutSession"
  ADD CONSTRAINT "WorkoutSession_programDayId_fkey"
  FOREIGN KEY ("programDayId") REFERENCES "ProgramDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "SessionExercise" (
  "id"                TEXT NOT NULL,
  "sessionId"         TEXT NOT NULL,
  "exerciseCatalogId" TEXT NOT NULL,
  "order"             INTEGER NOT NULL,
  "slotName"          TEXT NOT NULL,
  "suggestedSets"     INTEGER NOT NULL,
  "suggestedRepsLow"  INTEGER NOT NULL,
  "suggestedRepsHigh" INTEGER NOT NULL,
  "suggestedRestSec"  INTEGER NOT NULL,
  "completedAt"       TIMESTAMP(3),

  CONSTRAINT "SessionExercise_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SessionExercise_sessionId_idx" ON "SessionExercise"("sessionId");

ALTER TABLE "SessionExercise"
  ADD CONSTRAINT "SessionExercise_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SessionExercise"
  ADD CONSTRAINT "SessionExercise_exerciseCatalogId_fkey"
  FOREIGN KEY ("exerciseCatalogId") REFERENCES "ExerciseCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "SetLog" (
  "id"                TEXT NOT NULL,
  "sessionExerciseId" TEXT NOT NULL,
  "setNumber"         INTEGER NOT NULL,
  "weight"            DOUBLE PRECISION,
  "reps"              INTEGER NOT NULL,
  "rir"               INTEGER,
  "completedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "SetLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SetLog_sessionExerciseId_idx" ON "SetLog"("sessionExerciseId");

ALTER TABLE "SetLog"
  ADD CONSTRAINT "SetLog_sessionExerciseId_fkey"
  FOREIGN KEY ("sessionExerciseId") REFERENCES "SessionExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
