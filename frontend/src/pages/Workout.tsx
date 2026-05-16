import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ApiSessionExercise,
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
import { useTranslation, TranslateFn } from "../i18n";
import { formatDayName, formatDayLabel } from "../utils/dayName";
import { exerciseName } from "../utils/exerciseName";

const RIR_VALUES = [0, 1, 2, 3, 5];

export default function Workout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [session, setSession] = useState<ApiWorkoutSession | null>(null);
  const [nextDay, setNextDay] = useState<{ id: string; name: string; order: number } | null>(null);
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
        setNextDay(nextDay);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function handleAbandon() {
    if (!session) return;
    if (!window.confirm(t("workout.abandonConfirm"))) return;
    try {
      setBusy(true);
      await abandonSession(session.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
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
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-400">{t("workout.loading")}</p>;
  }

  if (!session) {
    return (
      <section className="space-y-4">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-xl font-semibold">{t("workout.readyTitle")}</h2>
          {nextDay ? (
            <>
              <p className="mt-1 text-sm text-slate-400">
                {t("workout.nextDay", {
                  name: formatDayName(nextDay.name, nextDay.order, t)
                })}
              </p>
              <button
                onClick={handleStart}
                disabled={busy}
                className="mt-3 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
              >
                {busy ? t("workout.starting") : t("workout.start")}
              </button>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm text-slate-400">{t("workout.noProgram")}</p>
              <button onClick={() => navigate("/plans")} className="mt-3 rounded-xl bg-slate-800 px-4 py-2 text-sm">
                {t("workout.openPlans")}
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
      t={t}
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
  setError,
  t
}: {
  session: ApiWorkoutSession;
  onSessionChange: (s: ApiWorkoutSession) => void;
  onComplete: (perceivedFatigue: number | null) => Promise<void>;
  onAbandon: () => Promise<void>;
  busy: boolean;
  error: string | null;
  setError: (msg: string | null) => void;
  t: TranslateFn;
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
      setError(err instanceof Error ? err.message : t("workout.exercise.errorLog"));
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
      setError(err instanceof Error ? err.message : t("workout.exercise.errorDelete"));
    }
  }

  async function handleCompleteExercise(exercise: ApiSessionExercise) {
    try {
      const { sessionExercise } = await completeExercise(session.id, exercise.id);
      patchExerciseLocally(exercise.id, (e) => ({ ...e, completedAt: sessionExercise.completedAt }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("workout.exercise.errorComplete"));
    }
  }

  if (showCompletion) {
    return (
      <section className="space-y-4">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-xl font-semibold">{t("workout.completion.title")}</h2>
          <p className="mt-1 text-sm text-slate-400">{t("workout.completion.subtitle")}</p>
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
            <button onClick={() => setShowCompletion(false)} className="flex-1 rounded-xl bg-slate-800 px-3 py-2 text-sm">
              {t("common.back")}
            </button>
            <button
              onClick={() => onComplete(fatigue)}
              disabled={busy}
              className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
            >
              {busy ? t("workout.completion.submitting") : t("workout.completion.submit")}
            </button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-xs uppercase tracking-wider text-emerald-300">{t("workout.activeSession")}</p>
        <h2 className="mt-1 text-xl font-semibold">{formatDayLabel(session.dayName, t)}</h2>
        <p className="mt-1 text-sm text-slate-400">
          {t("workout.progress", { done: completedCount, total })}
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

      {error && <p className="rounded-xl bg-rose-900/40 p-3 text-sm text-rose-200">{error}</p>}

      <div className="flex gap-2">
        <button onClick={onAbandon} disabled={busy} className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-sm disabled:opacity-50">
          {t("workout.abandon")}
        </button>
        <button
          onClick={() => setShowCompletion(true)}
          disabled={busy}
          className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {t("workout.finish")}
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
  const { t, locale } = useTranslation();
  const [expanded, setExpanded] = useState(!exercise.completedAt);
  const initialWeight =
    exercise.suggestion?.suggestedWeight !== undefined && exercise.suggestion?.suggestedWeight !== null
      ? String(exercise.suggestion.suggestedWeight)
      : exercise.previous?.weight !== undefined && exercise.previous?.weight !== null
        ? String(exercise.previous.weight)
        : "";
  const initialReps = exercise.suggestion ? String(exercise.suggestion.suggestedReps) : "";
  const [weight, setWeight] = useState(initialWeight);
  const [reps, setReps] = useState(initialReps);
  const [rir, setRir] = useState<number | null>(2);
  const [submitting, setSubmitting] = useState(false);

  const lastSet = exercise.setLogs[exercise.setLogs.length - 1];
  const repsText = useMemo(
    () =>
      exercise.suggestedRepsLow !== exercise.suggestedRepsHigh
        ? t("reps.range", { low: exercise.suggestedRepsLow, high: exercise.suggestedRepsHigh })
        : t("reps.single", { value: exercise.suggestedRepsLow }),
    [exercise, t]
  );
  const restMin = Math.round(exercise.suggestedRestSec / 60);
  const restText =
    restMin > 0
      ? t("workout.exercise.restMin", { n: restMin })
      : t("workout.exercise.restSec", { n: exercise.suggestedRestSec });

  async function handleSubmit() {
    const repsNum = Number(reps);
    if (!repsNum || repsNum <= 0) return;
    const weightNum = weight.trim() ? Number(weight) : null;
    try {
      setSubmitting(true);
      await onLogSet({ reps: repsNum, weight: weightNum, rir });
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
      <button onClick={() => setExpanded((v) => !v)} className="flex w-full items-start justify-between gap-2 text-left">
        <div>
          <p className="text-xs text-slate-400">{t(exercise.slotName)}</p>
          <p className="mt-0.5 text-sm font-medium">
            {isComplete && "✓ "}
            {exerciseName(exercise.exercise, locale)}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {t("workout.exercise.suggested", {
              sets: exercise.suggestedSets,
              reps: repsText,
              rest: restText
            })}
          </p>
        </div>
        <span className="text-xs text-slate-500">{expanded ? "▾" : "▸"}</span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {(exercise.previous || exercise.suggestion) && exercise.setLogs.length === 0 && (
            <div className="rounded-xl bg-slate-800/50 p-3 text-xs">
              {exercise.previous && (
                <p className="text-slate-400">
                  {t("progression.lastTime", {
                    weight: exercise.previous.weight !== null ? `${exercise.previous.weight} × ` : "",
                    reps: exercise.previous.reps,
                    rir:
                      exercise.previous.rir !== null
                        ? t("progression.lastWithRir", { rir: exercise.previous.rir })
                        : ""
                  })}
                </p>
              )}
              {exercise.suggestion && (
                <>
                  <p className="mt-1 font-medium text-emerald-300">
                    {t("progression.suggestionHeader")}:{" "}
                    {exercise.suggestion.suggestedWeight !== null
                      ? t("progression.suggestionWeightReps", {
                          weight: exercise.suggestion.suggestedWeight,
                          reps: exercise.suggestion.suggestedReps
                        })
                      : t("progression.suggestionReps", { reps: exercise.suggestion.suggestedReps })}
                  </p>
                  <p className="mt-0.5 text-slate-500">{t(exercise.suggestion.rationaleKey)}</p>
                </>
              )}
            </div>
          )}
          {exercise.setLogs.length > 0 && (
            <ul className="space-y-1">
              {exercise.setLogs.map((set) => (
                <li key={set.id} className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2 text-xs">
                  <span className="text-slate-400">{t("workout.exercise.setN", { n: set.setNumber })}</span>
                  <span className="font-medium text-white">
                    {set.weight !== null ? `${set.weight} × ` : ""}
                    {set.reps}
                    {set.rir !== null ? ` · RIR ${set.rir}` : ""}
                  </span>
                  {!isComplete && (
                    <button onClick={() => onDeleteSet(set.id)} className="text-rose-300 hover:text-rose-200">
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
                  {t("workout.exercise.weightLabel")}
                  <input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                    placeholder={lastSet?.weight !== undefined && lastSet?.weight !== null ? String(lastSet.weight) : "—"}
                    inputMode="decimal"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-400">
                  {t("workout.exercise.repsLabel")}
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
                <p className="text-xs text-slate-400">{t("workout.exercise.rirLabel")}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {RIR_VALUES.map((value) => (
                    <button
                      key={value}
                      onClick={() => setRir(value)}
                      className={`rounded-lg px-2 py-1 text-xs ${
                        rir === value ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {t(`workout.rir.${value}`)}
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
                  {submitting
                    ? t("workout.exercise.saving")
                    : t("workout.exercise.logSet", { n: exercise.setLogs.length + 1 })}
                </button>
                <button onClick={onComplete} className="flex-1 rounded-xl bg-slate-800 px-3 py-2 text-sm">
                  {t("workout.exercise.complete")}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}
