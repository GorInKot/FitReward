import WebApp from "@twa-dev/sdk";

/**
 * Thin wrappers over Telegram's HapticFeedback. All calls are guarded —
 * outside Telegram (plain browser dev) the SDK throws, which we swallow.
 */

type ImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";

export function hapticImpact(style: ImpactStyle = "light"): void {
  try {
    WebApp.HapticFeedback.impactOccurred(style);
  } catch {
    // not running inside Telegram — ignore
  }
}

export function hapticSuccess(): void {
  try {
    WebApp.HapticFeedback.notificationOccurred("success");
  } catch {
    // ignore
  }
}

export function hapticError(): void {
  try {
    WebApp.HapticFeedback.notificationOccurred("error");
  } catch {
    // ignore
  }
}
