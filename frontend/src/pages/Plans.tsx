import { useEffect, useState } from "react";
import { ApiProgram, ApiProgramDay, getCurrentProgram, regenerateProgram } from "../utils/api";
import { useTranslation } from "../i18n";

export default function Plans() {
  const { t } = useTranslation();
  const [program, setProgram] = useState<ApiProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { program } = await getCurrentProgram();
        setProgram(program);
        if (program && program.days.length > 0) {
          setActiveDayId(program.days[0].id);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("plans.errorLoad"));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [t]);

  async function handleRegenerate() {
    try {
      setRegenerating(true);
      const { program: fresh } = await regenerateProgram();
      setProgram(fresh);
      if (fresh.days.length > 0) {
        setActiveDayId(fresh.days[0].id);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("plans.errorRegenerate"));
    } finally {
      setRegenerating(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-400">{t("plans.loading")}</p>;
  }

  if (!program) {
    return (
      <section className="space-y-4">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-xl font-semibold">{t("plans.notFoundTitle")}</h2>
          <p className="mt-1 text-sm text-slate-400">{error ?? t("plans.notFoundSubtitle")}</p>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="mt-3 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {regenerating ? t("plans.generating") : t("plans.generate")}
          </button>
        </article>
      </section>
    );
  }

  const activeDay = program.days.find((d) => d.id === activeDayId) ?? program.days[0];

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-xs uppercase tracking-wider text-emerald-300">{t("plans.activeProgram")}</p>
        <h2 className="mt-1 text-xl font-semibold">{t(`structure.${program.structure}`)}</h2>
        <p className="mt-1 text-sm text-slate-400">{t("plans.daysPerWeek", { n: program.days.length })}</p>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="mt-3 rounded-lg bg-slate-800 px-3 py-1.5 text-xs disabled:opacity-50"
        >
          {regenerating ? t("plans.regenerating") : t("plans.regenerate")}
        </button>
        {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
      </article>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {program.days.map((day) => {
          const isActive = day.id === activeDay.id;
          return (
            <button
              key={day.id}
              onClick={() => setActiveDayId(day.id)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition ${
                isActive ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"
              }`}
            >
              {t("day.dayN", { n: day.order, name: t(day.name) })}
            </button>
          );
        })}
      </div>

      <DayDetail day={activeDay} />
    </section>
  );
}

function DayDetail({ day }: { day: ApiProgramDay }) {
  const { t } = useTranslation();
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="text-sm font-semibold text-slate-300">
        {t("day.dayN", { n: day.order, name: t(day.name) })}
      </h3>
      <ul className="mt-3 space-y-2">
        {day.exercises.map((slot) => {
          const restMin = Math.round(slot.suggestedRestSec / 60);
          const restText =
            restMin > 0 ? t("common.minutes", { n: restMin }) : t("common.seconds", { n: slot.suggestedRestSec });
          const repsText =
            slot.suggestedRepsLow !== slot.suggestedRepsHigh
              ? t("reps.range", { low: slot.suggestedRepsLow, high: slot.suggestedRepsHigh })
              : t("reps.single", { value: slot.suggestedRepsLow });
          return (
            <li key={slot.id} className="rounded-xl bg-slate-800 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-400">{t(slot.slotName)}</p>
                  <p className="mt-0.5 text-sm font-medium text-white">
                    {slot.exercise.nameRu ?? slot.exercise.nameEn}
                  </p>
                </div>
                <p className="whitespace-nowrap text-right text-xs text-emerald-300">
                  {t("plans.suggested", { sets: slot.suggestedSets, reps: repsText })}
                </p>
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                {t("plans.setExtra", { rest: restText, equipment: slot.exercise.equipment.join(", ") })}
              </p>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
