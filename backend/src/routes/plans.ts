import { Router } from "express";
import { generateAIPlan } from "../services/aiPlanGenerator";

const router = Router();

router.post("/generate", async (req, res) => {
  const plan = generateAIPlan(req.body);
  res.json(plan);
});

export default router;
