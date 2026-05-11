import { Router } from "express";

const router = Router();

router.get("/", async (_req, res) => {
  res.json([]);
});

router.post("/", async (req, res) => {
  res.status(201).json({ ...req.body, id: "progress_stub" });
});

export default router;
