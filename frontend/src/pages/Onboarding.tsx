import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExperienceLevel,
  Limitation,
  OnboardingPayload,
  PrimaryGoal,
  RecommendationReason,
  TrainingEnvironment,
  TrainingStructure,
  submitOnboarding
} from "../utils/api";
import { useProfileStore } from "../store/profileStore";
import { useTranslation } from "../i18n";

const GOAL_VALUES: PrimaryGoal[] = [
  "MUSCLE_GAIN",
  "FAT_LOSS",
  "GENERAL_FITNESS",
  "STRENGTH",
  "ENDURANCE",
  "BODY_RECOMPOSITION",
  "RETURN_AFTER_BREAK"
];

const EXPERIENCE_VALUES: ExperienceLevel[] = [
  "NEVER",
  "LESS_THAN_6_MONTHS",
  "ONE_TO_TWO_YEARS",
  "THREE_PLUS_YEARS"
];

const FREQUENCY_OPTIONS = [2, 3, 4, 5, 6];

const ENVIRONMENT_VALUES: TrainingEnvironment[] = ["GYM", "HOME", "HOME_MINIMAL", "BODYWEIGHT"];

const LIMITATION_VALUES: Limitation[] = ["NONE", "LOWER_BACK", "KNEES", "SHOULDERS", "POST_INJURY"];

const TOTAL_STEPS = 5;

export default function Onboarding() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setProfile = useProfileStore((s) => s.setProfile);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<PrimaryGoal | null>(null);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [environment, setEnvironment] = useState<TrainingEnvironment | null>(null);
  const [limitations, setLimitations] = useState<Limitation[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<
    { suggested: TrainingStructure; reasons: RecommendationReason[] } | null
  >(null);

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
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <section className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-5 text-slate-950">
          <p className="text-sm font-medium">{t("onboarding.result.done")}</p>
          <h2 className="mt-2 text-2xl font-bold">
            {t("onboarding.result.recommendTitle", { structure: t(`structure.${result.suggested}`) })}
          </h2>
        </div>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold text-slate-300">{t("onboarding.result.whyTitle")}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {result.reasons.map((reason, i) => (
              <li key={i} className="flex gap-2 rounded-xl bg-slate-800 p-3">
                <span className="text-emerald-300">·</span>
                <span>{t(reason.key, reason.params)}</span>
              </li>
            ))}
          </ul>
        </article>
        <button
          onClick={() => navigate("/")}
          className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950"
        >
          {t("onboarding.result.continue")}
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs text-slate-400">
          {t("onboarding.progress", { step, total: TOTAL_STEPS })}
        </p>
        <div className="h-1 rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <StepWrapper title={t("onboarding.step1.title")} subtitle={t("onboarding.step1.subtitle")}>
          {GOAL_VALUES.map((value) => (
            <OptionCard
              key={value}
              label={t(`goal.${value}`)}
              hint={t(`goal.${value}_hint`)}
              selected={goal === value}
              onClick={() => setGoal(value)}
            />
          ))}
        </StepWrapper>
      )}

      {step === 2 && (
        <StepWrapper title={t("onboarding.step2.title")} subtitle={t("onboarding.step2.subtitle")}>
          {EXPERIENCE_VALUES.map((value) => (
            <OptionCard
              key={value}
              label={t(`experience.${value}`)}
              selected={experience === value}
              onClick={() => setExperience(value)}
            />
          ))}
        </StepWrapper>
      )}

      {step === 3 && (
        <StepWrapper title={t("onboarding.step3.title")} subtitle={t("onboarding.step3.subtitle")}>
          {FREQUENCY_OPTIONS.map((days) => {
            const word =
              days === 1
                ? t("onboarding.step3.day")
                : days >= 5
                  ? t("onboarding.step3.days_many")
                  : t("onboarding.step3.days_few");
            return (
              <OptionCard
                key={days}
                label={t("onboarding.step3.perWeek", { n: days, word })}
                selected={frequency === days}
                onClick={() => setFrequency(days)}
              />
            );
          })}
        </StepWrapper>
      )}

      {step === 4 && (
        <StepWrapper title={t("onboarding.step4.title")} subtitle={t("onboarding.step4.subtitle")}>
          {ENVIRONMENT_VALUES.map((value) => (
            <OptionCard
              key={value}
              label={t(`environment.${value}`)}
              hint={t(`environment.${value}_hint`)}
              selected={environment === value}
              onClick={() => setEnvironment(value)}
            />
          ))}
        </StepWrapper>
      )}

      {step === 5 && (
        <StepWrapper title={t("onboarding.step5.title")} subtitle={t("onboarding.step5.subtitle")}>
          {LIMITATION_VALUES.map((value) => (
            <OptionCard
              key={value}
              label={t(`limitation.${value}`)}
              selected={limitations.includes(value)}
              onClick={() => toggleLimitation(value)}
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
            {t("common.back")}
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
            disabled={!canAdvance}
            className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {t("common.next")}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canAdvance || submitting}
            className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {submitting ? t("onboarding.submitting") : t("onboarding.submit")}
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
        selected ? "border-emerald-400 bg-emerald-500/10" : "border-slate-800 bg-slate-900 hover:border-slate-600"
      }`}
    >
      <p className={`text-sm font-medium ${selected ? "text-emerald-300" : "text-white"}`}>{label}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </button>
  );
}
