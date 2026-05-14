import crypto from "crypto";

const DEFAULT_MAX_AGE_SECONDS = 24 * 60 * 60;

export function validateTelegramInitData(initData: string, botToken: string): boolean {
  return parseTelegramInitData(initData, botToken).ok;
}

export type ParsedInitData =
  | { ok: true; telegramId: string; username: string | null; firstName: string | null; lastName: string | null }
  | { ok: false; reason: string };

export function parseTelegramInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds: number = DEFAULT_MAX_AGE_SECONDS
): ParsedInitData {
  if (!initData) {
    return { ok: false, reason: "missing_init_data" };
  }
  if (!botToken) {
    return { ok: false, reason: "server_misconfigured" };
  }

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) {
    return { ok: false, reason: "missing_hash" };
  }

  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const signature = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");

  if (signature !== hash) {
    return { ok: false, reason: "bad_signature" };
  }

  const authDateRaw = params.get("auth_date");
  if (!authDateRaw) {
    return { ok: false, reason: "missing_auth_date" };
  }
  const authDate = Number(authDateRaw);
  if (!Number.isFinite(authDate)) {
    return { ok: false, reason: "bad_auth_date" };
  }
  const ageSeconds = Math.floor(Date.now() / 1000) - authDate;
  if (ageSeconds > maxAgeSeconds) {
    return { ok: false, reason: "stale_init_data" };
  }

  const userRaw = params.get("user");
  if (!userRaw) {
    return { ok: false, reason: "missing_user" };
  }

  try {
    const user = JSON.parse(userRaw) as {
      id?: number | string;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
    if (user.id === undefined || user.id === null) {
      return { ok: false, reason: "missing_user_id" };
    }
    return {
      ok: true,
      telegramId: String(user.id),
      username: user.username ?? null,
      firstName: user.first_name ?? null,
      lastName: user.last_name ?? null
    };
  } catch {
    return { ok: false, reason: "bad_user_json" };
  }
}
