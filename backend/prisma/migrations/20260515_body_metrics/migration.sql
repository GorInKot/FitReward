-- Body metrics: weight / body fat / notes per date.
CREATE TABLE "BodyMetric" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "date"      TIMESTAMP(3) NOT NULL,
  "weight"    DOUBLE PRECISION,
  "bodyFat"   DOUBLE PRECISION,
  "notes"     TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "BodyMetric_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BodyMetric_userId_date_idx" ON "BodyMetric"("userId", "date");

ALTER TABLE "BodyMetric"
  ADD CONSTRAINT "BodyMetric_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
