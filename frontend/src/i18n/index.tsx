import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { en } from "./locales/en";
import { ru } from "./locales/ru";

export type Locale = "ru" | "en";

type Dictionary = typeof ru;

const DICTIONARIES: Record<Locale, Dictionary> = { ru, en };

const STORAGE_KEY = "fitreward.lang";

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "ru";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ru" || saved === "en") return saved;
  } catch {
    // ignore
  }
  const telegramLang = (
    window as Window & {
      Telegram?: { WebApp?: { initDataUnsafe?: { user?: { language_code?: string } } } };
    }
  ).Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
  if (telegramLang?.toLowerCase().startsWith("ru")) return "ru";
  return "en";
}

function getByPath(dict: Dictionary, key: string): string | undefined {
  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = dict;
  for (const part of parts) {
    if (cur == null) return undefined;
    cur = cur[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) => {
    const value = params[name];
    return value === undefined || value === null ? `{${name}}` : String(value);
  });
}

export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectInitialLocale());

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback<TranslateFn>(
    (key, params) => {
      const primary = getByPath(DICTIONARIES[locale], key);
      if (primary !== undefined) return interpolate(primary, params);
      // Fall back to the other locale before returning the raw key.
      const fallback = getByPath(DICTIONARIES[locale === "ru" ? "en" : "ru"], key);
      if (fallback !== undefined) return interpolate(fallback, params);
      return key;
    },
    [locale]
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within <I18nProvider>");
  }
  return ctx;
}
