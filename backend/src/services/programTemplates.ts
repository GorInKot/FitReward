import { MovementCategory, MuscleGroup, TrainingStructure } from "../prismaEnums";

export interface Slot {
  /** Human-readable slot name shown to the user (Russian). */
  name: string;
  /** Movement category we want from the catalog. */
  category: MovementCategory;
  /** Preferred primary muscle group. Slot is satisfied if exercise has this in primaryMuscles. */
  primaryMuscle?: MuscleGroup;
  /** Whether this slot should be a compound (affects sets/reps). */
  isCompound: boolean;
}

/**
 * Templates for each TrainingStructure.
 * Slots are listed in PRIORITY ORDER — the generator trims to the user's
 * desired exercise count starting from the top.
 */
export interface DayTemplate {
  name: string;
  slots: Slot[];
}

const FULL_BODY_DAY: DayTemplate = {
  name: "Full-body",
  slots: [
    { name: "Жим (грудь)", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { name: "Тяга (спина)", category: "PULL", primaryMuscle: "LATS", isCompound: true },
    { name: "Присед (квадрицепс)", category: "LEGS", primaryMuscle: "QUADS", isCompound: true },
    { name: "Тяга бёдрами (заднее бедро)", category: "LEGS", primaryMuscle: "HAMSTRINGS", isCompound: true },
    { name: "Корпус", category: "CORE", primaryMuscle: "ABS", isCompound: false },
    { name: "Жим над головой (плечи)", category: "PUSH", primaryMuscle: "SHOULDERS_SIDE", isCompound: true },
    { name: "Подтягивания/тяга сверху (широчайшие)", category: "PULL", primaryMuscle: "LATS", isCompound: true },
    { name: "Бицепс/трицепс", category: "PULL", primaryMuscle: "BICEPS", isCompound: false }
  ]
};

const UPPER_DAY: DayTemplate = {
  name: "Верх тела",
  slots: [
    { name: "Жим (грудь)", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { name: "Тяга (верх спины)", category: "PULL", primaryMuscle: "UPPER_BACK", isCompound: true },
    { name: "Жим над головой (плечи)", category: "PUSH", primaryMuscle: "SHOULDERS_SIDE", isCompound: true },
    { name: "Подтягивания/тяга сверху (широчайшие)", category: "PULL", primaryMuscle: "LATS", isCompound: true },
    { name: "Бицепс", category: "PULL", primaryMuscle: "BICEPS", isCompound: false },
    { name: "Трицепс", category: "PUSH", primaryMuscle: "TRICEPS", isCompound: false },
    { name: "Задняя дельта", category: "PULL", primaryMuscle: "SHOULDERS_REAR", isCompound: false }
  ]
};

const LOWER_DAY: DayTemplate = {
  name: "Низ тела",
  slots: [
    { name: "Присед (квадрицепс)", category: "LEGS", primaryMuscle: "QUADS", isCompound: true },
    { name: "Тяга бёдрами (заднее бедро)", category: "LEGS", primaryMuscle: "HAMSTRINGS", isCompound: true },
    { name: "Выпады (ягодицы)", category: "LEGS", primaryMuscle: "GLUTES", isCompound: true },
    { name: "Сгибание/разгибание ног", category: "LEGS", primaryMuscle: "HAMSTRINGS", isCompound: false },
    { name: "Икры", category: "LEGS", primaryMuscle: "CALVES", isCompound: false },
    { name: "Корпус", category: "CORE", primaryMuscle: "ABS", isCompound: false },
    { name: "Разгибание ног", category: "LEGS", primaryMuscle: "QUADS", isCompound: false }
  ]
};

const PUSH_DAY: DayTemplate = {
  name: "Push (грудь/плечи/трицепс)",
  slots: [
    { name: "Жим горизонтальный (грудь)", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { name: "Жим над головой (плечи)", category: "PUSH", primaryMuscle: "SHOULDERS_SIDE", isCompound: true },
    { name: "Жим наклонный (верх груди)", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { name: "Махи в стороны (средняя дельта)", category: "PUSH", primaryMuscle: "SHOULDERS_SIDE", isCompound: false },
    { name: "Разгибание на трицепс", category: "PUSH", primaryMuscle: "TRICEPS", isCompound: false },
    { name: "Французский жим", category: "PUSH", primaryMuscle: "TRICEPS", isCompound: false }
  ]
};

const PULL_DAY: DayTemplate = {
  name: "Pull (спина/бицепс)",
  slots: [
    { name: "Тяга горизонтальная (верх спины)", category: "PULL", primaryMuscle: "UPPER_BACK", isCompound: true },
    { name: "Подтягивания/тяга сверху (широчайшие)", category: "PULL", primaryMuscle: "LATS", isCompound: true },
    { name: "Тяга на низ (широчайшие)", category: "PULL", primaryMuscle: "LATS", isCompound: true },
    { name: "Задняя дельта/тяга к лицу", category: "PULL", primaryMuscle: "SHOULDERS_REAR", isCompound: false },
    { name: "Сгибание на бицепс", category: "PULL", primaryMuscle: "BICEPS", isCompound: false },
    { name: "Молотки на бицепс", category: "PULL", primaryMuscle: "BICEPS", isCompound: false }
  ]
};

const LEGS_DAY: DayTemplate = LOWER_DAY;

const CHEST_DAY: DayTemplate = {
  name: "Грудь",
  slots: [
    { name: "Жим горизонтальный", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { name: "Жим наклонный", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { name: "Разводка / fly", category: "PUSH", primaryMuscle: "CHEST", isCompound: false },
    { name: "Отжимания на брусьях", category: "PUSH", primaryMuscle: "CHEST", isCompound: true },
    { name: "Изоляция груди (кроссовер)", category: "PUSH", primaryMuscle: "CHEST", isCompound: false },
    { name: "Корпус", category: "CORE", primaryMuscle: "ABS", isCompound: false }
  ]
};

const BACK_DAY: DayTemplate = {
  name: "Спина",
  slots: [
    { name: "Становая тяга / тяга в наклоне", category: "PULL", primaryMuscle: "UPPER_BACK", isCompound: true },
    { name: "Подтягивания/тяга сверху", category: "PULL", primaryMuscle: "LATS", isCompound: true },
    { name: "Тяга горизонтальная", category: "PULL", primaryMuscle: "UPPER_BACK", isCompound: true },
    { name: "Тяга на низ", category: "PULL", primaryMuscle: "LATS", isCompound: false },
    { name: "Шраги", category: "PULL", primaryMuscle: "UPPER_BACK", isCompound: false },
    { name: "Тяга к лицу", category: "PULL", primaryMuscle: "SHOULDERS_REAR", isCompound: false }
  ]
};

const SHOULDERS_DAY: DayTemplate = {
  name: "Плечи",
  slots: [
    { name: "Жим над головой", category: "PUSH", primaryMuscle: "SHOULDERS_SIDE", isCompound: true },
    { name: "Махи в стороны", category: "PUSH", primaryMuscle: "SHOULDERS_SIDE", isCompound: false },
    { name: "Махи перед собой", category: "PUSH", primaryMuscle: "SHOULDERS_FRONT", isCompound: false },
    { name: "Задняя дельта", category: "PULL", primaryMuscle: "SHOULDERS_REAR", isCompound: false },
    { name: "Тяга к подбородку / вертикальная тяга", category: "PULL", primaryMuscle: "SHOULDERS_SIDE", isCompound: true },
    { name: "Шраги", category: "PULL", primaryMuscle: "UPPER_BACK", isCompound: false }
  ]
};

const ARMS_DAY: DayTemplate = {
  name: "Руки",
  slots: [
    { name: "Сгибание на бицепс (штанга)", category: "PULL", primaryMuscle: "BICEPS", isCompound: false },
    { name: "Молотки на бицепс", category: "PULL", primaryMuscle: "BICEPS", isCompound: false },
    { name: "Бицепс на наклонной", category: "PULL", primaryMuscle: "BICEPS", isCompound: false },
    { name: "Брусья / трицепс", category: "PUSH", primaryMuscle: "TRICEPS", isCompound: true },
    { name: "Разгибание на трицепс из-за головы", category: "PUSH", primaryMuscle: "TRICEPS", isCompound: false },
    { name: "Трицепс на блоке", category: "PUSH", primaryMuscle: "TRICEPS", isCompound: false }
  ]
};

/**
 * Returns the day templates that should rotate for a given training structure.
 * The generator cycles through this array to produce trainingDaysPerWeek days.
 */
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
