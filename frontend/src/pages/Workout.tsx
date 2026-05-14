import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ApiSessionExercise,
  ApiSetLog,
  ApiWorkoutSession,
  abandonSession,
  completeExercise,
  completeSession,
  deleteSet,
  getActiveSession,
  getNextProgramDay,
  logSet,
  startSession
} from "../utils/api";

const RIR_OPTIONS = [
  { value: 0, label: "0 (на отказ)" },
  { value: 1, label: "1 в запасе" },
  { value: 2, label: "2 в запасе" },
  { value: 3, label: "3 в запасе" },
  { value: 5, label: "Слишком легко" }
];

export default function Workout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<ApiWorkoutSession | null>(null);
  const [nextDay, setNextDay] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { session: active } = await getActiveSession();
      if (active) {
        setSession(active);
        setNextDay(null);
      } else {
        setSession(null);
        const { nextDay } = await getNextProgramDay();
        setNextDay(nextDay ? { id: nextDay.id, name: nextDay.name } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleStart() {
    if (!nextDay) return;
    try {
      setBusy(true);
      setError(null);
      const { session: fresh } = await startSession(nextDay.id);
      setSession(fresh);
      setNextDay(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось начать");
    } finally {
      setBusy(false);
    }
  }

  async function handleAbandon() {
    if (!session) return;
    if (!window.confirm("Прервать тренировку? Записанные сеты сохранятся как незавершённые.")) {
      return;
    }
    try {
      setBusy(true);
      await abandonSession(session.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  async function handleComplete(perceivedFatigue: number | null) {
    if (!session) return;
    try {
      setBusy(true);
      await completeSession(session.id, { perceivedFatigue });
      await load();
      navigate("/progress");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось завершить");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-400">Загрузка...</p>;
  }

  if (!session) {
    return (
      <section className="space-y-4">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-xl font-semibold">Готов к тренировке?</h2>
          {nextDay ? (
            <>
              <p className="mt-1 text-sm text-slate-400">Следующая: {nextDay.name}</p>
              <button
                onClick={handleStart}
                disabled={busy}
                className="mt-3 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
              >
                {busy ? "Начинаем..." : "Начать тренировку"}
              </button>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm text-slate-400">Программа не найдена. Создай её на вкладке «Планы».</p>
              <button
                onClick={() => navigate("/plans")}
                className="mt-3 rounded-xl bg-slate-800 px-4 py-2 text-sm"
              >
                Открыть планы
              </button>
            </>
          )}
          {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
        </article>
      </section>
    );
  }

  return (
    <ActiveSession
      session={session}
      onSessionChange={setSession}
      onComplete={handleComplete}
      onAbandon={handleAbandon}
      busy={busy}
      error={error}
      setError={setError}
    />
  );
}

function ActiveSession({
  session,
  onSessionChange,
  onComplete,
  onAbandon,
  busy,
  error,
  setError
}: {
  session: ApiWorkoutSession;
  onSessionChange: (s: ApiWorkoutSession) => void;
  onComplete: (perceivedFatigue: number | null) => Promise<void>;
  onAbandon: () => Promise<void>;
  busy: boolean;
  error: string | null;
  setError: (msg: string | null) => void;
}) {
  const completedCount = session.exercises.filter((e) => e.completedAt).length;
  const total = session.exercises.length;
  const [showCompletion, setShowCompletion] = useState(false);
  const [fatigue, setFatigue] = useState<number | null>(null);

  function patchExerciseLocally(exerciseId: string, updater: (e: ApiSessionExercise) => ApiSessionExercise) {
    onSessionChange({
      ...session,
      exercises: session.exercises.map((e) => (e.id === exerciseId ? updater(e) : e))
    });
  }

  async function handleLogSet(
    exercise: ApiSessionExercise,
    input: { reps: number; weight: number | null; rir: number | null }
  ) {
    try {
      const { set } = await logSet(session.id, {
        sessionExerciseId: exercise.id,
        setNumber: exercise.setLogs.length + 1,
        reps: input.reps,
        weight: input.weight,
        rir: input.rir
      });
      patchExerciseLocally(exercise.id, (e) => ({ ...e, setLogs: [...e.setLogs, set] }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось записать сет");
    }
  }

  async function handleDeleteSet(exercise: ApiSessionExercise, setId: string) {
    try {
      await deleteSet(session.id, setId);
      patchExerciseLocally(exercise.id, (e) => ({
        ...e,
        setLogs: e.setLogs.filter((s) => s.id !== setId)
      }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить");
    }
  }

  async function handleCompleteExercise(exercise: ApiSessionExercise) {
    try {
      const { sessionExercise } = await completeExercise(session.id, exercise.id);
      patchExerciseLocally(exercise.id, (e) => ({ ...e, completedAt: sessionExercise.completedAt }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось");
    }
  }

  if (showCompletion) {
    return (
      <section className="space-y-4">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-xl font-semibold">Как ощущения?</h2>
          <p className="mt-1 text-sm text-slate-400">Оцени общую усталость от 1 до 10</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                onClick={() => setFatigue(n)}
                className={`rounded-lg py-2 text-sm ${
                  fatigue === n ? "bg-emerald-500 text-slate-950" : "bg-slate-800"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setShowCompletion(false)}
              className="flex-1 rounded-xl bg-slate-800 px-3 py-2 text-sm"
            >
              Назад
            </button>
            <button
              onClick={() => onComplete(fatigue)}
              disabled={busy}
              className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
            >
              {busy ? "Сохраняем..." : "Завершить"}
            </button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-xs uppercase tracking-wider text-emerald-300">Активная тренировка</p>
        <h2 className="mt-1 text-xl font-semibold">{session.dayName}</h2>
        <p className="mt-1 text-sm text-slate-400">
          Прогресс: {completedCount}/{total} упражнений
        </p>
        <div className="mt-3 h-2 rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{ width: total > 0 ? `${(completedCount / total) * 100}%` : "0%" }}
          />
        </div>
      </article>

      {session.exercises.map((ex) => (
        <ExerciseCard
          key={ex.id}
          exercise={ex}
          onLogSet={(input) => handleLogSet(ex, input)}
          onDeleteSet={(setId) => handleDeleteSet(ex, setId)}
          onComplete={() => handleCompleteExercise(ex)}
        />
      ))}

      {error && (
        <p className="rounded-xl bg-rose-900/40 p-3 text-sm text-rose-200">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={onAbandon}
          disabled={busy}
          className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-sm disabled:opacity-50"
        >
          Прервать
        </button>
        <button
          onClick={() => setShowCompletion(true)}
          disabled={busy}
          className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          Завершить тренировку
        </button>
      </div>
    </section>
  );
}

function ExerciseCard({
  exercise,
  onLogSet,
  onDeleteSet,
  onComplete
}: {
  exercise: ApiSessionExercise;
  onLogSet: (input: { reps: number; weight: number | null; rir: number | null }) => Promise<void>;
  onDeleteSet: (setId: string) => Promise<void>;
  onComplete: () => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(!exercise.completedAt);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rir, setRir] = useState<number | null>(2);
  const [submitting, setSubmitting] = useState(false);

  const lastSet = exercise.setLogs[exercise.setLogs.length - 1];
  const repsRange = useMemo(
    () =>
      exercise.suggestedRepsLow === exercise.suggestedRepsHigh
        ? `${exercise.suggestedRepsLow}`
        : `${exercise.suggestedRepsLow}–${exercise.suggestedRepsHigh}`,
    [exercise]
  );

  async function handleSubmit() {
    const repsNum = Number(reps);
    if (!repsNum || repsNum <= 0) return;
    const weightNum = weight.trim() ? Number(weight) : null;
    try {
      setSubmitting(true);
      await onLogSet({ reps: repsNum, weight: weightNum, rir });
      // Pre-fill next set with same weight, reset reps
      setReps("");
    } finally {
      setSubmitting(false);
    }
  }

  const isComplete = Boolean(exercise.completedAt);

  return (
    <article
      className={`rounded-2xl border p-4 transition ${
        isComplete ? "border-emerald-700/40 bg-slate-900/50 opacity-70" : "border-slate-800 bg-slate-900"
      }`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start justify-between gap-2 text-left"
      >
        <div>
          <p className="text-xs text-slate-400">{exercise.slotName}</p>
          <p className="mt-0.5 text-sm font-medium">
            {isComplete && "✓ "}
            {exercise.exercise.nameRu ?? exercise.exercise.nameEn}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {exercise.suggestedSets} × {repsRange} · отдых {Math.round(exercise.suggestedRestSec / 60) > 0
              ? `${Math.round(exercise.suggestedRestSec / 60)} мин`
              : `${exercise.suggestedRestSec} сек`}
          </p>
        </div>
        <span className="text-xs text-slate-500">{expanded ? "▾" : "▸"}</span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {exercise.setLogs.length > 0 && (
            <ul className="space-y-1">
              {exercise.setLogs.map((set) => (
                <li
                  key={set.id}
                  className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2 text-xs"
                >
                  <span className="text-slate-400">Сет {set.setNumber}</span>
                  <span className="font-medium text-white">
                    {set.weight !== null ? `${set.weight} кг × ` : ""}
                    {set.reps}
                    {set.rir !== null ? ` · RIR ${set.rir}` : ""}
                  </span>
                  {!isComplete && (
                    <button
                      onClick={() => onDeleteSet(set.id)}
                      className="text-rose-300 hover:text-rose-200"
                    >
                      ✕
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {!isComplete && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1 text-xs text-slate-400">
                  Вес (кг)
                  <input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                    placeholder={lastSet?.weight !== undefined && lastSet?.weight !== null ? String(lastSet.weight) : "—"}
                    inputMode="decimal"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-400">
                  Повторения
                  <input
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                    placeholder={String(exercise.suggestedRepsLow)}
                    inputMode="numeric"
                  />
                </label>
              </div>
              <div>
                <p className="text-xs text-slate-400">RIR (повторений в запасе)</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {RIR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRir(opt.value)}
                      className={`rounded-lg px-2 py-1 text-xs ${
                        rir === opt.value ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !reps.trim()}
                  className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
                >
                  {submitting ? "..." : `Записать сет ${exercise.setLogs.length + 1}`}
                </button>
                <button
                  onClick={onComplete}
                  className="flex-1 rounded-xl bg-slate-800 px-3 py-2 text-sm"
                >
                  Завершить упр.
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}
