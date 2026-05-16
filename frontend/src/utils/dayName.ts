import type { TranslateFn } from "../i18n";

/**
 * Programs generated after the i18n refactor store ProgramDay.name as a
 * translation key ("day.full_body"). Programs created before it stored an
 * already-formatted localized string ("День 1: Full-body").
 *
 * This helper renders both correctly:
 *  - key  -> "День {order}: {translated}"
 *  - legacy literal -> shown as-is (it's already formatted)
 */
export function formatDayName(name: string, order: number, t: TranslateFn): string {
  if (name.startsWith("day.")) {
    return t("day.dayN", { n: order, name: t(name) });
  }
  return name;
}

/**
 * Variant for places that only have the stored name and no day order
 * (e.g. a WorkoutSession snapshot). Keys render as just the translated day
 * label; legacy literals render as-is.
 */
export function formatDayLabel(name: string, t: TranslateFn): string {
  if (name.startsWith("day.")) {
    return t(name);
  }
  return name;
}
