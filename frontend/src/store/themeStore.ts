import { create } from "zustand";
import WebApp from "@twa-dev/sdk";

export type ThemeMode = "auto" | "light" | "dark";
type Resolved = "light" | "dark";

const STORAGE_KEY = "fitreward.theme";
const HEX = { light: "#f8fafc", dark: "#020617" } as const;

function telegramScheme(): Resolved {
  try {
    return WebApp.colorScheme === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function readMode(): ThemeMode {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "auto" || v === "light" || v === "dark") return v;
  } catch {
    // ignore
  }
  return "auto";
}

function resolve(mode: ThemeMode): Resolved {
  return mode === "auto" ? telegramScheme() : mode;
}

function apply(resolved: Resolved) {
  document.documentElement.classList.toggle("dark", resolved === "dark");
  try {
    WebApp.setHeaderColor(HEX[resolved]);
    WebApp.setBackgroundColor(HEX[resolved]);
  } catch {
    // not inside Telegram — ignore
  }
}

interface ThemeState {
  mode: ThemeMode;
  resolved: Resolved;
  setMode: (mode: ThemeMode) => void;
  init: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "auto",
  resolved: "dark",
  setMode: (mode) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
    const resolved = resolve(mode);
    apply(resolved);
    set({ mode, resolved });
  },
  init: () => {
    const mode = readMode();
    const resolved = resolve(mode);
    apply(resolved);
    set({ mode, resolved });
    try {
      WebApp.onEvent("themeChanged", () => {
        if (get().mode !== "auto") return;
        const next = telegramScheme();
        apply(next);
        set({ resolved: next });
      });
    } catch {
      // ignore
    }
  }
}));
