-- Reminder + localization fields on User: drive training-day reminders via the bot.
ALTER TABLE "User" ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'UTC';
ALTER TABLE "User" ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'en';
ALTER TABLE "User" ADD COLUMN "reminderHour" INTEGER NOT NULL DEFAULT 18;
ALTER TABLE "User" ADD COLUMN "remindersEnabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "lastReminderSentAt" TIMESTAMP(3);
