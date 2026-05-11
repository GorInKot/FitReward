export function isTelegramWebApp(): boolean {
  return typeof window !== "undefined" && "Telegram" in window;
}

type TelegramUser = {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
};

function getTelegramUser(): TelegramUser | null {
  if (!isTelegramWebApp()) {
    return null;
  }

  const telegram = (window as Window & { Telegram?: { WebApp?: { initDataUnsafe?: { user?: TelegramUser } } } }).Telegram;
  return telegram?.WebApp?.initDataUnsafe?.user ?? null;
}

export function getTelegramUserId(): string {
  const user = getTelegramUser();
  return user?.id ? String(user.id) : "demo-telegram-user";
}

export function getTelegramUsername(): string | null {
  const user = getTelegramUser();
  return user?.username ?? null;
}
