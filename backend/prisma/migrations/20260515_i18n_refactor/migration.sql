-- i18n refactor: drop recommendationReasons (now computed on-the-fly per request,
-- frontend translates from {key, params} pairs in the onboarding response).
ALTER TABLE "User" DROP COLUMN IF EXISTS "recommendationReasons";
