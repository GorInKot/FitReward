import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import workoutRoutes from "./routes/workouts";
import progressRoutes from "./routes/progress";
import plansRoutes from "./routes/plans";
import achievementRoutes from "./routes/achievements";
import profileRoutes from "./routes/profile";
import { requireTelegramAuth } from "./middleware/telegramAuth";

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
app.use("/api/workouts", workoutRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/profile", requireTelegramAuth, profileRoutes);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`FitReward backend listening on :${port}`);
});
