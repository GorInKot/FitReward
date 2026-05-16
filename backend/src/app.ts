import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import onboardingRoutes from "./routes/onboarding";
import exerciseRoutes from "./routes/exercises";
import programRoutes from "./routes/program";
import sessionRoutes from "./routes/sessions";
import metricsRoutes from "./routes/metrics";
import dashboardRoutes from "./routes/dashboard";
import achievementsRoutes from "./routes/achievements";
import { requireTelegramAuth } from "./middleware/telegramAuth";
import { seedAchievements } from "./services/achievementEngine";
import { seedCuratedExercises } from "./services/curatedExerciseSeeder";

const app = express();

const corsOriginEnv = (process.env.CORS_ORIGIN ?? "").trim();
const corsOrigin =
  corsOriginEnv === "" || corsOriginEnv === "*"
    ? true
    : corsOriginEnv.split(",").map((value) => value.trim()).filter(Boolean);

app.set("trust proxy", 1);
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get("/", (_req, res) =>
  res.json({
    name: "FitReward API",
    ok: true,
    health: "/health"
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/profile", requireTelegramAuth, profileRoutes);
app.use("/api/onboarding", requireTelegramAuth, onboardingRoutes);
app.use("/api/exercises", requireTelegramAuth, exerciseRoutes);
app.use("/api/program", requireTelegramAuth, programRoutes);
app.use("/api/sessions", requireTelegramAuth, sessionRoutes);
app.use("/api/metrics", requireTelegramAuth, metricsRoutes);
app.use("/api/dashboard", requireTelegramAuth, dashboardRoutes);
app.use("/api/achievements", requireTelegramAuth, achievementsRoutes);

const port = Number(process.env.PORT || 3000);
app.listen(port, async () => {
  console.log(`FitReward backend listening on :${port}`);
  // Idempotent — upserts the fixed achievement catalog from code.
  try {
    await seedAchievements();
    console.log("[achievements] catalog seeded");
  } catch (error) {
    console.error("[achievements] seed failed", error);
  }
  // Idempotent — upserts the curated bilingual exercise catalog.
  try {
    await seedCuratedExercises();
    console.log("[exercises] curated catalog seeded");
  } catch (error) {
    console.error("[exercises] curated seed failed", error);
  }
});
