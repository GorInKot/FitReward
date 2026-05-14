import { ExperienceLevel, TrainingStructure } from "../prismaEnums";

export interface RecommendationInput {
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
}

export interface RecommendationResult {
  structure: TrainingStructure;
  reasons: string[];
}

const ADVANCED_LEVELS = new Set<ExperienceLevel>([ExperienceLevel.THREE_PLUS_YEARS]);
const INTERMEDIATE_PLUS = new Set<ExperienceLevel>([
  ExperienceLevel.ONE_TO_TWO_YEARS,
  ExperienceLevel.THREE_PLUS_YEARS
]);

export function recommendTrainingStructure(input: RecommendationInput): RecommendationResult {
  const { experienceLevel, trainingDaysPerWeek } = input;
  const reasons: string[] = [];

  const isBeginner =
    experienceLevel === ExperienceLevel.NEVER || experienceLevel === ExperienceLevel.LESS_THAN_6_MONTHS;

  // 2-3 days: always full-body — best frequency of compound movements for any level
  if (trainingDaysPerWeek <= 3) {
    reasons.push(`${trainingDaysPerWeek} тренировок в неделю — оптимальная частота для full-body`);
    reasons.push("Каждая мышечная группа прорабатывается 2–3 раза в неделю");
    if (isBeginner) {
      reasons.push("Новичкам важна частая практика базовых движений");
    }
    return { structure: TrainingStructure.FULL_BODY, reasons };
  }

  // 4 days: upper/lower split
  if (trainingDaysPerWeek === 4) {
    reasons.push("4 тренировки в неделю удобно делить на верх и низ тела");
    reasons.push("Каждая часть тела получает 2 тренировочных дня");
    if (isBeginner) {
      reasons.push("Upper/Lower — мягкий переход от full-body для растущего объёма");
    }
    return { structure: TrainingStructure.UPPER_LOWER, reasons };
  }

  // 5-6 days: PPL for intermediate+, classic split for advanced
  if (trainingDaysPerWeek >= 5) {
    if (isBeginner) {
      // Beginner with 5+ days/week — too much volume, recommend full-body anyway
      reasons.push("Для уровня «новичок» 5+ тренировок в неделю — высокий риск перетренированности");
      reasons.push("Рекомендуем full-body с возможностью 1–2 дней отдыха");
      return { structure: TrainingStructure.FULL_BODY, reasons };
    }
    if (ADVANCED_LEVELS.has(experienceLevel)) {
      reasons.push("Опыт 3+ года + 5–6 дней позволяет использовать классический сплит");
      reasons.push("Каждая мышечная группа — максимум фокуса в свой день");
      return { structure: TrainingStructure.SPLIT, reasons };
    }
    if (INTERMEDIATE_PLUS.has(experienceLevel)) {
      reasons.push("При среднем опыте и высокой частоте Push/Pull/Legs даёт баланс объёма и восстановления");
      reasons.push("Каждая группа мышц 2 раза в неделю с разным акцентом");
      return { structure: TrainingStructure.PUSH_PULL_LEGS, reasons };
    }
  }

  // Defensive fallback (shouldn't reach here with valid input)
  reasons.push("Универсальный выбор для большинства уровней подготовки");
  return { structure: TrainingStructure.FULL_BODY, reasons };
}
