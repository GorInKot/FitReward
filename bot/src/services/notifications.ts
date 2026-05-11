import { Telegraf } from "telegraf";

interface Workout {
  id: string;
  name: string;
  duration: number;
}

interface Achievement {
  name: string;
  description: string;
  reward: number;
}

export async function sendWorkoutReminder(bot: Telegraf, userId: number, workout: Workout) {
  await bot.telegram.sendMessage(
    userId,
    `💪 Время тренировки: ${workout.name}\n⏱ Длительность: ${workout.duration} мин`,
    {
      reply_markup: {
        inline_keyboard: [[{ text: "▶️ Начать тренировку", web_app: { url: `${process.env.WEBAPP_URL}/workout/${workout.id}` } }]]
      }
    }
  );
}

export async function sendAchievementNotification(bot: Telegraf, userId: number, achievement: Achievement) {
  await bot.telegram.sendMessage(
    userId,
    `🎉 Достижение получено!\n\n🏆 ${achievement.name}\n${achievement.description}\n\n⭐ Награда: ${achievement.reward} Stars`,
    {
      reply_markup: {
        inline_keyboard: [[{ text: "🎁 Забрать награду", web_app: { url: `${process.env.WEBAPP_URL}/achievements` } }]]
      }
    }
  );
}
