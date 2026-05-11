const exercises = [
  { name: "Жим лёжа", target: "4 x 8", done: true },
  { name: "Подтягивания", target: "4 x 10", done: true },
  { name: "Тяга штанги", target: "3 x 10", done: false },
  { name: "Плечи в тренажёре", target: "3 x 12", done: false }
];

export default function Workout() {
  const completed = exercises.filter((exercise) => exercise.done).length;

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-xs text-slate-400">Активная тренировка</p>
        <h2 className="mt-1 text-xl font-semibold">Силовая на верх тела</h2>
        <p className="mt-2 text-sm text-slate-300">Прогресс: {completed}/{exercises.length} упражнений</p>
        <div className="mt-3 h-2 rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-400"
            style={{ width: `${(completed / exercises.length) * 100}%` }}
          />
        </div>
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-300">Текущее упражнение</h3>
        <p className="mt-2 text-lg font-semibold">Тяга штанги</p>
        <p className="text-sm text-slate-400">Подход 2 из 3 · Цель: 10 повторений</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <button className="rounded-xl bg-emerald-500 px-3 py-2 font-semibold text-slate-950">Выполнено</button>
          <button className="rounded-xl bg-slate-800 px-3 py-2">Пропустить</button>
          <button className="rounded-xl bg-slate-800 px-3 py-2">Завершить</button>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-300">План упражнений</h3>
        <ul className="mt-3 space-y-2">
          {exercises.map((exercise) => (
            <li key={exercise.name} className="flex items-center justify-between rounded-xl bg-slate-800 p-3 text-sm">
              <span>{exercise.done ? "✅" : "⬜"} {exercise.name}</span>
              <span className="text-slate-400">{exercise.target}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
