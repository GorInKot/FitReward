const weightHistory = [
  { week: "W1", weight: 82.4 },
  { week: "W2", weight: 81.9 },
  { week: "W3", weight: 81.3 },
  { week: "W4", weight: 80.8 }
];

const records = [
  { exercise: "Жим лёжа", value: "85 кг" },
  { exercise: "Присед", value: "110 кг" },
  { exercise: "Становая", value: "135 кг" }
];

export default function Progress() {
  const maxWeight = Math.max(...weightHistory.map((item) => item.weight));
  const minWeight = Math.min(...weightHistory.map((item) => item.weight));

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-xl font-semibold">Прогресс веса</h2>
        <p className="mt-1 text-sm text-slate-400">Текущий вес: 80.8 кг</p>
        <div className="mt-4 flex items-end gap-2">
          {weightHistory.map((point) => {
            const height = ((maxWeight - point.weight) / (maxWeight - minWeight + 0.2)) * 70 + 30;
            return (
              <div key={point.week} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-md bg-emerald-400" style={{ height: `${height}px` }} />
                <span className="text-xs text-slate-400">{point.week}</span>
              </div>
            );
          })}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-300">Календарь месяца</h3>
        <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs">
          {Array.from({ length: 28 }, (_, index) => {
            const done = [1, 3, 5, 8, 10, 12, 15, 17, 21, 24].includes(index + 1);
            return (
              <div key={index} className={`rounded-md p-2 ${done ? "bg-emerald-500 text-slate-950" : "bg-slate-800"}`}>
                {index + 1}
              </div>
            );
          })}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-300">Личные рекорды</h3>
        <ul className="mt-3 space-y-2">
          {records.map((record) => (
            <li key={record.exercise} className="flex items-center justify-between rounded-xl bg-slate-800 p-3 text-sm">
              <span>{record.exercise}</span>
              <span className="font-semibold text-emerald-300">{record.value}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
