import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../utils/api";
import { getTelegramUsername } from "../utils/telegram";
import { useProfileStore } from "../store/profileStore";
import { useAchievementStore } from "../store/achievementStore";
import { Locale, useTranslation } from "../i18n";

export default function Profile() {
  const navigate = useNavigate();
  const { t, locale, setLocale } = useTranslation();
  const profile = useProfileStore((s) => s.profile);
  const loading = useProfileStore((s) => s.loading);
  const setProfile = useProfileStore((s) => s.setProfile);
  const achievements = useAchievementStore((s) => s.achievements);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setAge(profile.age ? String(profile.age) : "");
      setWeight(profile.weight ? String(profile.weight) : "");
      setHeight(profile.height ? String(profile.height) : "");
    }
  }, [profile]);

  const subtitle = useMemo(() => {
    if (!profile) {
      return t("profile.loading");
    }
    const usernameFromTelegram = getTelegramUsername();
    return profile.username
      ? `@${profile.username}`
      : usernameFromTelegram
        ? `@${usernameFromTelegram}`
        : profile.telegramId;
  }, [profile, t]);

  async function handleSaveProfile() {
    if (!profile) return;
    try {
      setSaving(true);
      const updated = await updateProfile({
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
        age: age.trim() ? Number(age) : null,
        height: height.trim() ? Number(height) : null,
        weight: weight.trim() ? Number(weight) : null
      });
      setProfile(updated);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-xl font-semibold">{t("profile.title")}</h2>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        {isEditing && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Field label={t("profile.fields.firstName")} value={firstName} onChange={setFirstName} />
            <Field label={t("profile.fields.lastName")} value={lastName} onChange={setLastName} />
            <Field label={t("profile.fields.age")} value={age} onChange={setAge} inputMode="numeric" />
            <Field label={t("profile.fields.weight")} value={weight} onChange={setWeight} inputMode="decimal" />
            <Field label={t("profile.fields.height")} value={height} onChange={setHeight} inputMode="numeric" />
          </div>
        )}
        <button
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          disabled={saving || loading}
          className="mt-3 rounded-xl bg-slate-800 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? t("common.saving") : isEditing ? t("common.save") : t("common.edit")}
        </button>
        {loading && <p className="mt-2 text-xs text-slate-400">{t("app.loading")}</p>}
        {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-300">{t("profile.trainingProfile")}</h3>
        {profile?.onboardingCompleted ? (
          <ul className="mt-3 space-y-2 text-sm">
            {profile.primaryGoal && <Row label={t("profile.row.goal")} value={t(`goal.${profile.primaryGoal}`)} />}
            {profile.experienceLevel && (
              <Row label={t("profile.row.experience")} value={t(`experience.${profile.experienceLevel}`)} />
            )}
            {profile.trainingDaysPerWeek && (
              <Row
                label={t("profile.row.frequency")}
                value={t("common.weekly", { n: profile.trainingDaysPerWeek })}
              />
            )}
            {profile.trainingEnvironment && (
              <Row label={t("profile.row.environment")} value={t(`environment.${profile.trainingEnvironment}`)} />
            )}
            {profile.recommendedStructure && (
              <Row
                label={t("profile.row.structure")}
                value={t(`structure.${profile.recommendedStructure}`)}
                highlight
              />
            )}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-400">{t("profile.notOnboarded")}</p>
        )}
        <button onClick={() => navigate("/onboarding")} className="mt-3 rounded-xl bg-slate-800 px-4 py-2 text-sm">
          {profile?.onboardingCompleted ? t("profile.restartOnboarding") : t("profile.startOnboarding")}
        </button>
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300">{t("achievement.sectionTitle")}</h3>
          <span className="text-xs text-slate-500">
            {t("achievement.progress", {
              unlocked: achievements.filter((a) => a.unlockedAt).length,
              total: achievements.length
            })}
          </span>
        </div>
        {achievements.length > 0 && (
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {achievements.map((a) => {
              const unlocked = Boolean(a.unlockedAt);
              return (
                <li
                  key={a.key}
                  className={`rounded-xl border p-3 ${
                    unlocked
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-slate-800 bg-slate-800/40 opacity-60"
                  }`}
                >
                  <p className="text-base">{unlocked ? "🏆" : t("achievement.locked")}</p>
                  <p className={`mt-1 text-sm font-medium ${unlocked ? "text-emerald-100" : "text-slate-300"}`}>
                    {t(`achievement.${a.key}.title`)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    {t(`achievement.${a.key}.description`)}
                  </p>
                  <p className="mt-1 text-[10px] text-amber-300">
                    {t("achievement.rewardSuffix", { n: a.reward })}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-300">{t("language.title")}</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(["ru", "en"] as Locale[]).map((value) => (
            <button
              key={value}
              onClick={() => setLocale(value)}
              className={`rounded-xl px-4 py-2 text-sm ${
                locale === value ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"
              }`}
            >
              {t(`language.${value}`)}
            </button>
          ))}
        </div>
      </article>
    </section>
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
    <label className="flex flex-col gap-1 text-xs text-slate-400">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
        inputMode={inputMode}
      />
    </label>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <li className="flex items-center justify-between rounded-xl bg-slate-800 p-3">
      <span className="text-slate-400">{label}</span>
      <span className={highlight ? "font-semibold text-emerald-300" : ""}>{value}</span>
    </li>
  );
}
