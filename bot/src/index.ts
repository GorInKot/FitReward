import "dotenv/config";
import { createBot } from "./utils/bot";
import { registerStartHandler } from "./handlers/start";
import { registerWorkoutHandlers } from "./handlers/workout";
import { registerAchievementHandlers } from "./handlers/achievements";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

const bot = createBot(token);

registerStartHandler(bot);
registerWorkoutHandlers(bot);
registerAchievementHandlers(bot);

bot.on("pre_checkout_query", async (ctx) => {
  await ctx.answerPreCheckoutQuery(true);
});

bot.on("successful_payment", async (ctx) => {
  if (!ctx.message || !("successful_payment" in ctx.message)) {
    return;
  }
  const { invoice_payload } = ctx.message.successful_payment;
  console.log(`Payment successful: ${invoice_payload}`);
});

bot.launch().then(() => {
  console.log("FitReward bot launched");
});
