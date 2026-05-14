import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExperienceLevel,
  PrimaryGoal,
  TrainingEnvironment,
  TrainingStructure,
  updateProfile
} from "../utils/api";
import { getTelegramUsername } from "../utils/telegram";
import { useProfileStore } from "../store/profileStore";

const GOAL_LABEL: Record<PrimaryGoal, string> = {
  MUSCLE_GAIN: "Набор мышц",
  FAT_LOSS: "Снижение веса",
  GENERAL_FITNESS: "Общая форма",
  STRENGTH: "Сила",
  ENDURANCE: "Выносливость",
  BODY_RECOMPOSITION: "Рекомпозиция",
  RETURN_AFTER_BREAK: "Возврат к тренировкам"
};

const EXPERIENCE_LABEL: Record<ExperienceLevel, string> = {
  NEVER: "Никогда не тренировался",
  LESS_THAN_6_MONTHS: "Меньше 6 месяцев",
  ONE_TO_TWO_YEARS: "1–2 года",
  THREE_PLUS_YEARS: "3+ года"
};

const ENV_LABEL: Record<TrainingEnvironment, string> = {
  GYM: "Спортзал",
  HOME: "Дома",
  HOME_MINIMAL: "Дома с минимумом",
  BODYWEIGHT: "Только своё тело"
};

const STRUCTURE_LABEL: Record<TrainingStructure, string> = {
  FULL_BODY: "Full-body",
  UPPER_LOWER: "Upper/Lower",
  PUSH_PULL_LEGS: "Push/Pull/Legs",
  SPLIT: "Классический сплит"
};

export default function Profile() {
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile);
  const loading = useProfileStore((s) => s.loading);
  const setProfile = useProfileStore((s) => s.setProfile);
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
      return "Профиль загружается...";
    }
    const usernameFromTelegram = getTelegramUsername();
    const handle = profile.username
      ? `@${profile.username}`
      : usernameFromTelegram
        ? `@${usernameFromTelegram}`
        : profile.telegramId;
    return handle;
  }, [profile]);

  async function handleSaveProfile() {
    if (!profile) {
      return;
    }
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
      setError(err instanceof Error ? err.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-xl font-semibold">Профиль</h2>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        {isEditing && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Field label="Имя" value={firstName} onChange={setFirstName} placeholder="Иван" />
            <Field label="Фамилия" value={lastName} onChange={setLastName} placeholder="Иванов" />
            <Field label="Возраст" value={age} onChange={setAge} placeholder="26" inputMode="numeric" />
            <Field label="Вес (кг)" value={weight} onChange={setWeight} placeholder="80.8" inputMode="decimal" />
            <Field label="Рост (см)" value={height} onChange={setHeight} placeholder="178" inputMode="numeric" />
          </div>
        )}
        <button
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          disabled={saving || loading}
          className="mt-3 rounded-xl bg-slate-800 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Сохранение..." : isEditing ? "Сохранить" : "Редактировать"}
        </button>
        {loading && <p className="mt-2 text-xs text-slate-400">Загрузка...</p>}
        {error && <p className="mt-2 text-xs text-rose-300">Ошибка: {error}</p>}
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-300">Тренировочный профиль</h3>
        {profile?.onboardingCompleted ? (
          <ul className="mt-3 space-y-2 text-sm">
            {profile.primaryGoal && (
              <Row label="Цель" value={GOAL_LABEL[profile.primaryGoal]} />
            )}
            {profile.experienceLevel && (
              <Row label="Опыт" value={EXPERIENCE_LABEL[profile.experienceLevel]} />
            )}
            {profile.trainingDaysPerWeek && (
              <Row label="Частота" value={`${profile.trainingDaysPerWeek} раз в неделю`} />
            )}
            {profile.trainingEnvironment && (
              <Row label="Среда" value={ENV_LABEL[profile.trainingEnvironment]} />
            )}
            {profile.recommendedStructure && (
              <Row
                label="Структура"
                value={STRUCTURE_LABEL[profile.recommendedStructure]}
                highlight
              />
            )}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-400">Онбординг ещё не пройден.</p>
        )}
        <button
          onClick={() => navigate("/onboarding")}
          className="mt-3 rounded-xl bg-slate-800 px-4 py-2 text-sm"
        >
          {profile?.onboardingCompleted ? "Пройти онбординг заново" : "Пройти онбординг"}
        </button>
      </article>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "numeric" | "decimal";
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-400">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
        placeholder={placeholder}
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
