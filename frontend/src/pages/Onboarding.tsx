import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExperienceLevel,
  Limitation,
  OnboardingPayload,
  PrimaryGoal,
  TrainingEnvironment,
  TrainingStructure,
  submitOnboarding
} from "../utils/api";
import { useProfileStore } from "../store/profileStore";

interface OptionMeta<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

const GOAL_OPTIONS: OptionMeta<PrimaryGoal>[] = [
  { value: "MUSCLE_GAIN", label: "Набор мышц", hint: "Гипертрофия, увеличение объёма" },
  { value: "FAT_LOSS", label: "Снижение веса", hint: "Дефицит калорий + тренировки" },
  { value: "GENERAL_FITNESS", label: "Общая форма", hint: "Здоровье и тонус" },
  { value: "STRENGTH", label: "Сила", hint: "Прирост в базовых движениях" },
  { value: "ENDURANCE", label: "Выносливость", hint: "Кардио и работоспособность" },
  { value: "BODY_RECOMPOSITION", label: "Рекомпозиция", hint: "Жир ↓, мышцы ↑ одновременно" },
  { value: "RETURN_AFTER_BREAK", label: "Возврат к тренировкам", hint: "Мягко вернуться в форму" }
];

const EXPERIENCE_OPTIONS: OptionMeta<ExperienceLevel>[] = [
  { value: "NEVER", label: "Никогда не тренировался" },
  { value: "LESS_THAN_6_MONTHS", label: "Меньше 6 месяцев" },
  { value: "ONE_TO_TWO_YEARS", label: "1–2 года" },
  { value: "THREE_PLUS_YEARS", label: "3+ года" }
];

const FREQUENCY_OPTIONS = [2, 3, 4, 5, 6];

const ENVIRONMENT_OPTIONS: OptionMeta<TrainingEnvironment>[] = [
  { value: "GYM", label: "Спортзал", hint: "Полный доступ к оборудованию" },
  { value: "HOME", label: "Дома", hint: "Гантели, штанга, скамья" },
  { value: "HOME_MINIMAL", label: "Дома с минимумом", hint: "Резинки, гири, эспандер" },
  { value: "BODYWEIGHT", label: "Только своё тело", hint: "Без оборудования" }
];

const LIMITATION_OPTIONS: OptionMeta<Limitation>[] = [
  { value: "NONE", label: "Нет ограничений" },
  { value: "LOWER_BACK", label: "Поясница" },
  { value: "KNEES", label: "Колени" },
  { value: "SHOULDERS", label: "Плечи" },
  { value: "POST_INJURY", label: "После травмы" }
];

const STRUCTURE_LABELS: Record<TrainingStructure, string> = {
  FULL_BODY: "Full-body",
  UPPER_LOWER: "Upper/Lower",
  PUSH_PULL_LEGS: "Push/Pull/Legs",
  SPLIT: "Классический сплит"
};

const TOTAL_STEPS = 5;

