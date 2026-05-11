const achievements = [
  { name: "Первая тренировка", claimed: true, reward: 10 },
  { name: "Неделя в режиме", claimed: false, reward: 50 }
];

const notificationSettings = [
  { key: "Workout reminders", enabled: true },
  { key: "Achievement alerts", enabled: true },
  { key: "Weekly summary", enabled: false }
];

export default function Profile() {
  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-xl font-semibold">Профиль</h2>
        <p className="mt-1 text-sm text-slate-400">@gorinkot · BEGINNER · Вес 80.8 кг</p>
        <button className="mt-3 rounded-xl bg-slate-800 px-4 py-2 text-sm">Редактировать данные</button>
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-300">Уведомления</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {notificationSettings.map((item) => (
            <li key={item.key} className="flex items-center justify-between rounded-xl bg-slate-800 p-3">
              <span>{item.key}</span>
              <span className={item.enabled ? "text-emerald-300" : "text-slate-500"}>
                {item.enabled ? "ON" : "OFF"}
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
