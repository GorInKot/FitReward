import { Router } from "express";
import { checkAchievements } from "../services/achievementEngine";

const router = Router();

router.get("/:userId", async (req, res) => {
  const data = await checkAchievements(req.params.userId);
  res.json(data);
});

export default router;
