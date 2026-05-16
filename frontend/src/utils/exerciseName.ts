import type { Locale } from "../i18n";

/**
 * Picks the exercise name for the current locale.
 * EN mode → English name. RU mode → Russian name, falling back to English
 * when a Russian translation is missing (legacy wger rows).
 */
export function exerciseName(
  ex: { nameEn: string; nameRu: string | null },
  locale: Locale
): string {
  if (locale === "ru") {
    return ex.nameRu ?? ex.nameEn;
  }
  return ex.nameEn;
}
