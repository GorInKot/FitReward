/**
 * Fills ExerciseCatalog.nameRu for rows the wger dataset left untranslated
 * (~70% of the catalog has no Russian name).
 *
 * Run against the production DB:
 *   DATABASE_URL='<neon-url>' npx tsx scripts/translate-exercises.ts
 *
 * Matching is conservative — exact normalized name, then a retry with the
 * leading equipment word stripped. No fuzzy/substring matching, so it never
 * mislabels an exercise. Untranslated names are printed so the dictionary
 * can be extended.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// English (normalized) -> Russian. Keys are lowercase, punctuation-stripped.
const RU: Record<string, string> = {
  "bench press": "Жим лёжа",
  "incline bench press": "Жим лёжа на наклонной скамье",
  "decline bench press": "Жим лёжа на наклонной скамье вниз",
  "close grip bench press": "Жим лёжа узким хватом",
  "squat": "Приседания",
  "front squat": "Фронтальные приседания",
  "goblet squat": "Гоблет-приседания",
  "bulgarian split squat": "Болгарские выпады",
  "split squat": "Сплит-приседания",
  "hack squat": "Гакк-приседания",
  "deadlift": "Становая тяга",
  "romanian deadlift": "Румынская становая тяга",
  "sumo deadlift": "Становая тяга сумо",
  "stiff leg deadlift": "Становая тяга на прямых ногах",
  "overhead press": "Жим над головой",
  "military press": "Армейский жим",
  "shoulder press": "Жим на плечи",
  "arnold press": "Жим Арнольда",
  "push press": "Швунг жимовой",
  "bicep curl": "Подъём на бицепс",
  "curl": "Подъём на бицепс",
  "hammer curl": "Молотковые сгибания",
  "preacher curl": "Сгибания на скамье Скотта",
  "concentration curl": "Концентрированный подъём на бицепс",
  "incline curl": "Подъём на бицепс на наклонной скамье",
  "tricep extension": "Разгибание на трицепс",
  "triceps extension": "Разгибание на трицепс",
  "overhead triceps extension": "Разгибание на трицепс из-за головы",
  "tricep pushdown": "Разгибание на трицепс на блоке",
  "triceps pushdown": "Разгибание на трицепс на блоке",
  "skullcrusher": "Французский жим",
  "skull crusher": "Французский жим",
  "pull up": "Подтягивания",
  "pull ups": "Подтягивания",
  "pullup": "Подтягивания",
  "pullups": "Подтягивания",
  "chin up": "Подтягивания обратным хватом",
  "chin ups": "Подтягивания обратным хватом",
  "lat pulldown": "Тяга верхнего блока",
  "pulldown": "Тяга верхнего блока",
  "bent over row": "Тяга в наклоне",
  "row": "Тяга",
  "seated row": "Тяга сидя",
  "seated cable row": "Тяга нижнего блока сидя",
  "t bar row": "Тяга Т-грифа",
  "inverted row": "Австралийские подтягивания",
  "lateral raise": "Махи в стороны",
  "lateral raises": "Махи в стороны",
  "front raise": "Махи перед собой",
  "front raises": "Махи перед собой",
  "rear delt fly": "Разведение на заднюю дельту",
  "reverse fly": "Обратные разведения",
  "face pull": "Тяга к лицу",
  "shrug": "Шраги",
  "shrugs": "Шраги",
  "upright row": "Тяга к подбородку",
  "leg press": "Жим ногами",
  "leg extension": "Разгибание ног",
  "leg extensions": "Разгибание ног",
  "leg curl": "Сгибание ног",
  "leg curls": "Сгибание ног",
  "lunge": "Выпады",
  "lunges": "Выпады",
  "walking lunge": "Выпады в ходьбе",
  "calf raise": "Подъёмы на носки",
  "calf raises": "Подъёмы на носки",
  "standing calf raise": "Подъёмы на носки стоя",
  "seated calf raise": "Подъёмы на носки сидя",
  "plank": "Планка",
  "side plank": "Боковая планка",
  "crunch": "Скручивания",
  "crunches": "Скручивания",
  "sit up": "Подъёмы туловища",
  "sit ups": "Подъёмы туловища",
  "situp": "Подъёмы туловища",
  "situps": "Подъёмы туловища",
  "hanging leg raise": "Подъём ног в висе",
  "leg raise": "Подъём ног",
  "leg raises": "Подъём ног",
  "russian twist": "Русский твист",
  "mountain climber": "Скалолаз",
  "mountain climbers": "Скалолаз",
  "push up": "Отжимания",
  "push ups": "Отжимания",
  "pushup": "Отжимания",
  "pushups": "Отжимания",
  "dip": "Отжимания на брусьях",
  "dips": "Отжимания на брусьях",
  "hip thrust": "Ягодичный мостик со штангой",
  "glute bridge": "Ягодичный мостик",
  "chest fly": "Разведение рук лёжа",
  "fly": "Разведение рук",
  "flyes": "Разведение рук",
  "chest flyes": "Разведение рук лёжа",
  "cable crossover": "Сведение рук в кроссовере",
  "pec deck": "Сведение рук в тренажёре",
  "pullover": "Пуловер",
  "pull over": "Пуловер",
  "good morning": "Наклоны со штангой на плечах",
  "burpee": "Бёрпи",
  "burpees": "Бёрпи",
  "jumping jack": "Прыжки «звёздочка»",
  "jumping jacks": "Прыжки «звёздочка»",
  "wrist curl": "Сгибание запястий",
  "kettlebell swing": "Махи гирей",
  "thruster": "Трастеры",
  "step up": "Зашагивания на платформу",
  "step ups": "Зашагивания на платформу",
  "back extension": "Гиперэкстензия",
  "hyperextension": "Гиперэкстензия"
};

// Equipment / qualifier words we strip when an exact match fails.
const PREFIXES = [
  "barbell",
  "dumbbell",
  "cable",
  "machine",
  "kettlebell",
  "smith machine",
  "ez bar",
  "ez-bar",
  "resistance band",
  "banded",
  "weighted",
  "bodyweight"
];

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lookup(nameEn: string): string | null {
  const norm = normalize(nameEn);
  if (RU[norm]) return RU[norm];

  // Retry with a leading equipment word removed.
  for (const prefix of PREFIXES) {
    if (norm.startsWith(prefix + " ")) {
      const stripped = norm.slice(prefix.length + 1);
      if (RU[stripped]) return RU[stripped];
    }
  }
  // Retry with a trailing equipment word removed ("squat barbell").
  for (const prefix of PREFIXES) {
    if (norm.endsWith(" " + prefix)) {
      const stripped = norm.slice(0, norm.length - prefix.length - 1);
      if (RU[stripped]) return RU[stripped];
    }
  }
  return null;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }
  console.log("=== FitReward exercise translator ===");

  const untranslated = await prisma.exerciseCatalog.findMany({
    where: { nameRu: null },
    select: { id: true, nameEn: true }
  });
  console.log(`Rows without nameRu: ${untranslated.length}`);

  let updated = 0;
  const misses: string[] = [];
  for (const row of untranslated) {
    const ru = lookup(row.nameEn);
    if (ru) {
      await prisma.exerciseCatalog.update({
        where: { id: row.id },
        data: { nameRu: ru }
      });
      updated += 1;
    } else {
      misses.push(row.nameEn);
    }
  }

  console.log(`Translated: ${updated}`);
  console.log(`Still untranslated: ${misses.length}`);
  if (misses.length > 0) {
    console.log("--- untranslated names (extend the dictionary for these) ---");
    misses.slice(0, 80).forEach((n) => console.log(`  ${n}`));
    if (misses.length > 80) console.log(`  ...and ${misses.length - 80} more`);
  }
  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
