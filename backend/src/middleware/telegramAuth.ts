import type { NextFunction, Request, Response } from "express";
import { parseTelegramInitData } from "../utils/telegramAuth";

const INIT_DATA_HEADER = "x-telegram-init-data";
const DEV_TELEGRAM_ID_HEADER = "x-dev-telegram-id";

function isDevBypassEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.ALLOW_DEV_AUTH === "true";
}

export function requireTelegramAuth(req: Request, res: Response, next: NextFunction) {
  const initData = req.header(INIT_DATA_HEADER);

  if (initData) {
    const result = parseTelegramInitData(initData, process.env.TELEGRAM_BOT_TOKEN || "");
    if (!result.ok) {
      return res.status(401).json({ error: "Invalid Telegram initData", reason: result.reason });
    }
    req.telegramId = result.telegramId;
    return next();
  }

  if (isDevBypassEnabled()) {
    const devId = req.header(DEV_TELEGRAM_ID_HEADER) || "demo-telegram-user";
    req.telegramId = devId;
    return next();
  }

  return res.status(401).json({ error: "Telegram initData required" });
}
