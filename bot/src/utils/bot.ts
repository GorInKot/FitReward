import { Telegraf } from "telegraf";

export function createBot(token: string) {
  return new Telegraf(token);
}
