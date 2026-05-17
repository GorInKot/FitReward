import { useEffect, useState } from "react";
import { useExerciseGuideStore } from "../store/exerciseGuideStore";
import { useTranslation } from "../i18n";
import { exerciseName } from "../utils/exerciseName";
import type { ExerciseGuideEntry } from "../data/exerciseGuide";

export default function ExerciseGuideModal() {
  const current = useExerciseGuideStore((s) => s.current);
  const close = useExerciseGuideStore((s) => s.close);
  const { t, locale } = useTranslation();
  const [entry, setEntry] = useState<ExerciseGuideEntry | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [imageOk, setImageOk] = useState(true);

  const slug = current?.slug;

  useEffect(() => {
    if (!slug) return;
    setEntry(null);
    setLoaded(false);
    setImageOk(true);
    let cancelled = false;
    import("../data/exerciseGuide").then((mod) => {
      if (cancelled) return;
      setEntry(mod.EXERCISE_GUIDE[slug] ?? null);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!current) return null;
  const content = entry ? entry[locale] : null;

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end justify-center bg-black/60"
      onClick={close}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-hairline bg-panel p-5 pb-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold">{exerciseName(current, locale)}</h2>
          <button onClick={close} className="shrink-0 text-sm text-ink-faint">
            {t("common.close")}
          </button>
        </div>

        {imageOk && (
          <img
            src={`/exercises/${current.slug}.jpg`}
            alt=""
            onError={() => setImageOk(false)}
            className="mt-3 w-full rounded-xl bg-elevated"
          />
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {current.primaryMuscles.map((m) => (
            <span
              key={m}
              className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
            >
              {t(`muscle.${m}`)}
            </span>
          ))}
          {current.equipment.map((e) => (
            <span key={e} className="rounded-full bg-elevated px-2.5 py-1 text-xs text-ink-soft">
              {t(`equipment.${e}`)}
            </span>
          ))}
        </div>

        {content ? (
          <>
            <h3 className="mt-5 text-sm font-semibold text-ink-soft">
              {t("exerciseGuide.technique")}
            </h3>
            <ol className="mt-2 space-y-1.5 text-sm">
              {content.steps.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-300">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            {content.mistakes.length > 0 && (
              <>
                <h3 className="mt-5 text-sm font-semibold text-ink-soft">
                  {t("exerciseGuide.mistakes")}
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {content.mistakes.map((mistake, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-rose-500 dark:text-rose-300">·</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : (
          <p className="mt-5 text-sm text-ink-faint">
            {loaded ? t("exerciseGuide.noGuide") : t("exerciseGuide.loading")}
          </p>
        )}
      </div>
    </div>
  );
}
