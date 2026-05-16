import { Telegraf } from "telegraf";
import { fetchReminderTargets } from "../utils/api";
import { dayName, messages, openKeyboard, pickLocale } from "../i18n";

/**
 * One reminder pass: ask the backend who needs a training-day nudge right now
 * and deliver it. Triggered hourly by an external cron hitting /tasks/reminders.
 */
export async function runReminders(bot: Telegraf): Promise<void> {
  const targets = await fetchReminderTargets();

  let sent = 0;
  for (const target of targets) {
    const locale = pickLocale(target.locale);
    const m = messages(locale);
    const text = target.nextDayName
      ? `${m.reminderTitle}\n\n${m.reminderBody(dayName(target.nextDayName, locale))}`
      : `${m.reminderTitle}\n\n${m.reminderGeneric}`;
    try {
      await bot.telegram.sendMessage(target.telegramId, text, openKeyboard(locale));
      sent += 1;
    } catch (error) {
      console.error(`[reminders] send to ${target.telegramId} failed`, error);
    }
  }

  console.log(`[reminders] ${sent}/${targets.length} reminder(s) delivered`);
}
