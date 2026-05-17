import { useCallback, useEffect, useState } from "react";
import {
  ApiBodyMetric,
  ApiDashboard,
  createMetric,
  deleteMetric,
  getDashboard,
  getMetrics
} from "../utils/api";
import { useTranslation, TranslateFn } from "../i18n";
import { exerciseName } from "../utils/exerciseName";
import { toastError } from "../store/toastStore";
import { useProfileStore } from "../store/profileStore";
import Skeleton from "../components/Skeleton";

export default function Progress() {
  const { t, locale } = useTranslation();
  const [dashboard, setDashboard] = useState<ApiDashboard | null>(null);
  const [metrics, setMetrics] = useState<ApiBodyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const trainingDays = useProfileStore((s) => s.profile?.trainingDays);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [dash, m] = await Promise.all([getDashboard(), getMetrics(50)]);
      setDashboard(dash);
      setMetrics(m.metrics);
    } catch (err) {
      toastError(err instanceof Error ? err.message : t("progress.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave() {
    const weightNum = weight.trim() ? Number(weight) : null;
    const bodyFatNum = bodyFat.trim() ? Number(bodyFat) : null;
    const notesText = notes.trim() || null;
    if (weightNum === null && bodyFatNum === null && !notesText) return;
    try {
      setSaving(true);
      await createMetric({ weight: weightNum, bodyFat: bodyFatNum, notes: notesText });
      setWeight("");
      setBodyFat("");
      setNotes("");
      setShowAdd(false);
      await load();
    } catch (err) {
      toastError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t("progress.deleteConfirm"))) return;
    try {
      await deleteMetric(id);
      await load();
    } catch (err) {
      toastError(err instanceof Error ? err.message : t("common.error"));
    }
  }

  if (loading && !dashboard) {
    return (
      <section className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {dashboard && (
        <div className="grid grid-cols-3 gap-2">
          <StatCard label={t("progress.statSessions")} value={String(dashboard.stats.completedSessions)} />
          <StatCard label={t("progress.statStreak")} value={t("home.streakDays", { n: dashboard.stats.streak })} />
          <StatCard label={t("progress.statWeekVolume")} value={String(dashboard.stats.weekVolume)} />
        </div>
      )}

      <article className="rounded-2xl border border-hairline bg-panel p-4">
        <h3 className="text-sm font-semibold text-ink-soft">{t("progress.weightTitle")}</h3>
        {dashboard && dashboard.weightHistory.length > 0 ? (
          <WeightChart points={dashboard.weightHistory} locale={locale} />
        ) : (
          <p className="mt-3 text-xs text-ink-faint">{t("progress.weightEmpty")}</p>
        )}
        {!showAdd ? (
          <button
            onClick={() => setShowAdd(true)}
            className="mt-3 rounded-xl bg-elevated px-4 py-2 text-sm"
          >
            {t("progress.addMetric")}
          </button>
        ) : (
          <div className="mt-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Field label={t("progress.weightLabel")} value={weight} onChange={setWeight} inputMode="decimal" />
              <Field label={t("progress.bodyFatLabel")} value={bodyFat} onChange={setBodyFat} inputMode="decimal" />
            </div>
            <Field label={t("progress.notesLabel")} value={notes} onChange={setNotes} />
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 rounded-xl bg-elevated px-3 py-2 text-sm"
              >
                {t("progress.cancel")}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
              >
                {saving ? t("progress.saving") : t("progress.save")}
              </button>
            </div>
          </div>
        )}
      </article>

      {dashboard && (
        <article className="rounded-2xl border border-hairline bg-panel p-4">
          <h3 className="text-sm font-semibold text-ink-soft">{t("progress.calendarTitle")}</h3>
          <Calendar days={dashboard.calendar} trainingDays={trainingDays} t={t} />
        </article>
      )}

      {dashboard && (
        <article className="rounded-2xl border border-hairline bg-panel p-4">
          <h3 className="text-sm font-semibold text-ink-soft">{t("progress.prTitle")}</h3>
          {dashboard.personalRecords.length === 0 ? (
            <p className="mt-3 text-xs text-ink-faint">{t("progress.prEmpty")}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {dashboard.personalRecords.map((pr) => (
                <li key={pr.exerciseId} className="flex items-center justify-between rounded-xl bg-elevated p-3">
                  <div>
                    <p className="text-xs text-ink-faint">{t(pr.slotName)}</p>
                    <p className="mt-0.5">{exerciseName(pr, locale)}</p>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-300">
                    {t("progress.prValue", { weight: pr.weight, reps: pr.reps })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
      )}

      <article className="rounded-2xl border border-hairline bg-panel p-4">
        <h3 className="text-sm font-semibold text-ink-soft">{t("progress.historyTitle")}</h3>
        {metrics.length === 0 ? (
          <p className="mt-3 text-xs text-ink-faint">{t("progress.historyEmpty")}</p>
        ) : (
          <ul className="mt-3 space-y-1 text-xs">
            {metrics.map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-lg bg-elevated px-3 py-2">
                <span className="text-ink-faint">{new Date(m.date).toLocaleDateString(locale)}</span>
                <span className="font-medium text-ink">
                  {m.weight !== null ? `${m.weight} ${t("unit.kg")}` : ""}
                  {m.bodyFat !== null ? ` · ${m.bodyFat}%` : ""}
                </span>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-rose-500 hover:text-rose-600 dark:text-rose-300 dark:hover:text-rose-200"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-panel p-3 text-center">
      <p className="text-xs text-ink-faint">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  inputMode
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "numeric" | "decimal";
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-ink-faint">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-hairline bg-elevated px-3 py-2 text-sm text-ink outline-none focus:border-emerald-400"
        inputMode={inputMode}
      />
    </label>
  );
}

function WeightChart({
  points,
  locale
}: {
  points: { date: string; weight: number }[];
  locale: string;
}) {
  if (points.length === 0) return null;
  const weights = points.map((p) => p.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const range = Math.max(0.5, maxWeight - minWeight);
  const last = points[points.length - 1];

  return (
    <>
      <p className="mt-1 text-xs text-ink-faint">
        {last.weight} kg · {new Date(last.date).toLocaleDateString(locale)}
      </p>
      <div className="mt-3 flex items-end gap-1">
        {points.slice(-12).map((point) => {
          const heightPct = ((point.weight - minWeight) / range) * 60 + 10;
          return (
            <div key={point.date} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-md bg-emerald-400" style={{ height: `${heightPct}px` }} />
              <span className="text-[8px] text-ink-faint">
                {new Date(point.date).toLocaleDateString(locale, { day: "numeric", month: "numeric" })}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

// Weekday (0=Sun..6=Sat) for a "YYYY-MM-DD" string, parsed as a local date so
// the result is timezone-stable (avoids the UTC-shift of `new Date(isoDate)`).
function weekdayOf(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

function Calendar({
  days,
  trainingDays,
  t
}: {
  days: { date: string; trained: boolean }[];
  trainingDays: number[] | undefined;
  t: TranslateFn;
}) {
  return (
    <>
      <div className="mt-3 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const extra =
            day.trained &&
            trainingDays !== undefined &&
            trainingDays.length > 0 &&
            !trainingDays.includes(weekdayOf(day.date));
          return (
            <div
              key={day.date}
              className={`aspect-square rounded-md text-center text-[10px] leading-[1.8] ${
                extra
                  ? "bg-sky-500 text-slate-950"
                  : day.trained
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-elevated text-ink-faint"
              }`}
              title={day.date}
            >
              {Number(day.date.slice(8, 10))}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-4 text-[10px] text-ink-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
          {t("progress.calendarLegendScheduled")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-500" />
          {t("progress.calendarLegendExtra")}
        </span>
      </div>
    </>
  );
}
