import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiDashboard, getDashboard, getNextProgramDay } from "../utils/api";
import { useTranslation } from "../i18n";
import { useProfileStore } from "../store/profileStore";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile);
  const [dashboard, setDashboard] = useState<ApiDashboard | null>(null);
  const [nextDay, setNextDay] = useState<{ id: string; name: string; order: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [dash, next] = await Promise.all([getDashboard(), getNextProgramDay()]);
        if (!cancelled) {
          setDashboard(dash);
          setNextDay(next.nextDay);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const greetingName = profile?.firstName ?? "";

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-4 text-slate-950">
        <p className="text-sm font-medium">
          {t("home.greeting")}
          {greetingName ? ` ${greetingName}` : ""}
        </p>
        {nextDay ? (
          <>
            <h2 className="mt-1 text-xl font-bold">
              {t("home.nextWorkout", {
                name: t("day.dayN", { n: nextDay.order, name: t(nextDay.name) })
              })}
            </h2>
            <button
              onClick={() => navigate("/workout")}
              className="mt-3 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-emerald-300"
            >
              {t("home.startWorkout")}
            </button>
          </>
        ) : (
          <p className="mt-1 text-sm">{t("home.noProgram")}</p>
        )}
      </div>

      {dashboard?.fatigue.status === "elevated" && (
        <article className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
          <h3 className="text-sm font-semibold text-amber-200">{t("fatigue.bannerTitle")}</h3>
          <ul className="mt-2 space-y-1 text-xs text-amber-100/90">
            {dashboard.fatigue.reasons.map((reason, i) => {
              const params: Record<string, string | number> = { ...(reason.params ?? {}) };
              if (typeof params.slot === "string") {
                params.slot = t(params.slot);
              }
              return (
                <li key={i} className="flex gap-2">
                  <span>·</span>
                  <span>{t(reason.key, params)}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-amber-200/80">{t("fatigue.bannerHint")}</p>
        </article>
      )}

      {dashboard && (
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold text-slate-300">{t("home.weekTitle")}</h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Stat label={t("home.statSessions")} value={String(dashboard.stats.weekSessionsCount)} />
            <Stat label={t("home.statStreak")} value={t("home.streakDays", { n: dashboard.stats.streak })} />
            <Stat label={t("home.statVolume")} value={String(dashboard.stats.weekVolume)} />
          </div>
        </article>
      )}

      {loading && !dashboard && (
        <p className="text-xs text-slate-500">{t("app.loading")}</p>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-800 p-3 text-center">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
