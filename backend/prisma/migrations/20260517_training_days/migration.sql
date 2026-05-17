-- Explicit training weekdays chosen by the user (0=Sun..6=Sat). An empty
-- array falls back to the frequency-based default; drives bot reminders
-- and the schedule picker in the Mini App.
ALTER TABLE "User" ADD COLUMN "trainingDays" INTEGER[] NOT NULL DEFAULT ARRAY[]::integer[];
