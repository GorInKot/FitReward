import { useEffect, useMemo, useState } from "react";
import { ApiProfile, getProfile, updateProfile } from "../utils/api";
import { getTelegramUsername } from "../utils/telegram";

const achievements = [
  { name: "Первая тренировка", claimed: true, reward: 10 },
  { name: "Неделя в режиме", claimed: false, reward: 50 }
];

const notificationSettings = [
  { key: "Напоминания о тренировках", enabled: true },
  { key: "Уведомления о достижениях", enabled: true },
  { key: "Недельная сводка", enabled: false }
];

export default function Profile() {
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState<ApiProfile["fitnessLevel"]>("BEGINNER");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setAge(data.age ? String(data.age) : "");
        setWeight(data.weight ? String(data.weight) : "");
        setHeight(data.height ? String(data.height) : "");
        setFitnessLevel(data.fitnessLevel);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const profileSubtitle = useMemo(() => {
    if (!profile) {
      return "Профиль загружается...";
    }

    const usernameFromTelegram = getTelegramUsername();
    const username = profile.username
      ? `@${profile.username}`
      : usernameFromTelegram
        ? `@${usernameFromTelegram}`
        : profile.telegramId;
    const weight = profile.weight ? `· Вес ${profile.weight} кг` : "";
    const levelLabel =
      profile.fitnessLevel === "BEGINNER"
        ? "Начальный"
        : profile.fitnessLevel === "INTERMEDIATE"
          ? "Средний"
          : "Продвинутый";
    return `${username} · ${levelLabel}${weight}`;
  }, [profile]);

  function openEditMode() {
    if (!profile) {
      return;
    }

    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setAge(profile.age ? String(profile.age) : "");
    setWeight(profile.weight ? String(profile.weight) : "");
    setHeight(profile.height ? String(profile.height) : "");
    setFitnessLevel(profile.fitnessLevel);
    setIsEditing(true);
  }

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
        weight: weight.trim() ? Number(weight) : null,
        fitnessLevel,
        goals: profile.goals.length ? profile.goals : ["GENERAL_FITNESS"]
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
        <p className="mt-1 text-sm text-slate-400">{profileSubtitle}</p>
        {isEditing && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              Имя
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                placeholder="Иван"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              Фамилия
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                placeholder="Иванов"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              Возраст
              <input
                value={age}
                onChange={(event) => setAge(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                placeholder="26"
                inputMode="numeric"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              Вес (кг)
              <input
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                placeholder="80.8"
                inputMode="decimal"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              Рост (см)
              <input
                value={height}
                onChange={(event) => setHeight(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                placeholder="178"
                inputMode="numeric"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              Уровень
              <select
                value={fitnessLevel}
                onChange={(event) => setFitnessLevel(event.target.value as ApiProfile["fitnessLevel"])}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
              >
                <option value="BEGINNER">Начальный</option>
                <option value="INTERMEDIATE">Средний</option>
                <option value="ADVANCED">Продвинутый</option>
              </select>
            </label>
          </div>
        )}
        <button
          onClick={isEditing ? handleSaveProfile : openEditMode}
          disabled={saving || loading}
          className="mt-3 rounded-xl bg-slate-800 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Сохранение..." : isEditing ? "Сохранить профиль" : "Редактировать профиль"}
        </button>
        {loading && <p className="mt-2 text-xs text-slate-400">Загрузка профиля...</p>}
        {error && <p className="mt-2 text-xs text-rose-300">Ошибка: {error}</p>}
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-300">Уведомления</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {notificationSettings.map((item) => (
            <li key={item.key} className="flex items-center justify-between rounded-xl bg-slate-800 p-3">
              <span>{item.key}</span>
              <span className={item.enabled ? "text-emerald-300" : "text-slate-500"}>
                {item.enabled ? "ВКЛ" : "ВЫКЛ"}
              </span>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-300">Достижения и награды</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {achievements.map((item) => (
            <li key={item.name} className="flex items-center justify-between rounded-xl bg-slate-800 p-3">
              <span>🏆 {item.name}</span>
              <span className={item.claimed ? "text-slate-400" : "text-amber-300"}>
                {item.claimed ? "Получено" : `Забрать ${item.reward} ⭐`}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
