export function isTelegramWebApp(): boolean {
  return typeof window !== "undefined" && "Telegram" in window;
}

type TelegramUser = {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type TelegramWebApp = {
  initData?: string;
  initDataUnsafe?: { user?: TelegramUser };
};

function getTelegramWebApp(): TelegramWebApp | null {
  if (!isTelegramWebApp()) {
    return null;
  }
  return (window as Window & { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp ?? null;
}

function getTelegramUser(): TelegramUser | null {
  return getTelegramWebApp()?.initDataUnsafe?.user ?? null;
}

export function getTelegramInitData(): string {
  return getTelegramWebApp()?.initData ?? "";
}

export function getTelegramUserId(): string {
  const user = getTelegramUser();
  return user?.id ? String(user.id) : "demo-telegram-user";
}

export function getTelegramUsername(): string | null {
  const user = getTelegramUser();
  return user?.username ?? null;
}
