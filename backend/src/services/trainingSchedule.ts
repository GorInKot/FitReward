/**
 * Maps a weekly training frequency to concrete weekdays and resolves the
 * "current local day" for a user in their timezone. Used to decide whether
 * today is a training day when sending reminders.
 *
 * Weekday numbers follow JS convention: 0 = Sunday ... 6 = Saturday.
 */

const SCHEDULE_BY_FREQUENCY: Record<number, number[]> = {
  1: [3], // Wed
  2: [1, 4], // Mon, Thu
  3: [1, 3, 5], // Mon, Wed, Fri
  4: [1, 2, 4, 5], // Mon, Tue, Thu, Fri
  5: [1, 2, 3, 4, 5], // Mon–Fri
  6: [1, 2, 3, 4, 5, 6], // Mon–Sat
  7: [0, 1, 2, 3, 4, 5, 6]
};

export function trainingWeekdays(daysPerWeek: number): number[] {
  return SCHEDULE_BY_FREQUENCY[daysPerWeek] ?? SCHEDULE_BY_FREQUENCY[3];
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};

export interface ZonedParts {
  /** YYYY-MM-DD in the target timezone */
  dateKey: string;
  /** 0–23 local hour */
  hour: number;
  /** 0 (Sun) – 6 (Sat) */
  weekday: number;
}

/** Resolves date/hour/weekday for `date` as observed in `timeZone`. */
export function zonedParts(date: Date, timeZone: string): ZonedParts {
  const format = (tz: string) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hour12: false,
      weekday: "short"
    }).formatToParts(date);

  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = format(timeZone);
  } catch {
    parts = format("UTC");
  }

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  let hour = Number(get("hour"));
  if (hour === 24) hour = 0; // some engines emit "24" at midnight

  return {
    dateKey: `${get("year")}-${get("month")}-${get("day")}`,
    hour,
    weekday: WEEKDAY_INDEX[get("weekday")] ?? 0
  };
}
