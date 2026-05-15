import { ExperienceLevel, TrainingStructure } from "../prismaEnums";

export interface RecommendationInput {
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
}

export interface RecommendationReason {
  key: string;
  params?: Record<string, string | number>;
}

export interface RecommendationResult {
  structure: TrainingStructure;
  reasons: RecommendationReason[];
}

const ADVANCED_LEVELS = new Set<ExperienceLevel>([ExperienceLevel.THREE_PLUS_YEARS]);
const INTERMEDIATE_PLUS = new Set<ExperienceLevel>([
  ExperienceLevel.ONE_TO_TWO_YEARS,
  ExperienceLevel.THREE_PLUS_YEARS
]);

export function recommendTrainingStructure(input: RecommendationInput): RecommendationResult {
  const { experienceLevel, trainingDaysPerWeek } = input;
  const reasons: RecommendationReason[] = [];

  const isBeginner =
    experienceLevel === ExperienceLevel.NEVER || experienceLevel === ExperienceLevel.LESS_THAN_6_MONTHS;

  if (trainingDaysPerWeek <= 3) {
    reasons.push({ key: "reason.full_body_low_frequency", params: { days: trainingDaysPerWeek } });
    reasons.push({ key: "reason.full_body_muscle_coverage" });
    if (isBeginner) {
      reasons.push({ key: "reason.beginner_needs_frequent_practice" });
    }
    return { structure: TrainingStructure.FULL_BODY, reasons };
  }

  if (trainingDaysPerWeek === 4) {
    reasons.push({ key: "reason.upper_lower_four_days" });
    reasons.push({ key: "reason.upper_lower_twice_per_part" });
    if (isBeginner) {
      reasons.push({ key: "reason.upper_lower_transition" });
    }
    return { structure: TrainingStructure.UPPER_LOWER, reasons };
  }

  if (trainingDaysPerWeek >= 5) {
    if (isBeginner) {
      reasons.push({ key: "reason.beginner_high_frequency_risk" });
      reasons.push({ key: "reason.beginner_fallback_full_body" });
      return { structure: TrainingStructure.FULL_BODY, reasons };
    }
    if (ADVANCED_LEVELS.has(experienceLevel)) {
      reasons.push({ key: "reason.advanced_split" });
      reasons.push({ key: "reason.split_max_focus" });
      return { structure: TrainingStructure.SPLIT, reasons };
    }
    if (INTERMEDIATE_PLUS.has(experienceLevel)) {
      reasons.push({ key: "reason.ppl_intermediate_balance" });
      reasons.push({ key: "reason.ppl_twice_per_group" });
      return { structure: TrainingStructure.PUSH_PULL_LEGS, reasons };
    }
  }

  reasons.push({ key: "reason.universal_fallback" });
  return { structure: TrainingStructure.FULL_BODY, reasons };
}
