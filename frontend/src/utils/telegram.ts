export function isTelegramWebApp(): boolean {
  return typeof window !== "undefined" && "Telegram" in window;
}
