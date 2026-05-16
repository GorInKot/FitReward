import { Telegraf } from "telegraf";
import { fetchUserSummary } from "../utils/api";
import { dayName, messages, openKeyboard, pickLocale } from "../i18n";

/** /today, /streak, /profile — all backed by the internal user-summary endpoint. */
export function registerCommandHandlers(bot: Telegraf) {
  bot.command("today", async (ctx) => {
    const fallbackLocale = pickLocale(ctx.from?.language_code);
    try {
      const summary = await fetchUserSummary(ctx.from.id);
      const locale = pickLocale(summary.locale ?? ctx.from?.language_code);
      const m = messages(locale);

      if (!summary.found || !summary.onboardingCompleted) {
        return ctx.reply(m.notOnboarded, openKeyboard(locale));
      }
      if (summary.trainedToday) {
        return ctx.reply(m.todayDone, openKeyboard(locale));
      }
      if (!summary.isTrainingDay) {
        return ctx.reply(m.todayRest, openKeyboard(locale));
      }
      if (!summary.nextDayName) {
        return ctx.reply(m.todayNoProgram, openKeyboard(locale));
      }
      return ctx.reply(m.today(dayName(summary.nextDayName, locale)), openKeyboard(locale));
    } catch (error) {
      console.error("/today failed", error);
      return ctx.reply(messages(fallbackLocale).error);
    }
  });

  bot.command("streak", async (ctx) => {
    const fallbackLocale = pickLocale(ctx.from?.language_code);
    try {
      const summary = await fetchUserSummary(ctx.from.id);
      const locale = pickLocale(summary.locale ?? ctx.from?.language_code);
      const m = messages(locale);

      if (!summary.found || !summary.onboardingCompleted) {
        return ctx.reply(m.notOnboarded, openKeyboard(locale));
      }
      const streak = summary.streak ?? 0;
      const head = streak > 0 ? m.streak(streak) : m.streakZero;
      return ctx.reply(`${head}\n${m.week(summary.weekSessions ?? 0)}`, openKeyboard(locale));
    } catch (error) {
      console.error("/streak failed", error);
      return ctx.reply(messages(fallbackLocale).error);
    }
  });

  bot.command("profile", async (ctx) => {
    let locale = pickLocale(ctx.from?.language_code);
    try {
      const summary = await fetchUserSummary(ctx.from.id);
      locale = pickLocale(summary.locale ?? ctx.from?.language_code);
    } catch (error) {
      console.error("/profile summary lookup failed", error);
    }
    return ctx.reply(messages(locale).profile, openKeyboard(locale));
  });
}
