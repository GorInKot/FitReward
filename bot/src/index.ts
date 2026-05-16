import "dotenv/config";
import express from "express";
import { createBot } from "./utils/bot";
import { registerStartHandler } from "./handlers/start";
import { registerCommandHandlers } from "./handlers/commands";
import { runReminders } from "./services/reminders";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

const port = Number(process.env.PORT || 3000);
const publicUrl = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
const WEBHOOK_PATH = "/telegram/webhook";

// Telegram requires the webhook secret token to match [A-Za-z0-9_-]{1,256}.
const secretToken =
  (process.env.WEBHOOK_SECRET || process.env.INTERNAL_API_SECRET || "fitreward")
    .replace(/[^A-Za-z0-9_-]/g, "")
    .slice(0, 64) || "fitreward";

const bot = createBot(token);

registerStartHandler(bot);
registerCommandHandlers(bot);

bot.on("pre_checkout_query", async (ctx) => {
  await ctx.answerPreCheckoutQuery(true);
});

bot.on("successful_payment", async (ctx) => {
  if (!ctx.message || !("successful_payment" in ctx.message)) {
    return;
  }
  console.log(`Payment successful: ${ctx.message.successful_payment.invoice_payload}`);
});

const app = express();

app.get("/health", (_req, res) => res.json({ ok: true }));

// Triggered hourly by an external cron. Responds immediately — the reminder
// pass can outlive the request (cold starts, many users) without losing work.
app.post("/tasks/reminders", (req, res) => {
  if (req.header("x-internal-secret") !== process.env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json({ ok: true });
  void runReminders(bot).catch((error) => console.error("[reminders] run failed", error));
});

app.use(bot.webhookCallback(WEBHOOK_PATH, { secretToken }));

app.listen(port, async () => {
  console.log(`FitReward bot listening on :${port}`);
  if (!publicUrl) {
    console.warn("PUBLIC_URL not set — Telegram webhook was not registered");
    return;
  }
  try {
    await bot.telegram.setWebhook(`${publicUrl}${WEBHOOK_PATH}`, { secret_token: secretToken });
    console.log(`Webhook registered: ${publicUrl}${WEBHOOK_PATH}`);
  } catch (error) {
    console.error("Failed to register webhook", error);
  }
});
