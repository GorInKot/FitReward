import { Telegraf } from "telegraf";

export function registerStartHandler(bot: Telegraf) {
  bot.start((ctx) => {
    ctx.reply("👋 Добро пожаловать в FitReward!\n\nОткройте приложение для планирования тренировок:", {
      reply_markup: {
        inline_keyboard: [[{ text: "🏃‍♂️ Открыть FitReward", web_app: { url: process.env.WEBAPP_URL || "" } }]]
      }
    });
  });
}
