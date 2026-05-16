/**
 * Client for the backend's /internal endpoints. Authenticated with the
 * shared INTERNAL_API_SECRET — the bot has no database access of its own.
 */

const BACKEND_URL = (process.env.BACKEND_URL || "").replace(/\/$/, "");
const SECRET = process.env.INTERNAL_API_SECRET || "";

export interface UserSummary {
  found: boolean;
  firstName?: string | null;
  locale?: string;
  onboardingCompleted?: boolean;
  streak?: number;
  weekSessions?: number;
  nextDayName?: string | null;
  trainedToday?: boolean;
  isTrainingDay?: boolean;
}

export interface ReminderTarget {
  telegramId: string;
  locale: string;
  nextDayName: string | null;
}

export async function fetchUserSummary(telegramId: number | string): Promise<UserSummary> {
  const url = `${BACKEND_URL}/internal/user-summary?telegramId=${encodeURIComponent(String(telegramId))}`;
  const res = await fetch(url, { headers: { "X-Internal-Secret": SECRET } });
  if (!res.ok) {
    throw new Error(`user-summary failed: ${res.status}`);
  }
  return (await res.json()) as UserSummary;
}

export async function fetchReminderTargets(): Promise<ReminderTarget[]> {
  const res = await fetch(`${BACKEND_URL}/internal/reminder-targets`, {
    method: "POST",
    headers: { "X-Internal-Secret": SECRET }
  });
  if (!res.ok) {
    throw new Error(`reminder-targets failed: ${res.status}`);
  }
  const data = (await res.json()) as { targets?: ReminderTarget[] };
  return data.targets ?? [];
}