export default function Onboarding() {
  const navigate = useNavigate();
  const setProfile = useProfileStore((s) => s.setProfile);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<PrimaryGoal | null>(null);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [environment, setEnvironment] = useState<TrainingEnvironment | null>(null);
  const [limitations, setLimitations] = useState<Limitation[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ suggested: TrainingStructure; reasons: string[] } | null>(null);

  function toggleLimitation(value: Limitation) {
    setLimitations((prev) => {
      if (value === "NONE") {
        return prev.includes("NONE") ? [] : ["NONE"];
      }
      const without = prev.filter((item) => item !== "NONE");
      return without.includes(value) ? without.filter((item) => item !== value) : [...without, value];
    });
  }

  const canAdvance =
    (step === 1 && goal !== null) ||
    (step === 2 && experience !== null) ||
    (step === 3 && frequency !== null) ||
    (step === 4 && environment !== null) ||
    (step === 5 && limitations.length > 0);

  async function handleSubmit() {
    if (!goal || !experience || !frequency || !environment || limitations.length === 0) {
      return;
    }
    const payload: OnboardingPayload = {
      primaryGoal: goal,
      experienceLevel: experience,
      trainingDaysPerWeek: frequency,
      trainingEnvironment: environment,
      limitations
    };
    try {
      setSubmitting(true);
      setError(null);
      const response = await submitOnboarding(payload);
      setProfile(response.profile);
      setResult({
        suggested: response.recommendation.suggestedStructure,
        reasons: response.recommendation.reasons
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <section className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-5 text-slate-950">
          <p className="text-sm font-medium">Готово!</p>
          <h2 className="mt-2 text-2xl font-bold">Мы рекомендуем: {STRUCTURE_LABELS[result.suggested]}</h2>
        </div>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold text-slate-300">Почему</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {result.reasons.map((reason) => (
              <li key={reason} className="flex gap-2 rounded-xl bg-slate-800 p-3">
                <span className="text-emerald-300">·</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </article>
        <button
          onClick={() => navigate("/")}
          className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950"
        >
          Продолжить
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs text-slate-400">
          Шаг {step} из {TOTAL_STEPS}
        </p>
        <div className="h-1 rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <StepWrapper title="Какая твоя главная цель?" subtitle="От этого зависит вся программа тренировок">
          {GOAL_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              hint={option.hint}
              selected={goal === option.value}
              onClick={() => setGoal(option.value)}
            />
          ))}
        </StepWrapper>
      )}

      {step === 2 && (
        <StepWrapper title="Какой у тебя опыт тренировок?" subtitle="Подберём подходящую нагрузку и упражнения">
          {EXPERIENCE_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              hint={option.hint}
              selected={experience === option.value}
              onClick={() => setExperience(option.value)}
            />
          ))}
        </StepWrapper>
      )}

      {step === 3 && (
        <StepWrapper
          title="Сколько дней в неделю реально готов тренироваться?"
          subtitle="Не идеал — а то, что выдержишь стабильно"
        >
          {FREQUENCY_OPTIONS.map((days) => {
            const word = days >= 5 ? "дней" : "дня";
            return (
              <OptionCard
                key={days}
                label={`${days} ${word} в неделю`}
                selected={frequency === days}
                onClick={() => setFrequency(days)}
              />
            );
          })}
        </StepWrapper>
      )}

      {step === 4 && (
        <StepWrapper title="Где будешь тренироваться?" subtitle="От этого зависит подбор упражнений">
          {ENVIRONMENT_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              hint={option.hint}
              selected={environment === option.value}
              onClick={() => setEnvironment(option.value)}
            />
          ))}
        </StepWrapper>
      )}

      {step === 5 && (
        <StepWrapper
          title="Есть ли ограничения?"
          subtitle="Отметь все, что подходит. Подберём упражнения с учётом этого"
        >
          {LIMITATION_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={limitations.includes(option.value)}
              onClick={() => toggleLimitation(option.value)}
            />
          ))}
        </StepWrapper>
      )}

      {error && <p className="rounded-xl bg-rose-900/40 p-3 text-sm text-rose-200">{error}</p>}

      <div className="flex gap-2 pt-2">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-sm"
          >
            Назад
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
            disabled={!canAdvance}
            className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            Далее
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canAdvance || submitting}
            className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {submitting ? "Сохраняем..." : "Получить рекомендацию"}
          </button>
        )}
      </div>
    </section>
  );
}

function StepWrapper({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function OptionCard({
  label,
  hint,
  selected,
  onClick
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-3 text-left transition ${
        selected
          ? "border-emerald-400 bg-emerald-500/10"
          : "border-slate-800 bg-slate-900 hover:border-slate-600"
      }`}
    >
      <p className={`text-sm font-medium ${selected ? "text-emerald-300" : "text-white"}`}>{label}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </button>
  );
}
