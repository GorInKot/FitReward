import { Difficulty, Equipment, MovementCategory, MuscleGroup } from "../prismaEnums";

export interface CuratedExercise {
  slug: string;
  nameEn: string;
  nameRu: string;
  category: MovementCategory;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment[];
  difficulty: Difficulty;
}

/**
 * Hand-curated, fully bilingual exercise catalog. Replaces the noisy wger
 * dataset as the source the program generator picks from (source = "curated").
 * Covers every (category, primaryMuscle) slot used by programTemplates.ts
 * across gym / home / minimal / bodyweight environments.
 */
export const CURATED_EXERCISES: CuratedExercise[] = [
  // ---- PUSH · Chest ----
  {
    slug: "barbell-bench-press",
    nameEn: "Barbell Bench Press",
    nameRu: "Жим штанги лёжа",
    category: "PUSH",
    primaryMuscles: ["CHEST"],
    secondaryMuscles: ["TRICEPS", "SHOULDERS_FRONT"],
    equipment: ["BARBELL", "BENCH"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "incline-barbell-bench-press",
    nameEn: "Incline Barbell Bench Press",
    nameRu: "Жим штанги на наклонной скамье",
    category: "PUSH",
    primaryMuscles: ["CHEST"],
    secondaryMuscles: ["SHOULDERS_FRONT", "TRICEPS"],
    equipment: ["BARBELL", "BENCH"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "dumbbell-bench-press",
    nameEn: "Dumbbell Bench Press",
    nameRu: "Жим гантелей лёжа",
    category: "PUSH",
    primaryMuscles: ["CHEST"],
    secondaryMuscles: ["TRICEPS", "SHOULDERS_FRONT"],
    equipment: ["DUMBBELL", "BENCH"],
    difficulty: "BEGINNER"
  },
  {
    slug: "incline-dumbbell-bench-press",
    nameEn: "Incline Dumbbell Bench Press",
    nameRu: "Жим гантелей на наклонной скамье",
    category: "PUSH",
    primaryMuscles: ["CHEST"],
    secondaryMuscles: ["SHOULDERS_FRONT", "TRICEPS"],
    equipment: ["DUMBBELL", "BENCH"],
    difficulty: "BEGINNER"
  },
  {
    slug: "machine-chest-press",
    nameEn: "Machine Chest Press",
    nameRu: "Жим в тренажёре на грудь",
    category: "PUSH",
    primaryMuscles: ["CHEST"],
    secondaryMuscles: ["TRICEPS"],
    equipment: ["MACHINE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "push-up",
    nameEn: "Push-Up",
    nameRu: "Отжимания от пола",
    category: "PUSH",
    primaryMuscles: ["CHEST"],
    secondaryMuscles: ["TRICEPS", "SHOULDERS_FRONT"],
    equipment: ["BODYWEIGHT"],
    difficulty: "BEGINNER"
  },
  {
    slug: "chest-dip",
    nameEn: "Chest Dip",
    nameRu: "Отжимания на брусьях (грудь)",
    category: "PUSH",
    primaryMuscles: ["CHEST"],
    secondaryMuscles: ["TRICEPS", "SHOULDERS_FRONT"],
    equipment: ["BODYWEIGHT"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "cable-crossover",
    nameEn: "Cable Crossover",
    nameRu: "Сведение рук в кроссовере",
    category: "PUSH",
    primaryMuscles: ["CHEST"],
    secondaryMuscles: [],
    equipment: ["CABLE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "dumbbell-fly",
    nameEn: "Dumbbell Fly",
    nameRu: "Разведение гантелей лёжа",
    category: "PUSH",
    primaryMuscles: ["CHEST"],
    secondaryMuscles: [],
    equipment: ["DUMBBELL", "BENCH"],
    difficulty: "BEGINNER"
  },
  {
    slug: "pec-deck",
    nameEn: "Pec Deck Machine",
    nameRu: "Сведение рук в тренажёре",
    category: "PUSH",
    primaryMuscles: ["CHEST"],
    secondaryMuscles: [],
    equipment: ["MACHINE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "resistance-band-chest-press",
    nameEn: "Resistance Band Chest Press",
    nameRu: "Жим с резиновой лентой",
    category: "PUSH",
    primaryMuscles: ["CHEST"],
    secondaryMuscles: ["TRICEPS"],
    equipment: ["RESISTANCE_BAND"],
    difficulty: "BEGINNER"
  },

  // ---- PUSH · Shoulders ----
  {
    slug: "barbell-overhead-press",
    nameEn: "Barbell Overhead Press",
    nameRu: "Жим штанги стоя",
    category: "PUSH",
    primaryMuscles: ["SHOULDERS_FRONT", "SHOULDERS_SIDE"],
    secondaryMuscles: ["TRICEPS"],
    equipment: ["BARBELL"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "dumbbell-shoulder-press",
    nameEn: "Dumbbell Shoulder Press",
    nameRu: "Жим гантелей сидя",
    category: "PUSH",
    primaryMuscles: ["SHOULDERS_FRONT", "SHOULDERS_SIDE"],
    secondaryMuscles: ["TRICEPS"],
    equipment: ["DUMBBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "arnold-press",
    nameEn: "Arnold Press",
    nameRu: "Жим Арнольда",
    category: "PUSH",
    primaryMuscles: ["SHOULDERS_FRONT", "SHOULDERS_SIDE"],
    secondaryMuscles: ["TRICEPS"],
    equipment: ["DUMBBELL"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "machine-shoulder-press",
    nameEn: "Machine Shoulder Press",
    nameRu: "Жим в тренажёре на плечи",
    category: "PUSH",
    primaryMuscles: ["SHOULDERS_FRONT", "SHOULDERS_SIDE"],
    secondaryMuscles: ["TRICEPS"],
    equipment: ["MACHINE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "pike-push-up",
    nameEn: "Pike Push-Up",
    nameRu: "Отжимания «уголок»",
    category: "PUSH",
    primaryMuscles: ["SHOULDERS_FRONT", "SHOULDERS_SIDE"],
    secondaryMuscles: ["TRICEPS"],
    equipment: ["BODYWEIGHT"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "dumbbell-lateral-raise",
    nameEn: "Dumbbell Lateral Raise",
    nameRu: "Махи гантелями в стороны",
    category: "PUSH",
    primaryMuscles: ["SHOULDERS_SIDE"],
    secondaryMuscles: [],
    equipment: ["DUMBBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "cable-lateral-raise",
    nameEn: "Cable Lateral Raise",
    nameRu: "Махи в стороны на блоке",
    category: "PUSH",
    primaryMuscles: ["SHOULDERS_SIDE"],
    secondaryMuscles: [],
    equipment: ["CABLE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "band-lateral-raise",
    nameEn: "Resistance Band Lateral Raise",
    nameRu: "Махи в стороны с лентой",
    category: "PUSH",
    primaryMuscles: ["SHOULDERS_SIDE"],
    secondaryMuscles: [],
    equipment: ["RESISTANCE_BAND"],
    difficulty: "BEGINNER"
  },
  {
    slug: "dumbbell-front-raise",
    nameEn: "Dumbbell Front Raise",
    nameRu: "Махи гантелями перед собой",
    category: "PUSH",
    primaryMuscles: ["SHOULDERS_FRONT"],
    secondaryMuscles: [],
    equipment: ["DUMBBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "plate-front-raise",
    nameEn: "Plate Front Raise",
    nameRu: "Подъём блина перед собой",
    category: "PUSH",
    primaryMuscles: ["SHOULDERS_FRONT"],
    secondaryMuscles: [],
    equipment: ["OTHER"],
    difficulty: "BEGINNER"
  },

  // ---- PUSH · Triceps ----
  {
    slug: "cable-triceps-pushdown",
    nameEn: "Cable Triceps Pushdown",
    nameRu: "Разгибание на трицепс на блоке",
    category: "PUSH",
    primaryMuscles: ["TRICEPS"],
    secondaryMuscles: [],
    equipment: ["CABLE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "overhead-dumbbell-triceps-extension",
    nameEn: "Overhead Dumbbell Triceps Extension",
    nameRu: "Разгибание гантели из-за головы",
    category: "PUSH",
    primaryMuscles: ["TRICEPS"],
    secondaryMuscles: [],
    equipment: ["DUMBBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "lying-barbell-triceps-extension",
    nameEn: "Lying Barbell Triceps Extension",
    nameRu: "Французский жим лёжа",
    category: "PUSH",
    primaryMuscles: ["TRICEPS"],
    secondaryMuscles: [],
    equipment: ["BARBELL", "BENCH"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "close-grip-bench-press",
    nameEn: "Close-Grip Bench Press",
    nameRu: "Жим лёжа узким хватом",
    category: "PUSH",
    primaryMuscles: ["TRICEPS"],
    secondaryMuscles: ["CHEST"],
    equipment: ["BARBELL", "BENCH"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "bench-dip",
    nameEn: "Bench Dip",
    nameRu: "Отжимания от скамьи на трицепс",
    category: "PUSH",
    primaryMuscles: ["TRICEPS"],
    secondaryMuscles: ["CHEST"],
    equipment: ["BODYWEIGHT"],
    difficulty: "BEGINNER"
  },
  {
    slug: "triceps-dip",
    nameEn: "Triceps Dip",
    nameRu: "Отжимания на брусьях (трицепс)",
    category: "PUSH",
    primaryMuscles: ["TRICEPS"],
    secondaryMuscles: ["CHEST"],
    equipment: ["BODYWEIGHT"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "diamond-push-up",
    nameEn: "Diamond Push-Up",
    nameRu: "Отжимания узким хватом",
    category: "PUSH",
    primaryMuscles: ["TRICEPS"],
    secondaryMuscles: ["CHEST"],
    equipment: ["BODYWEIGHT"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "band-triceps-pushdown",
    nameEn: "Resistance Band Triceps Pushdown",
    nameRu: "Разгибание на трицепс с лентой",
    category: "PUSH",
    primaryMuscles: ["TRICEPS"],
    secondaryMuscles: [],
    equipment: ["RESISTANCE_BAND"],
    difficulty: "BEGINNER"
  },

  // ---- PULL · Lats / vertical ----
  {
    slug: "pull-up",
    nameEn: "Pull-Up",
    nameRu: "Подтягивания",
    category: "PULL",
    primaryMuscles: ["LATS"],
    secondaryMuscles: ["BICEPS", "UPPER_BACK"],
    equipment: ["PULL_UP_BAR"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "chin-up",
    nameEn: "Chin-Up",
    nameRu: "Подтягивания обратным хватом",
    category: "PULL",
    primaryMuscles: ["LATS"],
    secondaryMuscles: ["BICEPS"],
    equipment: ["PULL_UP_BAR"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "lat-pulldown",
    nameEn: "Lat Pulldown",
    nameRu: "Тяга верхнего блока",
    category: "PULL",
    primaryMuscles: ["LATS"],
    secondaryMuscles: ["BICEPS", "UPPER_BACK"],
    equipment: ["CABLE", "MACHINE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "band-lat-pulldown",
    nameEn: "Resistance Band Pulldown",
    nameRu: "Тяга сверху с лентой",
    category: "PULL",
    primaryMuscles: ["LATS"],
    secondaryMuscles: ["BICEPS"],
    equipment: ["RESISTANCE_BAND"],
    difficulty: "BEGINNER"
  },
  {
    slug: "straight-arm-pulldown",
    nameEn: "Straight-Arm Pulldown",
    nameRu: "Тяга прямыми руками на блоке",
    category: "PULL",
    primaryMuscles: ["LATS"],
    secondaryMuscles: [],
    equipment: ["CABLE"],
    difficulty: "BEGINNER"
  },

  // ---- PULL · Upper back / rows ----
  {
    slug: "barbell-bent-over-row",
    nameEn: "Barbell Bent-Over Row",
    nameRu: "Тяга штанги в наклоне",
    category: "PULL",
    primaryMuscles: ["UPPER_BACK", "LATS"],
    secondaryMuscles: ["BICEPS", "LOWER_BACK"],
    equipment: ["BARBELL"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "dumbbell-row",
    nameEn: "Dumbbell Row",
    nameRu: "Тяга гантели в наклоне",
    category: "PULL",
    primaryMuscles: ["UPPER_BACK", "LATS"],
    secondaryMuscles: ["BICEPS"],
    equipment: ["DUMBBELL", "BENCH"],
    difficulty: "BEGINNER"
  },
  {
    slug: "seated-cable-row",
    nameEn: "Seated Cable Row",
    nameRu: "Тяга нижнего блока сидя",
    category: "PULL",
    primaryMuscles: ["UPPER_BACK", "LATS"],
    secondaryMuscles: ["BICEPS"],
    equipment: ["CABLE", "MACHINE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "t-bar-row",
    nameEn: "T-Bar Row",
    nameRu: "Тяга Т-грифа",
    category: "PULL",
    primaryMuscles: ["UPPER_BACK", "LATS"],
    secondaryMuscles: ["BICEPS"],
    equipment: ["BARBELL", "MACHINE"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "inverted-row",
    nameEn: "Inverted Row",
    nameRu: "Австралийские подтягивания",
    category: "PULL",
    primaryMuscles: ["UPPER_BACK", "LATS"],
    secondaryMuscles: ["BICEPS"],
    equipment: ["BODYWEIGHT", "PULL_UP_BAR"],
    difficulty: "BEGINNER"
  },
  {
    slug: "band-seated-row",
    nameEn: "Resistance Band Seated Row",
    nameRu: "Тяга сидя с лентой",
    category: "PULL",
    primaryMuscles: ["UPPER_BACK"],
    secondaryMuscles: ["BICEPS"],
    equipment: ["RESISTANCE_BAND"],
    difficulty: "BEGINNER"
  },
  {
    slug: "barbell-shrug",
    nameEn: "Barbell Shrug",
    nameRu: "Шраги со штангой",
    category: "PULL",
    primaryMuscles: ["UPPER_BACK"],
    secondaryMuscles: ["FOREARMS"],
    equipment: ["BARBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "dumbbell-shrug",
    nameEn: "Dumbbell Shrug",
    nameRu: "Шраги с гантелями",
    category: "PULL",
    primaryMuscles: ["UPPER_BACK"],
    secondaryMuscles: ["FOREARMS"],
    equipment: ["DUMBBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "conventional-deadlift",
    nameEn: "Conventional Deadlift",
    nameRu: "Становая тяга",
    category: "PULL",
    primaryMuscles: ["UPPER_BACK", "LOWER_BACK"],
    secondaryMuscles: ["HAMSTRINGS", "GLUTES"],
    equipment: ["BARBELL"],
    difficulty: "ADVANCED"
  },

  // ---- PULL · Rear delts ----
  {
    slug: "dumbbell-rear-delt-fly",
    nameEn: "Dumbbell Rear Delt Fly",
    nameRu: "Разведение гантелей на заднюю дельту",
    category: "PULL",
    primaryMuscles: ["SHOULDERS_REAR"],
    secondaryMuscles: ["UPPER_BACK"],
    equipment: ["DUMBBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "cable-face-pull",
    nameEn: "Cable Face Pull",
    nameRu: "Тяга к лицу на блоке",
    category: "PULL",
    primaryMuscles: ["SHOULDERS_REAR"],
    secondaryMuscles: ["UPPER_BACK"],
    equipment: ["CABLE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "reverse-pec-deck",
    nameEn: "Reverse Pec Deck",
    nameRu: "Обратное сведение в тренажёре",
    category: "PULL",
    primaryMuscles: ["SHOULDERS_REAR"],
    secondaryMuscles: ["UPPER_BACK"],
    equipment: ["MACHINE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "band-face-pull",
    nameEn: "Resistance Band Face Pull",
    nameRu: "Тяга к лицу с лентой",
    category: "PULL",
    primaryMuscles: ["SHOULDERS_REAR"],
    secondaryMuscles: ["UPPER_BACK"],
    equipment: ["RESISTANCE_BAND"],
    difficulty: "BEGINNER"
  },

  // ---- PULL · Shoulders side (upright row) ----
  {
    slug: "barbell-upright-row",
    nameEn: "Barbell Upright Row",
    nameRu: "Тяга штанги к подбородку",
    category: "PULL",
    primaryMuscles: ["SHOULDERS_SIDE"],
    secondaryMuscles: ["UPPER_BACK", "BICEPS"],
    equipment: ["BARBELL"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "dumbbell-upright-row",
    nameEn: "Dumbbell Upright Row",
    nameRu: "Тяга гантелей к подбородку",
    category: "PULL",
    primaryMuscles: ["SHOULDERS_SIDE"],
    secondaryMuscles: ["UPPER_BACK"],
    equipment: ["DUMBBELL"],
    difficulty: "BEGINNER"
  },

  // ---- PULL · Biceps ----
  {
    slug: "barbell-curl",
    nameEn: "Barbell Curl",
    nameRu: "Подъём штанги на бицепс",
    category: "PULL",
    primaryMuscles: ["BICEPS"],
    secondaryMuscles: ["FOREARMS"],
    equipment: ["BARBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "dumbbell-curl",
    nameEn: "Dumbbell Curl",
    nameRu: "Подъём гантелей на бицепс",
    category: "PULL",
    primaryMuscles: ["BICEPS"],
    secondaryMuscles: ["FOREARMS"],
    equipment: ["DUMBBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "hammer-curl",
    nameEn: "Hammer Curl",
    nameRu: "Молотковые сгибания",
    category: "PULL",
    primaryMuscles: ["BICEPS"],
    secondaryMuscles: ["FOREARMS"],
    equipment: ["DUMBBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "incline-dumbbell-curl",
    nameEn: "Incline Dumbbell Curl",
    nameRu: "Подъём гантелей на наклонной скамье",
    category: "PULL",
    primaryMuscles: ["BICEPS"],
    secondaryMuscles: [],
    equipment: ["DUMBBELL", "BENCH"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "cable-curl",
    nameEn: "Cable Curl",
    nameRu: "Сгибание на бицепс на блоке",
    category: "PULL",
    primaryMuscles: ["BICEPS"],
    secondaryMuscles: [],
    equipment: ["CABLE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "band-curl",
    nameEn: "Resistance Band Curl",
    nameRu: "Сгибание на бицепс с лентой",
    category: "PULL",
    primaryMuscles: ["BICEPS"],
    secondaryMuscles: [],
    equipment: ["RESISTANCE_BAND"],
    difficulty: "BEGINNER"
  },

  // ---- LEGS · Quads ----
  {
    slug: "barbell-back-squat",
    nameEn: "Barbell Back Squat",
    nameRu: "Приседания со штангой",
    category: "LEGS",
    primaryMuscles: ["QUADS"],
    secondaryMuscles: ["GLUTES", "HAMSTRINGS"],
    equipment: ["BARBELL"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "barbell-front-squat",
    nameEn: "Barbell Front Squat",
    nameRu: "Фронтальные приседания",
    category: "LEGS",
    primaryMuscles: ["QUADS"],
    secondaryMuscles: ["GLUTES"],
    equipment: ["BARBELL"],
    difficulty: "ADVANCED"
  },
  {
    slug: "goblet-squat",
    nameEn: "Goblet Squat",
    nameRu: "Гоблет-приседания",
    category: "LEGS",
    primaryMuscles: ["QUADS"],
    secondaryMuscles: ["GLUTES"],
    equipment: ["DUMBBELL", "KETTLEBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "leg-press",
    nameEn: "Leg Press",
    nameRu: "Жим ногами",
    category: "LEGS",
    primaryMuscles: ["QUADS"],
    secondaryMuscles: ["GLUTES"],
    equipment: ["MACHINE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "bodyweight-squat",
    nameEn: "Bodyweight Squat",
    nameRu: "Приседания без веса",
    category: "LEGS",
    primaryMuscles: ["QUADS"],
    secondaryMuscles: ["GLUTES"],
    equipment: ["BODYWEIGHT"],
    difficulty: "BEGINNER"
  },
  {
    slug: "leg-extension",
    nameEn: "Leg Extension",
    nameRu: "Разгибание ног в тренажёре",
    category: "LEGS",
    primaryMuscles: ["QUADS"],
    secondaryMuscles: [],
    equipment: ["MACHINE"],
    difficulty: "BEGINNER"
  },

  // ---- LEGS · Hamstrings ----
  {
    slug: "romanian-deadlift",
    nameEn: "Romanian Deadlift",
    nameRu: "Румынская становая тяга",
    category: "LEGS",
    primaryMuscles: ["HAMSTRINGS"],
    secondaryMuscles: ["GLUTES", "LOWER_BACK"],
    equipment: ["BARBELL"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "dumbbell-romanian-deadlift",
    nameEn: "Dumbbell Romanian Deadlift",
    nameRu: "Румынская тяга с гантелями",
    category: "LEGS",
    primaryMuscles: ["HAMSTRINGS"],
    secondaryMuscles: ["GLUTES"],
    equipment: ["DUMBBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "lying-leg-curl",
    nameEn: "Lying Leg Curl",
    nameRu: "Сгибание ног лёжа",
    category: "LEGS",
    primaryMuscles: ["HAMSTRINGS"],
    secondaryMuscles: [],
    equipment: ["MACHINE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "seated-leg-curl",
    nameEn: "Seated Leg Curl",
    nameRu: "Сгибание ног сидя",
    category: "LEGS",
    primaryMuscles: ["HAMSTRINGS"],
    secondaryMuscles: [],
    equipment: ["MACHINE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "nordic-hamstring-curl",
    nameEn: "Nordic Hamstring Curl",
    nameRu: "Нордические сгибания",
    category: "LEGS",
    primaryMuscles: ["HAMSTRINGS"],
    secondaryMuscles: ["GLUTES"],
    equipment: ["BODYWEIGHT"],
    difficulty: "ADVANCED"
  },
  {
    slug: "single-leg-glute-bridge",
    nameEn: "Single-Leg Glute Bridge",
    nameRu: "Ягодичный мостик на одной ноге",
    category: "LEGS",
    primaryMuscles: ["HAMSTRINGS", "GLUTES"],
    secondaryMuscles: [],
    equipment: ["BODYWEIGHT"],
    difficulty: "BEGINNER"
  },

  // ---- LEGS · Glutes ----
  {
    slug: "barbell-hip-thrust",
    nameEn: "Barbell Hip Thrust",
    nameRu: "Ягодичный мостик со штангой",
    category: "LEGS",
    primaryMuscles: ["GLUTES"],
    secondaryMuscles: ["HAMSTRINGS"],
    equipment: ["BARBELL", "BENCH"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "glute-bridge",
    nameEn: "Glute Bridge",
    nameRu: "Ягодичный мостик",
    category: "LEGS",
    primaryMuscles: ["GLUTES"],
    secondaryMuscles: ["HAMSTRINGS"],
    equipment: ["BODYWEIGHT"],
    difficulty: "BEGINNER"
  },
  {
    slug: "bulgarian-split-squat",
    nameEn: "Bulgarian Split Squat",
    nameRu: "Болгарские выпады",
    category: "LEGS",
    primaryMuscles: ["GLUTES", "QUADS"],
    secondaryMuscles: ["HAMSTRINGS"],
    equipment: ["DUMBBELL", "BODYWEIGHT"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "walking-lunge",
    nameEn: "Walking Lunge",
    nameRu: "Выпады в ходьбе",
    category: "LEGS",
    primaryMuscles: ["GLUTES", "QUADS"],
    secondaryMuscles: ["HAMSTRINGS"],
    equipment: ["DUMBBELL", "BODYWEIGHT"],
    difficulty: "BEGINNER"
  },
  {
    slug: "dumbbell-step-up",
    nameEn: "Dumbbell Step-Up",
    nameRu: "Зашагивания на платформу",
    category: "LEGS",
    primaryMuscles: ["GLUTES", "QUADS"],
    secondaryMuscles: [],
    equipment: ["DUMBBELL", "BODYWEIGHT"],
    difficulty: "BEGINNER"
  },

  // ---- LEGS · Calves ----
  {
    slug: "standing-calf-raise",
    nameEn: "Standing Calf Raise",
    nameRu: "Подъёмы на носки стоя",
    category: "LEGS",
    primaryMuscles: ["CALVES"],
    secondaryMuscles: [],
    equipment: ["MACHINE", "DUMBBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "seated-calf-raise",
    nameEn: "Seated Calf Raise",
    nameRu: "Подъёмы на носки сидя",
    category: "LEGS",
    primaryMuscles: ["CALVES"],
    secondaryMuscles: [],
    equipment: ["MACHINE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "bodyweight-calf-raise",
    nameEn: "Bodyweight Calf Raise",
    nameRu: "Подъёмы на носки без веса",
    category: "LEGS",
    primaryMuscles: ["CALVES"],
    secondaryMuscles: [],
    equipment: ["BODYWEIGHT"],
    difficulty: "BEGINNER"
  },

  // ---- CORE · Abs ----
  {
    slug: "plank",
    nameEn: "Plank",
    nameRu: "Планка",
    category: "CORE",
    primaryMuscles: ["ABS"],
    secondaryMuscles: ["OBLIQUES"],
    equipment: ["BODYWEIGHT"],
    difficulty: "BEGINNER"
  },
  {
    slug: "crunch",
    nameEn: "Crunch",
    nameRu: "Скручивания",
    category: "CORE",
    primaryMuscles: ["ABS"],
    secondaryMuscles: [],
    equipment: ["BODYWEIGHT"],
    difficulty: "BEGINNER"
  },
  {
    slug: "hanging-leg-raise",
    nameEn: "Hanging Leg Raise",
    nameRu: "Подъём ног в висе",
    category: "CORE",
    primaryMuscles: ["ABS"],
    secondaryMuscles: ["OBLIQUES"],
    equipment: ["PULL_UP_BAR"],
    difficulty: "INTERMEDIATE"
  },
  {
    slug: "lying-leg-raise",
    nameEn: "Lying Leg Raise",
    nameRu: "Подъём ног лёжа",
    category: "CORE",
    primaryMuscles: ["ABS"],
    secondaryMuscles: [],
    equipment: ["BODYWEIGHT"],
    difficulty: "BEGINNER"
  },
  {
    slug: "cable-crunch",
    nameEn: "Cable Crunch",
    nameRu: "Скручивания на блоке",
    category: "CORE",
    primaryMuscles: ["ABS"],
    secondaryMuscles: [],
    equipment: ["CABLE"],
    difficulty: "BEGINNER"
  },
  {
    slug: "russian-twist",
    nameEn: "Russian Twist",
    nameRu: "Русский твист",
    category: "CORE",
    primaryMuscles: ["OBLIQUES"],
    secondaryMuscles: ["ABS"],
    equipment: ["BODYWEIGHT", "DUMBBELL"],
    difficulty: "BEGINNER"
  },
  {
    slug: "ab-wheel-rollout",
    nameEn: "Ab Wheel Rollout",
    nameRu: "Раскатка ролика для пресса",
    category: "CORE",
    primaryMuscles: ["ABS"],
    secondaryMuscles: ["OBLIQUES"],
    equipment: ["OTHER"],
    difficulty: "ADVANCED"
  },
  {
    slug: "mountain-climber",
    nameEn: "Mountain Climber",
    nameRu: "Скалолаз",
    category: "CORE",
    primaryMuscles: ["ABS"],
    secondaryMuscles: ["OBLIQUES"],
    equipment: ["BODYWEIGHT"],
    difficulty: "BEGINNER"
  }
];
