import { MovementCategory, MuscleGroup, TrainingStructure } from "../prismaEnums";

export interface Slot {
  /** Stable translation key (looked up by frontend i18n). */
  key: string;
  /** Movement category we want from the catalog. */
  category: MovementCategory;
  /** Preferred primary muscle group. */
  primaryMuscle?: MuscleGroup;
  /** Whether this slot should be a compound (affects sets/reps). */
  isCompound: boolean;
}

export interface DayTemplate {
  /** Stable translation key for the day name (e.g. "day.full_body"). */
  key: string;
  slots: Slot[];
}

const FULL_BODY_DAY: DayTemplate = {
  key: "day.full_body",
  slots: [
    { key: "slot.compound_press_chest", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { key: "slot.compound_pull_lats", category: "PULL", primaryMuscle: "LATS", isCompound: true },
    { key: "slot.squat_quads", category: "LEGS", primaryMuscle: "QUADS", isCompound: true },
    { key: "slot.hinge_hamstrings", category: "LEGS", primaryMuscle: "HAMSTRINGS", isCompound: true },
    { key: "slot.core_abs", category: "CORE", primaryMuscle: "ABS", isCompound: false },
    { key: "slot.overhead_press_shoulders", category: "PUSH", primaryMuscle: "SHOULDERS_SIDE", isCompound: true },
    { key: "slot.vertical_pull_lats", category: "PULL", primaryMuscle: "LATS", isCompound: true },
    { key: "slot.biceps_isolation", category: "PULL", primaryMuscle: "BICEPS", isCompound: false }
  ]
};

const UPPER_DAY: DayTemplate = {
  key: "day.upper",
  slots: [
    { key: "slot.compound_press_chest", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { key: "slot.horizontal_row_upper_back", category: "PULL", primaryMuscle: "UPPER_BACK", isCompound: true },
    { key: "slot.overhead_press_shoulders", category: "PUSH", primaryMuscle: "SHOULDERS_SIDE", isCompound: true },
    { key: "slot.vertical_pull_lats", category: "PULL", primaryMuscle: "LATS", isCompound: true },
    { key: "slot.biceps_isolation", category: "PULL", primaryMuscle: "BICEPS", isCompound: false },
    { key: "slot.triceps_isolation", category: "PUSH", primaryMuscle: "TRICEPS", isCompound: false },
    { key: "slot.rear_delt", category: "PULL", primaryMuscle: "SHOULDERS_REAR", isCompound: false }
  ]
};

const LOWER_DAY: DayTemplate = {
  key: "day.lower",
  slots: [
    { key: "slot.squat_quads", category: "LEGS", primaryMuscle: "QUADS", isCompound: true },
    { key: "slot.hinge_hamstrings", category: "LEGS", primaryMuscle: "HAMSTRINGS", isCompound: true },
    { key: "slot.lunge_glutes", category: "LEGS", primaryMuscle: "GLUTES", isCompound: true },
    { key: "slot.hamstring_curl", category: "LEGS", primaryMuscle: "HAMSTRINGS", isCompound: false },
    { key: "slot.calf_raise", category: "LEGS", primaryMuscle: "CALVES", isCompound: false },
    { key: "slot.core_abs", category: "CORE", primaryMuscle: "ABS", isCompound: false },
    { key: "slot.leg_extension", category: "LEGS", primaryMuscle: "QUADS", isCompound: false }
  ]
};

const PUSH_DAY: DayTemplate = {
  key: "day.push",
  slots: [
    { key: "slot.horizontal_press_chest", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { key: "slot.overhead_press_shoulders", category: "PUSH", primaryMuscle: "SHOULDERS_SIDE", isCompound: true },
    { key: "slot.incline_press_upper_chest", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { key: "slot.lateral_raise", category: "PUSH", primaryMuscle: "SHOULDERS_SIDE", isCompound: false },
    { key: "slot.triceps_pushdown", category: "PUSH", primaryMuscle: "TRICEPS", isCompound: false },
    { key: "slot.triceps_overhead", category: "PUSH", primaryMuscle: "TRICEPS", isCompound: false }
  ]
};

const PULL_DAY: DayTemplate = {
  key: "day.pull",
  slots: [
    { key: "slot.horizontal_row_upper_back", category: "PULL", primaryMuscle: "UPPER_BACK", isCompound: true },
    { key: "slot.vertical_pull_lats", category: "PULL", primaryMuscle: "LATS", isCompound: true },
    { key: "slot.lat_pulldown", category: "PULL", primaryMuscle: "LATS", isCompound: true },
    { key: "slot.face_pull_rear_delt", category: "PULL", primaryMuscle: "SHOULDERS_REAR", isCompound: false },
    { key: "slot.biceps_isolation", category: "PULL", primaryMuscle: "BICEPS", isCompound: false },
    { key: "slot.hammer_curl", category: "PULL", primaryMuscle: "BICEPS", isCompound: false }
  ]
};

const LEGS_DAY: DayTemplate = LOWER_DAY;

const CHEST_DAY: DayTemplate = {
  key: "day.chest",
  slots: [
    { key: "slot.horizontal_press_chest", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { key: "slot.incline_press_upper_chest", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { key: "slot.chest_fly", category: "PUSH", primaryMuscle: "CHEST", isCompound: false },
    { key: "slot.dips_chest", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { key: "slot.cable_crossover", category: "PUSH", primaryMuscle: "CHEST", isCompound: false },
    { key: "slot.core_abs", category: "CORE", primaryMuscle: "ABS", isCompound: false }
  ]
};

const BACK_DAY: DayTemplate = {
  key: "day.back",
  slots: [
    { key: "slot.deadlift_or_bent_row", category: "PULL", primaryMuscle: "UPPER_BACK", isCompound: true },
    { key: "slot.vertical_pull_lats", category: "PULL", primaryMuscle: "LATS", isCompound: true },
    { key: "slot.horizontal_row_upper_back", category: "PULL", primaryMuscle: "UPPER_BACK", isCompound: true },
    { key: "slot.lat_pulldown", category: "PULL", primaryMuscle: "LATS", isCompound: false },
    { key: "slot.shrugs", category: "PULL", primaryMuscle: "UPPER_BACK", isCompound: false },
    { key: "slot.face_pull_rear_delt", category: "PULL", primaryMuscle: "SHOULDERS_REAR", isCompound: false }
  ]
};

const SHOULDERS_DAY: DayTemplate = {
  key: "day.shoulders",
  slots: [
    { key: "slot.overhead_press_shoulders", category: "PUSH", primaryMuscle: "SHOULDERS_SIDE", isCompound: true },
    { key: "slot.lateral_raise", category: "PUSH", primaryMuscle: "SHOULDERS_SIDE", isCompound: false },
    { key: "slot.front_raise", category: "PUSH", primaryMuscle: "SHOULDERS_FRONT", isCompound: false },
    { key: "slot.rear_delt", category: "PULL", primaryMuscle: "SHOULDERS_REAR", isCompound: false },
    { key: "slot.upright_row", category: "PULL", primaryMuscle: "SHOULDERS_SIDE", isCompound: true },
    { key: "slot.shrugs", category: "PULL", primaryMuscle: "UPPER_BACK", isCompound: false }
  ]
};

const ARMS_DAY: DayTemplate = {
  key: "day.arms",
  slots: [
    { key: "slot.barbell_curl", category: "PULL", primaryMuscle: "BICEPS", isCompound: false },
    { key: "slot.hammer_curl", category: "PULL", primaryMuscle: "BICEPS", isCompound: false },
    { key: "slot.incline_curl", category: "PULL", primaryMuscle: "BICEPS", isCompound: false },
    { key: "slot.dips_triceps", category: "PUSH", primaryMuscle: "TRICEPS", isCompound: true },
    { key: "slot.triceps_overhead", category: "PUSH", primaryMuscle: "TRICEPS", isCompound: false },
    { key: "slot.triceps_pushdown", category: "PUSH", primaryMuscle: "TRICEPS", isCompound: false }
  ]
};

export function getDayTemplates(structure: TrainingStructure): DayTemplate[] {
  switch (structure) {
    case "FULL_BODY":
      return [FULL_BODY_DAY];
    case "UPPER_LOWER":
      return [UPPER_DAY, LOWER_DAY];
    case "PUSH_PULL_LEGS":
      return [PUSH_DAY, PULL_DAY, LEGS_DAY];
    case "SPLIT":
      return [CHEST_DAY, BACK_DAY, SHOULDERS_DAY, LEGS_DAY, ARMS_DAY];
  }
}
