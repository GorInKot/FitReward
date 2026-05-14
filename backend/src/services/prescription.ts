import { ExperienceLevel, PrimaryGoal } from "../prismaEnums";

export interface Prescription {
  sets: number;
  repsLow: number;
  repsHigh: number;
  restSec: number;
}

interface GoalPreset {
  compound: Prescription;
  isolation: Prescription;
}

const GOAL_PRESETS: Record<PrimaryGoal, GoalPreset> = {
  MUSCLE_GAIN: {
    compound: { sets: 4, repsLow: 6, repsHigh: 10, restSec: 120 },
    isolation: { sets: 3, repsLow: 8, repsHigh: 12, restSec: 75 }
  },
  STRENGTH: {
    compound: { sets: 5, repsLow: 3, repsHigh: 6, restSec: 180 },
    isolation: { sets: 3, repsLow: 6, repsHigh: 10, restSec: 90 }
  },
  FAT_LOSS: {
    compound: { sets: 3, repsLow: 10, repsHigh: 15, restSec: 60 },
    isolation: { sets: 3, repsLow: 12, repsHigh: 18, restSec: 45 }
  },
  ENDURANCE: {
    compound: { sets: 3, repsLow: 12, repsHigh: 20, restSec: 45 },
    isolation: { sets: 3, repsLow: 15, repsHigh: 25, restSec: 30 }
  },
  GENERAL_FITNESS: {
    compound: { sets: 3, repsLow: 8, repsHigh: 12, restSec: 90 },
    isolation: { sets: 3, repsLow: 10, repsHigh: 15, restSec: 60 }
  },
  BODY_RECOMPOSITION: {
    compound: { sets: 3, repsLow: 8, repsHigh: 12, restSec: 90 },
    isolation: { sets: 3, repsLow: 10, repsHigh: 15, restSec: 60 }
  },
  RETURN_AFTER_BREAK: {
    compound: { sets: 2, repsLow: 8, repsHigh: 12, restSec: 120 },
    isolation: { sets: 2, repsLow: 10, repsHigh: 15, restSec: 90 }
  }
};

const EXPERIENCE_SLOT_COUNT: Record<ExperienceLevel, number> = {
  NEVER: 4,
  LESS_THAN_6_MONTHS: 5,
  ONE_TO_TWO_YEARS: 6,
  THREE_PLUS_YEARS: 7
};

export function prescriptionFor(goal: PrimaryGoal, isCompound: boolean): Prescription {
  const preset = GOAL_PRESETS[goal];
  return isCompound ? preset.compound : preset.isolation;
}

export function slotCountFor(experience: ExperienceLevel): number {
  return EXPERIENCE_SLOT_COUNT[experience];
}
