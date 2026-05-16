import { Telegraf } from "telegraf";
import { messages, openKeyboard, pickLocale } from "../i18n";

export function registerStartHandler(bot: Telegraf) {
  bot.start((ctx) => {
    const locale = pickLocale(ctx.from?.language_code);
    return ctx.reply(messages(locale).start, openKeyboard(locale));
  });
}
