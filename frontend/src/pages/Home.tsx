const weekStats = [
  { label: "Тренировки", value: "4" },
  { label: "Минуты", value: "195" },
  { label: "Серия", value: "6 дней" }
];

const recentAchievements = [
  { name: "Первая тренировка", reward: 10 },
  { name: "Неделя в режиме", reward: 50 }
];

export default function Home() {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-4 text-slate-950">
        <p className="text-sm font-medium">Привет, Daniil 👋</p>
        <h2 className="mt-1 text-2xl font-bold">Сегодня: Силовая на верх тела</h2>
        <p className="mt-1 text-sm">8 упражнений · 45 минут</p>
        <button className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-emerald-300">
          Начать тренировку
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {weekStats.map((stat) => (
          <article key={stat.label} className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center">
            <p className="text-xs text-slate-400">{stat.label}</p>
            <p className="mt-1 text-lg font-semibold">{stat.value}</p>
          </article>
        ))}
      </div>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-300">Последние достижения</h3>
        <ul className="mt-3 space-y-2">
          {recentAchievements.map((achievement) => (
            <li key={achievement.name} className="flex items-center justify-between rounded-xl bg-slate-800 p-3">
              <span className="text-sm">🏆 {achievement.name}</span>
              <span className="text-xs text-amber-300">+{achievement.reward} звёзд</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
