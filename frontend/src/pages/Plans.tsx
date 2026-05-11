const plans = [
  {
    id: "plan_beginner",
    name: "Beginner Full Body",
    duration: 4,
    workoutsPerWeek: 3,
    goal: "GENERAL_FITNESS",
    aiGenerated: false
  },
  {
    id: "plan_fat_loss",
    name: "Fat Loss Sprint",
    duration: 6,
    workoutsPerWeek: 4,
    goal: "WEIGHT_LOSS",
    aiGenerated: false
  },
  {
    id: "plan_strength",
    name: "Strength Builder",
    duration: 8,
    workoutsPerWeek: 4,
    goal: "STRENGTH",
    aiGenerated: true
  }
];

export default function Plans() {
  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-xl font-semibold">Текущий план</h2>
        <p className="mt-1 text-sm text-slate-400">Strength Builder · Неделя 2 из 8</p>
        <div className="mt-3 h-2 rounded-full bg-slate-800">
          <div className="h-full w-1/4 rounded-full bg-emerald-400" />
        </div>
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300">Рекомендованные планы</h3>
          <button className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950">
            Создать AI план
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {plans.map((plan) => (
            <li key={plan.id} className="rounded-xl bg-slate-800 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{plan.name}</p>
                <span className="text-xs text-emerald-300">{plan.aiGenerated ? "AI" : "Template"}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {plan.duration} недель · {plan.workoutsPerWeek} трен/нед · цель: {plan.goal}
              </p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
