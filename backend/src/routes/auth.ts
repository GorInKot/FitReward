import { Router } from "express";
import { z } from "zod";
import { validateTelegramInitData } from "../utils/telegramAuth";

const router = Router();

router.post("/telegram", async (req, res) => {
  const schema = z.object({ initData: z.string().min(1) });
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const valid = validateTelegramInitData(parsed.data.initData, process.env.TELEGRAM_BOT_TOKEN || "");
  if (!valid) {
    return res.status(401).json({ error: "Invalid Telegram initData" });
  }

  return res.json({ token: "mvp-token", user: { telegramId: "stub" } });
});

export default router;
