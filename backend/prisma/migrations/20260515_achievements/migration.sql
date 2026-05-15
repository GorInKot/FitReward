-- Achievements + per-user unlock tracking.
CREATE TYPE "AchievementCategory" AS ENUM ('CONSISTENCY', 'MILESTONE', 'STRENGTH', 'BODY');

CREATE TABLE "Achievement" (
  "id"        TEXT NOT NULL,
  "key"       TEXT NOT NULL,
  "category"  "AchievementCategory" NOT NULL,
  "threshold" INTEGER,
  "reward"    INTEGER NOT NULL DEFAULT 10,

  CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Achievement_key_key" ON "Achievement"("key");

CREATE TABLE "UserAchievement" (
  "id"            TEXT NOT NULL,
  "userId"        TEXT NOT NULL,
  "achievementId" TEXT NOT NULL,
  "unlockedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notifiedAt"    TIMESTAMP(3),

  CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

ALTER TABLE "UserAchievement"
  ADD CONSTRAINT "UserAchievement_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserAchievement"
  ADD CONSTRAINT "UserAchievement_achievementId_fkey"
  FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
