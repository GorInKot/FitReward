/**
 * Minimal bilingual layer for bot messages. The Mini App owns the full
 * dictionaries — the bot only needs the handful of strings it sends.
 */

export type Locale = "ru" | "en";

export function pickLocale(raw?: string | null): Locale {
  return raw && raw.toLowerCase().startsWith("ru") ? "ru" : "en";
}

const DAY_NAMES: Record<Locale, Record<string, string>> = {
  ru: {
    full_body: "Full-body",
    upper: "Верх тела",
    lower: "Низ тела",
    push: "Push (грудь/плечи/трицепс)",
    pull: "Pull (спина/бицепс)",
    legs: "Ноги",
    chest: "Грудь",
    back: "Спина",
    shoulders: "Плечи",
    arms: "Руки"
  },
  en: {
    full_body: "Full-body",
    upper: "Upper body",
    lower: "Lower body",
    push: "Push (chest/shoulders/triceps)",
    pull: "Pull (back/biceps)",
    legs: "Legs",
    chest: "Chest",
    back: "Back",
    shoulders: "Shoulders",
    arms: "Arms"
  }
};

/** Resolves a stored ProgramDay name — an i18n key (`day.upper`) or legacy literal. */
export function dayName(key: string | null | undefined, locale: Locale): string {
  if (!key) return locale === "ru" ? "тренировка" : "workout";
  const bare = key.startsWith("day.") ? key.slice(4) : key;
  return DAY_NAMES[locale][bare] ?? key;
}

function pluralDaysRu(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "дня";
  return "дней";
}

export interface Messages {
  start: string;
  open: string;
  reminderTitle: string;
  reminderBody: (day: string) => string;
  reminderGeneric: string;
  today: (day: string) => string;
  todayDone: string;
  todayRest: string;
  todayNoProgram: string;
  streak: (n: number) => string;
  streakZero: string;
  week: (n: number) => string;
  profile: string;
  notOnboarded: string;
  error: string;
}

const RU: Messages = {
  start:
    "👋 Добро пожаловать в FitReward!\n\nОткрой приложение, чтобы планировать тренировки и следить за прогрессом.",
  open: "🏃 Открыть FitReward",
  reminderTitle: "💪 Время тренировки",
  reminderBody: (day) =>
    `Сегодня по плану: ${day}.\nОткрой приложение и начни — серия не должна прерываться.`,
  reminderGeneric: "Сегодня тренировочный день. Открой приложение и начни.",
  today: (day) => `🗓 Сегодня тренировочный день.\nПо плану: ${day}.`,
  todayDone: "✅ Сегодня ты уже тренировался. Отличная работа!",
  todayRest: "😌 Сегодня день отдыха — восстанавливайся.",
  todayNoProgram: "У тебя пока нет программы. Создай её в приложении на вкладке «Планы».",
  streak: (n) => `🔥 Твоя серия: ${n} ${pluralDaysRu(n)} подряд.`,
  streakZero: "Серия пока пустая. Заверши тренировку, чтобы её начать!",
  week: (n) => `За последние 7 дней тренировок: ${n}.`,
  profile: "👤 Профиль и настройки — в приложении:",
  notOnboarded: "Сначала пройди короткий онбординг в приложении 👇",
  error: "Что-то пошло не так. Попробуй ещё раз чуть позже."
};

const EN: Messages = {
  start:
    "👋 Welcome to FitReward!\n\nOpen the app to plan your workouts and track progress.",
  open: "🏃 Open FitReward",
  reminderTitle: "💪 Time to train",
  reminderBody: (day) =>
    `Today's plan: ${day}.\nOpen the app and get started — keep the streak alive.`,
  reminderGeneric: "Today is a training day. Open the app and get started.",
  today: (day) => `🗓 Today is a training day.\nPlan: ${day}.`,
  todayDone: "✅ You've already trained today. Great work!",
  todayRest: "😌 Today is a rest day — recover well.",
  todayNoProgram: "You don't have a program yet. Create one on the Plans tab in the app.",
  streak: (n) => `🔥 Your streak: ${n} day${n === 1 ? "" : "s"} in a row.`,
  streakZero: "No streak yet. Finish a workout to start one!",
  week: (n) => `Workouts in the last 7 days: ${n}.`,
  profile: "👤 Profile and settings live in the app:",
  notOnboarded: "Complete the short onboarding in the app first 👇",
  error: "Something went wrong. Please try again a bit later."
};

export function messages(locale: Locale): Messages {
  return locale === "ru" ? RU : EN;
}

/** Inline keyboard with a single "open Mini App" button. */
export function openKeyboard(locale: Locale) {
  const url = process.env.WEBAPP_URL || "";
  if (!url) return {};
  return {
    reply_markup: {
      inline_keyboard: [[{ text: messages(locale).open, web_app: { url } }]]
    }
  };
}
