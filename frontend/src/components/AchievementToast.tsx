import { useEffect } from "react";
import { useAchievementStore } from "../store/achievementStore";
import { useTranslation } from "../i18n";
import { hapticSuccess } from "../utils/haptics";

/**
 * Bottom-anchored toast that surfaces the first un-notified achievement.
 * Mounted globally in App; appears on whatever screen the user is on.
 */
export default function AchievementToast() {
  const { t } = useTranslation();
  const pending = useAchievementStore((s) => s.pendingToasts);
  const dismiss = useAchievementStore((s) => s.dismissToast);

  const next = pending[0];

  useEffect(() => {
    if (next) {
      hapticSuccess();
    }
  }, [next?.key]);

  if (!next) return null;

  const title = t(`achievement.${next.key}.title`);
  const description = t(`achievement.${next.key}.description`);

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-amber-500/40 bg-amber-500/15 p-4 shadow-xl backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
        {t("achievement.toastTitle")}
      </p>
      <div className="mt-1 flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-bold text-amber-100">🏆 {title}</p>
          <p className="mt-0.5 text-xs text-amber-100/80">{description}</p>
          <p className="mt-1 text-xs text-amber-300">
            {t("achievement.rewardSuffix", { n: next.reward })}
          </p>
        </div>
        <button
          onClick={() => void dismiss(next.key)}
          className="rounded-lg bg-amber-500/30 px-3 py-1 text-xs text-amber-50"
        >
          {t("common.close")}
        </button>
      </div>
    </div>
  );
}
