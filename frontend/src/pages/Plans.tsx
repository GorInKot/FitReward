import { useEffect, useState } from "react";
import {
  ApiProgram,
  ApiProgramDay,
  TrainingStructure,
  getCurrentProgram,
  regenerateProgram
} from "../utils/api";

const STRUCTURE_LABEL: Record<TrainingStructure, string> = {
  FULL_BODY: "Full-body",
  UPPER_LOWER: "Upper/Lower",
  PUSH_PULL_LEGS: "Push/Pull/Legs",
  SPLIT: "Классический сплит"
};

export default function Plans() {
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
        setError(err instanceof Error ? err.message : "Не удалось загрузить программу");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

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
      setError(err instanceof Error ? err.message : "Не удалось пересоздать программу");
    } finally {
      setRegenerating(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-400">Загрузка программы...</p>;
  }

  if (!program) {
    return (
      <section className="space-y-4">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-xl font-semibold">Программа не найдена</h2>
          <p className="mt-1 text-sm text-slate-400">
            {error ?? "Похоже, программа ещё не создана. Сгенерируем её сейчас."}
          </p>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="mt-3 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {regenerating ? "Создаём..." : "Сгенерировать программу"}
          </button>
        </article>
      </section>
    );
  }

  const activeDay = program.days.find((d) => d.id === activeDayId) ?? program.days[0];

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-xs uppercase tracking-wider text-emerald-300">Активная программа</p>
        <h2 className="mt-1 text-xl font-semibold">{STRUCTURE_LABEL[program.structure]}</h2>
        <p className="mt-1 text-sm text-slate-400">{program.days.length} дней в неделю</p>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="mt-3 rounded-lg bg-slate-800 px-3 py-1.5 text-xs disabled:opacity-50"
        >
          {regenerating ? "Пересоздаём..." : "Пересоздать программу"}
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
              {day.name}
            </button>
          );
        })}
      </div>

      <DayDetail day={activeDay} />
    </section>
  );
}

function DayDetail({ day }: { day: ApiProgramDay }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="text-sm font-semibold text-slate-300">{day.name}</h3>
      <ul className="mt-3 space-y-2">
        {day.exercises.map((slot) => (
          <li key={slot.id} className="rounded-xl bg-slate-800 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-slate-400">{slot.slotName}</p>
                <p className="mt-0.5 text-sm font-medium text-white">
                  {slot.exercise.nameRu ?? slot.exercise.nameEn}
                </p>
              </div>
              <p className="whitespace-nowrap text-right text-xs text-emerald-300">
                {slot.suggestedSets} × {slot.suggestedRepsLow}
                {slot.suggestedRepsLow !== slot.suggestedRepsHigh
                  ? `–${slot.suggestedRepsHigh}`
                  : ""}
              </p>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">
              Отдых: {Math.round(slot.suggestedRestSec / 60) > 0
                ? `${Math.round(slot.suggestedRestSec / 60)} мин`
                : `${slot.suggestedRestSec} сек`}
              {" · "}
              {slot.exercise.equipment.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
