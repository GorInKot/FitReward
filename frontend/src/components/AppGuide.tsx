import { useState } from "react";
import { useGuideStore } from "../store/guideStore";
import { useTranslation } from "../i18n";
import { hapticImpact } from "../utils/haptics";

const STEPS = ["welcome", "home", "workout", "plans", "progress", "profile"] as const;

export default function AppGuide() {
  const open = useGuideStore((s) => s.open);
  const closeGuide = useGuideStore((s) => s.closeGuide);
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  if (!open) return null;

  const total = STEPS.length;
  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === total - 1;

  function finish() {
    setStep(0);
    closeGuide();
  }

  function next() {
    hapticImpact("light");
    if (isLast) {
      finish();
    } else {
      setStep((s) => s + 1);
    }
  }

  function back() {
    hapticImpact("light");
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface text-ink">
      <div className="flex items-center justify-between p-4">
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-emerald-400" : "w-1.5 bg-elevated"
              }`}
            />
          ))}
        </div>
        <button onClick={finish} className="text-xs text-ink-faint">
          {t("guide.skip")}
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 pb-6">
        <div className="rounded-2xl border border-hairline bg-panel p-6">
          {!isFirst && (
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              {t(`guide.${current}.tag`)}
            </span>
          )}
          <h2 className="mt-3 text-2xl font-bold">{t(`guide.${current}.title`)}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t(`guide.${current}.body`)}</p>
        </div>
      </div>

      <div className="flex gap-2 p-4">
        {!isFirst && (
          <button onClick={back} className="flex-1 rounded-xl bg-elevated px-4 py-3 text-sm">
            {t("common.back")}
          </button>
        )}
        <button
          onClick={next}
          className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950"
        >
          {isLast ? t("guide.done") : t("common.next")}
        </button>
      </div>
    </div>
  );
}
