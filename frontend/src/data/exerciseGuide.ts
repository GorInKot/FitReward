// Bilingual technique guide for the curated exercise catalog, keyed by slug.
// Loaded lazily by ExerciseGuideModal so it never weighs down the initial bundle.

export interface ExerciseGuideContent {
  steps: string[];
  mistakes: string[];
}

export interface ExerciseGuideEntry {
  ru: ExerciseGuideContent;
  en: ExerciseGuideContent;
}

export const EXERCISE_GUIDE: Record<string, ExerciseGuideEntry> = {
  "barbell-bench-press": {
    ru: {
      steps: [
        "Ляг на скамью, лопатки сведены, стопы плотно в пол.",
        "Возьми штангу чуть шире плеч, сними со стоек.",
        "Опусти штангу к середине груди, локти под углом около 45°.",
        "Выжми вверх, не отрывая лопатки и таз от скамьи."
      ],
      mistakes: ["Отрыв таза от скамьи.", "Локти разведены на 90°.", "Отбив штанги от груди."]
    },
    en: {
      steps: [
        "Lie on the bench, shoulder blades retracted, feet flat on the floor.",
        "Grip the bar slightly wider than shoulders and unrack it.",
        "Lower the bar to mid-chest, elbows at about 45°.",
        "Press up without lifting your shoulder blades or hips."
      ],
      mistakes: ["Lifting the hips off the bench.", "Flaring elbows to 90°.", "Bouncing the bar off the chest."]
    }
  },
  "incline-barbell-bench-press": {
    ru: {
      steps: [
        "Выстави скамью на угол 30–45°.",
        "Ляг, сведи лопатки, возьми штангу чуть шире плеч.",
        "Опусти штангу к верху груди под ключицы.",
        "Выжми вверх, контролируя траекторию."
      ],
      mistakes: ["Слишком крутой угол — нагрузка уходит в плечи.", "Опускание штанги на середину груди.", "Подброс таза."]
    },
    en: {
      steps: [
        "Set the bench to a 30–45° incline.",
        "Lie down, retract shoulder blades, grip slightly wider than shoulders.",
        "Lower the bar to the upper chest, just below the collarbones.",
        "Press up under control."
      ],
      mistakes: ["Too steep an angle shifts load to the shoulders.", "Lowering the bar to mid-chest.", "Driving the hips up."]
    }
  },
  "dumbbell-bench-press": {
    ru: {
      steps: [
        "Ляг на скамью, гантели у груди, лопатки сведены.",
        "Выжми гантели вверх до выпрямления рук.",
        "Опусти гантели до уровня груди, чувствуя растяжение.",
        "Держи запястья прямыми, локти под углом 45°."
      ],
      mistakes: ["Стук гантелей вверху.", "Слишком глубокое опускание с потерей контроля.", "Разведённые локти."]
    },
    en: {
      steps: [
        "Lie on the bench with dumbbells at chest level, shoulder blades retracted.",
        "Press the dumbbells up until the arms are straight.",
        "Lower them to chest level, feeling a stretch.",
        "Keep wrists straight and elbows at about 45°."
      ],
      mistakes: ["Clanging the dumbbells together at the top.", "Lowering too far and losing control.", "Flaring the elbows."]
    }
  },
  "incline-dumbbell-bench-press": {
    ru: {
      steps: [
        "Выстави скамью на 30–45°, гантели у верха груди.",
        "Выжми гантели вверх, сводя их над грудью.",
        "Опусти под контролем до растяжения груди.",
        "Держи лопатки сведёнными весь подход."
      ],
      mistakes: ["Слишком крутой угол.", "Заброс гантелей за счёт инерции.", "Прогиб поясницы."]
    },
    en: {
      steps: [
        "Set the bench to 30–45°, dumbbells at upper-chest level.",
        "Press the dumbbells up, bringing them together over the chest.",
        "Lower under control until you feel a chest stretch.",
        "Keep shoulder blades retracted throughout."
      ],
      mistakes: ["Too steep an angle.", "Heaving the dumbbells with momentum.", "Over-arching the lower back."]
    }
  },
  "machine-chest-press": {
    ru: {
      steps: [
        "Настрой сиденье так, чтобы рукояти были на уровне середины груди.",
        "Прижми спину к спинке, лопатки сведены.",
        "Выжми рукояти вперёд до почти полного выпрямления рук.",
        "Вернись под контролем, не бросая вес."
      ],
      mistakes: ["Слишком высокое сиденье — работа плечами.", "Отрыв спины от спинки.", "Полный локаут с переразгибом."]
    },
    en: {
      steps: [
        "Adjust the seat so the handles sit at mid-chest level.",
        "Press your back into the pad, shoulder blades retracted.",
        "Push the handles forward to nearly full arm extension.",
        "Return under control without dropping the weight."
      ],
      mistakes: ["Seat too high turns it into a shoulder press.", "Lifting the back off the pad.", "Hyper-extending at lockout."]
    }
  },
  "push-up": {
    ru: {
      steps: [
        "Упор лёжа, ладони чуть шире плеч, тело прямое.",
        "Напряги пресс и ягодицы, держи корпус жёстким.",
        "Опустись, сгибая локти под углом ~45° к телу.",
        "Отожмись вверх до выпрямления рук."
      ],
      mistakes: ["Провисание таза.", "Локти разведены в стороны.", "Неполная амплитуда."]
    },
    en: {
      steps: [
        "Get into a plank, hands slightly wider than shoulders, body straight.",
        "Brace your abs and glutes to keep the torso rigid.",
        "Lower down with elbows at about 45° to the body.",
        "Push back up to full arm extension."
      ],
      mistakes: ["Sagging hips.", "Elbows flaring straight out.", "Cutting the range of motion short."]
    }
  },
  "chest-dip": {
    ru: {
      steps: [
        "Возьмись за брусья, наклони корпус слегка вперёд.",
        "Опускайся, сгибая локти, до растяжения груди.",
        "Отожмись вверх, оставаясь в наклоне.",
        "Держи плечи опущенными, не задирай их к ушам."
      ],
      mistakes: ["Вертикальный корпус — нагрузка уходит в трицепс.", "Слишком глубокий провал с болью в плечах.", "Раскачка."]
    },
    en: {
      steps: [
        "Grip the parallel bars and lean the torso slightly forward.",
        "Lower by bending the elbows until you feel a chest stretch.",
        "Press back up while staying leaned forward.",
        "Keep shoulders down, away from the ears."
      ],
      mistakes: ["Staying upright shifts load to the triceps.", "Dipping too deep and straining the shoulders.", "Swinging."]
    }
  },
  "cable-crossover": {
    ru: {
      steps: [
        "Выстави блоки вверху, возьми рукояти, шаг вперёд.",
        "Лёгкий наклон корпуса, локти чуть согнуты.",
        "Сведи руки перед собой по дуге, напрягая грудь.",
        "Медленно вернись, чувствуя растяжение."
      ],
      mistakes: ["Сгибание-разгибание локтей как в жиме.", "Рывки и инерция.", "Сведение слишком высоко."]
    },
    en: {
      steps: [
        "Set the pulleys high, grab the handles and step forward.",
        "Lean the torso slightly, keep a soft bend in the elbows.",
        "Bring your hands together in an arc, squeezing the chest.",
        "Return slowly, feeling the stretch."
      ],
      mistakes: ["Bending and straightening the elbows like a press.", "Using momentum.", "Crossing too high."]
    }
  },
  "dumbbell-fly": {
    ru: {
      steps: [
        "Ляг на скамью, гантели над грудью, локти чуть согнуты.",
        "Разведи руки в стороны по дуге до растяжения груди.",
        "Сведи гантели обратно над грудью тем же движением.",
        "Угол в локтях держи неизменным."
      ],
      mistakes: ["Сгибание локтей и превращение в жим.", "Слишком большой вес.", "Опускание ниже уровня плеч с риском травмы."]
    },
    en: {
      steps: [
        "Lie on the bench, dumbbells over the chest, slight elbow bend.",
        "Open the arms out in an arc until you feel a chest stretch.",
        "Bring the dumbbells back over the chest with the same arc.",
        "Keep the elbow angle fixed throughout."
      ],
      mistakes: ["Bending the elbows and turning it into a press.", "Using too much weight.", "Dropping below shoulder level and risking injury."]
    }
  },
  "pec-deck": {
    ru: {
      steps: [
        "Настрой сиденье, прижми спину, предплечья к подушкам.",
        "Сведи руки перед собой, напрягая грудь.",
        "Медленно вернись до лёгкого растяжения.",
        "Двигай только плечевыми суставами."
      ],
      mistakes: ["Резкое возвращение веса.", "Отрыв спины от спинки.", "Сведение за счёт корпуса."]
    },
    en: {
      steps: [
        "Adjust the seat, press your back in, forearms on the pads.",
        "Bring your arms together in front, squeezing the chest.",
        "Return slowly to a light stretch.",
        "Move only at the shoulder joints."
      ],
      mistakes: ["Letting the weight snap back.", "Lifting the back off the pad.", "Closing the arms with torso movement."]
    }
  },
  "resistance-band-chest-press": {
    ru: {
      steps: [
        "Закрепи ленту за спиной на уровне груди.",
        "Возьми концы, локти согнуты, шаг вперёд для натяжения.",
        "Выжми руки вперёд, сводя их перед собой.",
        "Вернись под контролем сопротивления."
      ],
      mistakes: ["Слабое натяжение ленты.", "Локти разведены в стороны.", "Сгорбленные плечи."]
    },
    en: {
      steps: [
        "Anchor the band behind you at chest height.",
        "Hold the ends, elbows bent, step forward to add tension.",
        "Press your arms forward, bringing them together in front.",
        "Return under control against the band."
      ],
      mistakes: ["Too little band tension.", "Elbows flaring out.", "Hunching the shoulders."]
    }
  },
  "barbell-overhead-press": {
    ru: {
      steps: [
        "Штанга на верх груди, хват чуть шире плеч, локти под грифом.",
        "Напряги пресс и ягодицы, корпус жёсткий.",
        "Выжми штангу строго вверх над головой.",
        "Подай голову слегка вперёд, штанга над серединой стоп."
      ],
      mistakes: ["Прогиб поясницы — жим превращается в наклонный.", "Штанга уходит вперёд.", "Помощь ногами (если не пуш-пресс)."]
    },
    en: {
      steps: [
        "Bar on the upper chest, grip slightly wider than shoulders, elbows under the bar.",
        "Brace your abs and glutes to keep the torso rigid.",
        "Press the bar straight up overhead.",
        "Move your head slightly forward so the bar finishes over mid-foot."
      ],
      mistakes: ["Arching the lower back into an incline press.", "Letting the bar drift forward.", "Using leg drive (unless it's a push press)."]
    }
  },
  "dumbbell-shoulder-press": {
    ru: {
      steps: [
        "Сядь, спина к спинке, гантели на уровне ушей.",
        "Локти чуть впереди корпуса.",
        "Выжми гантели вверх, не стукая ими.",
        "Опусти под контролем до уровня ушей."
      ],
      mistakes: ["Прогиб поясницы.", "Слишком широкие локти.", "Неполная амплитуда вниз."]
    },
    en: {
      steps: [
        "Sit with your back on the pad, dumbbells at ear level.",
        "Keep the elbows slightly in front of the torso.",
        "Press the dumbbells up without clanging them together.",
        "Lower under control back to ear level."
      ],
      mistakes: ["Arching the lower back.", "Elbows too wide.", "Cutting the range short at the bottom."]
    }
  },
  "arnold-press": {
    ru: {
      steps: [
        "Сядь, гантели перед собой, ладони к себе, локти прижаты.",
        "Выжимая вверх, разворачивай кисти ладонями вперёд.",
        "В верхней точке руки почти прямые.",
        "Опускаясь, выполни разворот в обратном порядке."
      ],
      mistakes: ["Слишком быстрый разворот.", "Прогиб поясницы.", "Большой вес в ущерб технике."]
    },
    en: {
      steps: [
        "Sit with dumbbells in front of you, palms facing in, elbows tucked.",
        "As you press up, rotate the palms to face forward.",
        "Arms are nearly straight at the top.",
        "Reverse the rotation on the way down."
      ],
      mistakes: ["Rotating too fast.", "Arching the lower back.", "Going heavy at the cost of form."]
    }
  },
  "machine-shoulder-press": {
    ru: {
      steps: [
        "Настрой сиденье: рукояти на уровне плеч.",
        "Прижми спину, возьмись за рукояти.",
        "Выжми вверх до почти прямых рук.",
        "Опусти под контролем до уровня плеч."
      ],
      mistakes: ["Слишком низкое сиденье.", "Бросок веса вниз.", "Отрыв спины от спинки."]
    },
    en: {
      steps: [
        "Adjust the seat so the handles are at shoulder height.",
        "Press your back in and grip the handles.",
        "Press up to nearly straight arms.",
        "Lower under control back to shoulder level."
      ],
      mistakes: ["Seat set too low.", "Dropping the weight on the way down.", "Lifting the back off the pad."]
    }
  },
  "pike-push-up": {
    ru: {
      steps: [
        "Упор лёжа, подними таз вверх — тело буквой Λ.",
        "Голова смотрит между ладоней.",
        "Согни локти, опуская макушку к полу.",
        "Отожмись вверх, нагружая плечи."
      ],
      mistakes: ["Низкий таз — превращается в обычное отжимание.", "Локти широко в стороны.", "Малая амплитуда."]
    },
    en: {
      steps: [
        "From a plank, lift the hips up so the body forms an inverted V.",
        "Head looks between the hands.",
        "Bend the elbows, lowering the crown of the head toward the floor.",
        "Press back up, loading the shoulders."
      ],
      mistakes: ["Hips too low turns it into a regular push-up.", "Elbows flaring wide.", "Short range of motion."]
    }
  },
  "dumbbell-lateral-raise": {
    ru: {
      steps: [
        "Встань, гантели по бокам, локти чуть согнуты.",
        "Подними руки в стороны до уровня плеч.",
        "Веди движение локтями, не кистями.",
        "Опусти медленно под контролем."
      ],
      mistakes: ["Заброс веса корпусом.", "Подъём выше плеч.", "Кисти выше локтей."]
    },
    en: {
      steps: [
        "Stand with dumbbells at your sides, slight elbow bend.",
        "Raise the arms out to the sides up to shoulder level.",
        "Lead the movement with the elbows, not the hands.",
        "Lower slowly under control."
      ],
      mistakes: ["Swinging the weight with the torso.", "Raising above shoulder level.", "Letting the hands rise above the elbows."]
    }
  },
  "cable-lateral-raise": {
    ru: {
      steps: [
        "Встань боком к нижнему блоку, рукоять в дальней руке.",
        "Локоть чуть согнут, рука перед бедром.",
        "Подними руку в сторону до уровня плеча.",
        "Опусти медленно, сохраняя натяжение троса."
      ],
      mistakes: ["Раскачка корпусом.", "Подъём выше плеча.", "Провисание троса внизу."]
    },
    en: {
      steps: [
        "Stand side-on to a low pulley, handle in the far hand.",
        "Slight elbow bend, hand in front of the thigh.",
        "Raise the arm out to the side up to shoulder level.",
        "Lower slowly, keeping tension on the cable."
      ],
      mistakes: ["Swinging the torso.", "Raising above the shoulder.", "Letting the cable go slack at the bottom."]
    }
  },
  "band-lateral-raise": {
    ru: {
      steps: [
        "Встань на середину ленты, концы в руках.",
        "Локти чуть согнуты, руки по бокам.",
        "Подними руки в стороны до уровня плеч.",
        "Опусти под контролем сопротивления."
      ],
      mistakes: ["Заброс корпусом.", "Подъём выше плеч.", "Слишком слабая лента."]
    },
    en: {
      steps: [
        "Stand on the middle of the band, ends in your hands.",
        "Slight elbow bend, arms at the sides.",
        "Raise the arms out to the sides up to shoulder level.",
        "Lower under control against the band."
      ],
      mistakes: ["Swinging with the torso.", "Raising above the shoulders.", "Band too light."]
    }
  },
  "dumbbell-front-raise": {
    ru: {
      steps: [
        "Встань, гантели перед бёдрами, ладони к себе.",
        "Подними прямую руку перед собой до уровня плеча.",
        "Локоть чуть согнут, движение без рывка.",
        "Опусти медленно под контролем."
      ],
      mistakes: ["Заброс веса корпусом.", "Подъём выше плеч.", "Прогиб поясницы."]
    },
    en: {
      steps: [
        "Stand with dumbbells in front of the thighs, palms toward you.",
        "Raise one straight arm forward up to shoulder level.",
        "Keep a slight elbow bend, no jerking.",
        "Lower slowly under control."
      ],
      mistakes: ["Swinging the weight with the torso.", "Raising above shoulder level.", "Arching the lower back."]
    }
  },
  "plate-front-raise": {
    ru: {
      steps: [
        "Держи диск двумя руками перед бёдрами.",
        "Подними диск прямыми руками до уровня плеч.",
        "Движение плавное, без рывка.",
        "Опусти под контролем."
      ],
      mistakes: ["Раскачка корпусом.", "Прогиб поясницы.", "Подъём выше плеч."]
    },
    en: {
      steps: [
        "Hold a plate with both hands in front of the thighs.",
        "Raise the plate with straight arms up to shoulder level.",
        "Move smoothly, without jerking.",
        "Lower under control."
      ],
      mistakes: ["Swinging the torso.", "Arching the lower back.", "Raising above shoulder level."]
    }
  },
  "cable-triceps-pushdown": {
    ru: {
      steps: [
        "Встань у верхнего блока, локти прижаты к корпусу.",
        "Разогни руки вниз до полного выпрямления.",
        "В нижней точке напряги трицепс.",
        "Вернись под контролем, не разводя локти."
      ],
      mistakes: ["Локти уходят вперёд и в стороны.", "Помощь корпусом.", "Неполное разгибание."]
    },
    en: {
      steps: [
        "Stand at a high pulley, elbows pinned to your sides.",
        "Extend the arms down to full lockout.",
        "Squeeze the triceps at the bottom.",
        "Return under control without letting the elbows drift."
      ],
      mistakes: ["Elbows drifting forward and out.", "Using the torso to help.", "Not fully extending."]
    }
  },
  "overhead-dumbbell-triceps-extension": {
    ru: {
      steps: [
        "Подними гантель над головой, локти у ушей.",
        "Опусти гантель за голову, сгибая локти.",
        "Разогни руки вверх, держа локти на месте.",
        "Двигаются только предплечья."
      ],
      mistakes: ["Локти разъезжаются в стороны.", "Прогиб поясницы.", "Слишком большой вес."]
    },
    en: {
      steps: [
        "Raise a dumbbell overhead, elbows by the ears.",
        "Lower the dumbbell behind the head by bending the elbows.",
        "Extend the arms up, keeping the elbows in place.",
        "Only the forearms move."
      ],
      mistakes: ["Elbows splaying out.", "Arching the lower back.", "Using too much weight."]
    }
  },
  "lying-barbell-triceps-extension": {
    ru: {
      steps: [
        "Ляг на скамью, штанга над грудью, хват уже плеч.",
        "Опусти штангу ко лбу или за голову, сгибая локти.",
        "Разогни руки, держа локти неподвижными.",
        "Контролируй штангу всю амплитуду."
      ],
      mistakes: ["Локти разъезжаются.", "Движение локтями вместо предплечий.", "Опускание на нос."]
    },
    en: {
      steps: [
        "Lie on the bench, bar over the chest, grip narrower than shoulders.",
        "Lower the bar toward the forehead or behind the head by bending the elbows.",
        "Extend the arms while keeping the elbows still.",
        "Control the bar through the whole range."
      ],
      mistakes: ["Elbows splaying out.", "Moving at the elbows instead of the forearms.", "Lowering onto the nose."]
    }
  },
  "close-grip-bench-press": {
    ru: {
      steps: [
        "Ляг, хват на ширине плеч, лопатки сведены.",
        "Опусти штангу к низу груди, локти близко к корпусу.",
        "Выжми вверх за счёт трицепса.",
        "Запястья держи прямыми."
      ],
      mistakes: ["Слишком узкий хват — боль в запястьях.", "Локти в стороны.", "Отбив от груди."]
    },
    en: {
      steps: [
        "Lie down, grip about shoulder-width, shoulder blades retracted.",
        "Lower the bar to the lower chest, elbows close to the body.",
        "Press up driving through the triceps.",
        "Keep the wrists straight."
      ],
      mistakes: ["Grip too narrow strains the wrists.", "Elbows flaring out.", "Bouncing off the chest."]
    }
  },
  "bench-dip": {
    ru: {
      steps: [
        "Упрись руками в край скамьи за спиной, ноги впереди.",
        "Опускайся, сгибая локти назад, до угла ~90°.",
        "Отожмись вверх за счёт трицепса.",
        "Держи спину близко к скамье."
      ],
      mistakes: ["Локти разведены в стороны.", "Слишком глубокий провал — нагрузка на плечи.", "Помощь ногами."]
    },
    en: {
      steps: [
        "Place your hands on the edge of a bench behind you, feet out in front.",
        "Lower by bending the elbows back to about 90°.",
        "Press back up through the triceps.",
        "Keep your back close to the bench."
      ],
      mistakes: ["Elbows flaring out.", "Dipping too deep and straining the shoulders.", "Pushing with the legs."]
    }
  },
  "triceps-dip": {
    ru: {
      steps: [
        "Возьмись за брусья, корпус почти вертикально.",
        "Опускайся, сгибая локти назад вдоль корпуса.",
        "Отожмись вверх до выпрямления рук.",
        "Плечи опущены, не задирай их к ушам."
      ],
      mistakes: ["Наклон вперёд — нагрузка уходит в грудь.", "Локти в стороны.", "Раскачка."]
    },
    en: {
      steps: [
        "Grip the parallel bars, torso nearly vertical.",
        "Lower by bending the elbows back along the body.",
        "Press up to full arm extension.",
        "Keep shoulders down, not shrugged to the ears."
      ],
      mistakes: ["Leaning forward shifts load to the chest.", "Elbows flaring out.", "Swinging."]
    }
  },
  "diamond-push-up": {
    ru: {
      steps: [
        "Упор лёжа, ладони вместе под грудью — пальцы образуют ромб.",
        "Тело прямое, пресс напряжён.",
        "Опустись, держа локти близко к корпусу.",
        "Отожмись вверх за счёт трицепса."
      ],
      mistakes: ["Локти в стороны.", "Провисание таза.", "Неполная амплитуда."]
    },
    en: {
      steps: [
        "Plank position, hands together under the chest forming a diamond.",
        "Body straight, abs braced.",
        "Lower down keeping the elbows close to the body.",
        "Press up through the triceps."
      ],
      mistakes: ["Elbows flaring out.", "Sagging hips.", "Cutting the range short."]
    }
  },
  "band-triceps-pushdown": {
    ru: {
      steps: [
        "Закрепи ленту сверху, возьми концы, локти у корпуса.",
        "Разогни руки вниз до полного выпрямления.",
        "Напряги трицепс в нижней точке.",
        "Вернись под контролем."
      ],
      mistakes: ["Локти уходят вперёд.", "Помощь корпусом.", "Слабое натяжение ленты."]
    },
    en: {
      steps: [
        "Anchor the band overhead, hold the ends, elbows at your sides.",
        "Extend the arms down to full lockout.",
        "Squeeze the triceps at the bottom.",
        "Return under control."
      ],
      mistakes: ["Elbows drifting forward.", "Using the torso to help.", "Too little band tension."]
    }
  },
  "pull-up": {
    ru: {
      steps: [
        "Возьмись за турник хватом сверху чуть шире плеч.",
        "Опусти плечи, начни тягу со сведения лопаток.",
        "Подтянись, пока подбородок не выйдет за перекладину.",
        "Опустись под контролем до полного виса."
      ],
      mistakes: ["Раскачка и рывки.", "Неполное опускание.", "Тяга только руками без спины."]
    },
    en: {
      steps: [
        "Grip the bar overhand, slightly wider than shoulders.",
        "Depress the shoulders, start the pull by retracting the shoulder blades.",
        "Pull up until the chin clears the bar.",
        "Lower under control to a full hang."
      ],
      mistakes: ["Swinging and kipping.", "Not lowering all the way.", "Pulling with the arms only, not the back."]
    }
  },
  "chin-up": {
    ru: {
      steps: [
        "Возьмись за турник хватом снизу на ширине плеч.",
        "Опусти плечи, сведи лопатки.",
        "Подтянись, пока подбородок не выйдет за перекладину.",
        "Опустись под контролем до прямых рук."
      ],
      mistakes: ["Раскачка корпусом.", "Неполная амплитуда.", "Сгорбленные плечи вверху."]
    },
    en: {
      steps: [
        "Grip the bar underhand at shoulder width.",
        "Depress the shoulders, retract the shoulder blades.",
        "Pull up until the chin clears the bar.",
        "Lower under control to straight arms."
      ],
      mistakes: ["Swinging the torso.", "Partial range of motion.", "Shrugged shoulders at the top."]
    }
  },
  "lat-pulldown": {
    ru: {
      steps: [
        "Сядь, зафиксируй бёдра, возьми гриф шире плеч.",
        "Слегка отклони корпус, опусти плечи.",
        "Тяни гриф к верху груди, сводя лопатки.",
        "Вернись под контролем до прямых рук."
      ],
      mistakes: ["Тяга за голову.", "Сильный отклон назад.", "Рывки корпусом."]
    },
    en: {
      steps: [
        "Sit down, lock the thigh pad, grip the bar wider than shoulders.",
        "Lean back slightly, depress the shoulders.",
        "Pull the bar to the upper chest, squeezing the shoulder blades.",
        "Return under control to straight arms."
      ],
      mistakes: ["Pulling behind the neck.", "Leaning back too far.", "Jerking with the torso."]
    }
  },
  "band-lat-pulldown": {
    ru: {
      steps: [
        "Закрепи ленту сверху, возьми концы, встань на колени или сядь.",
        "Опусти плечи, корпус чуть отклонён.",
        "Тяни руки вниз к груди, сводя лопатки.",
        "Вернись под контролем сопротивления."
      ],
      mistakes: ["Тяга только руками.", "Рывок корпусом.", "Слабая лента."]
    },
    en: {
      steps: [
        "Anchor the band overhead, hold the ends, kneel or sit.",
        "Depress the shoulders, lean the torso slightly.",
        "Pull the arms down toward the chest, squeezing the shoulder blades.",
        "Return under control against the band."
      ],
      mistakes: ["Pulling with the arms only.", "Jerking with the torso.", "Band too light."]
    }
  },
  "straight-arm-pulldown": {
    ru: {
      steps: [
        "Встань у верхнего блока, возьми гриф, руки прямые.",
        "Лёгкий наклон корпуса, пресс напряжён.",
        "Опусти прямые руки по дуге к бёдрам.",
        "Вернись под контролем, не сгибая локти."
      ],
      mistakes: ["Сгибание локтей — превращается в тягу.", "Раскачка корпусом.", "Подъём плеч."]
    },
    en: {
      steps: [
        "Stand at a high pulley, grip the bar with straight arms.",
        "Lean the torso slightly, brace the abs.",
        "Pull the straight arms down in an arc toward the thighs.",
        "Return under control without bending the elbows."
      ],
      mistakes: ["Bending the elbows turns it into a row.", "Swinging the torso.", "Shrugging the shoulders."]
    }
  },
  "barbell-bent-over-row": {
    ru: {
      steps: [
        "Наклонись с прямой спиной, штанга под плечами.",
        "Хват чуть шире плеч, колени чуть согнуты.",
        "Тяни штангу к низу живота, сводя лопатки.",
        "Опусти под контролем, спину держи прямой."
      ],
      mistakes: ["Круглая спина.", "Рывок корпусом вверх.", "Тяга к груди вместо живота."]
    },
    en: {
      steps: [
        "Hinge over with a flat back, bar under the shoulders.",
        "Grip slightly wider than shoulders, knees slightly bent.",
        "Pull the bar to the lower abdomen, squeezing the shoulder blades.",
        "Lower under control, keeping the back flat."
      ],
      mistakes: ["Rounding the back.", "Heaving the torso up.", "Pulling to the chest instead of the abdomen."]
    }
  },
  "dumbbell-row": {
    ru: {
      steps: [
        "Упрись коленом и рукой в скамью, спина прямая.",
        "Гантель в свободной руке, плечо опущено.",
        "Тяни гантель к поясу, ведя локоть назад.",
        "Опусти под контролем до растяжения."
      ],
      mistakes: ["Разворот корпуса при тяге.", "Тяга в сторону, а не назад.", "Круглая спина."]
    },
    en: {
      steps: [
        "Brace one knee and hand on the bench, back flat.",
        "Dumbbell in the free hand, shoulder depressed.",
        "Pull the dumbbell to the waist, driving the elbow back.",
        "Lower under control to a stretch."
      ],
      mistakes: ["Rotating the torso during the pull.", "Rowing out to the side instead of back.", "Rounding the back."]
    }
  },
  "seated-cable-row": {
    ru: {
      steps: [
        "Сядь, упрись стопами, возьми рукоять, спина прямая.",
        "Подай корпус слегка вперёд для растяжения.",
        "Тяни рукоять к животу, сводя лопатки.",
        "Вернись под контролем, не сутулясь."
      ],
      mistakes: ["Сильная раскачка корпусом.", "Сутулость в начальной фазе.", "Тяга только руками."]
    },
    en: {
      steps: [
        "Sit down, plant the feet, grip the handle, back straight.",
        "Lean the torso slightly forward for a stretch.",
        "Pull the handle to the abdomen, squeezing the shoulder blades.",
        "Return under control without slouching."
      ],
      mistakes: ["Excessive torso rocking.", "Slouching at the start.", "Pulling with the arms only."]
    }
  },
  "t-bar-row": {
    ru: {
      steps: [
        "Встань над грифом, наклонись с прямой спиной.",
        "Возьми рукоять, колени чуть согнуты.",
        "Тяни вес к груди, сводя лопатки.",
        "Опусти под контролем, спина остаётся прямой."
      ],
      mistakes: ["Круглая спина.", "Рывок корпусом.", "Неполная амплитуда."]
    },
    en: {
      steps: [
        "Straddle the bar and hinge over with a flat back.",
        "Grip the handle, knees slightly bent.",
        "Pull the weight to the chest, squeezing the shoulder blades.",
        "Lower under control, keeping the back flat."
      ],
      mistakes: ["Rounding the back.", "Heaving with the torso.", "Partial range of motion."]
    }
  },
  "inverted-row": {
    ru: {
      steps: [
        "Возьмись за низкий гриф, тело прямое под ним.",
        "Напряги пресс и ягодицы, корпус жёсткий.",
        "Подтяни грудь к грифу, сводя лопатки.",
        "Опустись под контролем до прямых рук."
      ],
      mistakes: ["Провисание таза.", "Неполное подтягивание.", "Рывки."]
    },
    en: {
      steps: [
        "Grip a low bar with the body straight underneath it.",
        "Brace the abs and glutes to keep the body rigid.",
        "Pull the chest to the bar, squeezing the shoulder blades.",
        "Lower under control to straight arms."
      ],
      mistakes: ["Sagging hips.", "Not pulling all the way up.", "Jerking."]
    }
  },
  "band-seated-row": {
    ru: {
      steps: [
        "Сядь, ноги прямые, лента обёрнута вокруг стоп.",
        "Возьми концы, спина прямая.",
        "Тяни руки к животу, сводя лопатки.",
        "Вернись под контролем сопротивления."
      ],
      mistakes: ["Круглая спина.", "Раскачка корпусом.", "Тяга только руками."]
    },
    en: {
      steps: [
        "Sit with legs straight, the band looped around the feet.",
        "Hold the ends, back straight.",
        "Pull the arms to the abdomen, squeezing the shoulder blades.",
        "Return under control against the band."
      ],
      mistakes: ["Rounding the back.", "Rocking the torso.", "Pulling with the arms only."]
    }
  },
  "barbell-shrug": {
    ru: {
      steps: [
        "Встань прямо, штанга в опущенных руках.",
        "Подними плечи строго вверх к ушам.",
        "Задержись на миг в верхней точке.",
        "Опусти плечи под контролем."
      ],
      mistakes: ["Вращение плечами.", "Сгибание рук.", "Рывковые движения."]
    },
    en: {
      steps: [
        "Stand tall, barbell in your hands at the sides.",
        "Lift the shoulders straight up toward the ears.",
        "Pause briefly at the top.",
        "Lower the shoulders under control."
      ],
      mistakes: ["Rolling the shoulders.", "Bending the arms.", "Jerky movements."]
    }
  },
  "dumbbell-shrug": {
    ru: {
      steps: [
        "Встань прямо, гантели по бокам.",
        "Подними плечи вверх к ушам.",
        "Задержись в верхней точке.",
        "Опусти плечи под контролем."
      ],
      mistakes: ["Вращение плечами.", "Сгибание локтей.", "Рывки."]
    },
    en: {
      steps: [
        "Stand tall, dumbbells at your sides.",
        "Lift the shoulders up toward the ears.",
        "Pause at the top.",
        "Lower the shoulders under control."
      ],
      mistakes: ["Rolling the shoulders.", "Bending the elbows.", "Jerking."]
    }
  },
  "conventional-deadlift": {
    ru: {
      steps: [
        "Стопы под штангой, хват чуть шире ног, спина прямая.",
        "Грудь раскрыта, плечи над грифом, таз выше колен.",
        "Оттолкнись ногами и поднимайся, ведя штангу вдоль голеней.",
        "Выпрямись полностью, затем опусти под контролем."
      ],
      mistakes: ["Круглая поясница.", "Штанга уходит от ног вперёд.", "Подъём за счёт спины, а не ног."]
    },
    en: {
      steps: [
        "Feet under the bar, grip just outside the legs, back flat.",
        "Chest up, shoulders over the bar, hips above the knees.",
        "Drive through the legs and rise, dragging the bar along the shins.",
        "Stand fully upright, then lower under control."
      ],
      mistakes: ["Rounding the lower back.", "Letting the bar drift away from the legs.", "Lifting with the back instead of the legs."]
    }
  },
  "dumbbell-rear-delt-fly": {
    ru: {
      steps: [
        "Наклонись с прямой спиной, гантели под грудью.",
        "Локти чуть согнуты, плечи опущены.",
        "Разведи руки в стороны до уровня плеч.",
        "Опусти под контролем, чувствуя заднюю дельту."
      ],
      mistakes: ["Тяга вместо разведения.", "Круглая спина.", "Заброс веса инерцией."]
    },
    en: {
      steps: [
        "Hinge over with a flat back, dumbbells under the chest.",
        "Slight elbow bend, shoulders depressed.",
        "Raise the arms out to the sides up to shoulder level.",
        "Lower under control, feeling the rear delts."
      ],
      mistakes: ["Rowing instead of raising.", "Rounding the back.", "Heaving the weight with momentum."]
    }
  },
  "cable-face-pull": {
    ru: {
      steps: [
        "Выстави блок на уровень лица, возьми канат.",
        "Отступи назад, руки прямые, плечи опущены.",
        "Тяни канат к лицу, разводя кисти в стороны.",
        "Вернись под контролем, сохраняя натяжение."
      ],
      mistakes: ["Тяга к груди, а не к лицу.", "Подъём плеч к ушам.", "Помощь корпусом."]
    },
    en: {
      steps: [
        "Set the pulley at face height and grab the rope.",
        "Step back, arms straight, shoulders depressed.",
        "Pull the rope to the face, spreading the hands apart.",
        "Return under control, keeping tension."
      ],
      mistakes: ["Pulling to the chest instead of the face.", "Shrugging the shoulders.", "Using the torso to help."]
    }
  },
  "reverse-pec-deck": {
    ru: {
      steps: [
        "Сядь грудью к спинке тренажёра, возьми рукояти.",
        "Локти чуть согнуты, плечи опущены.",
        "Разведи руки назад в стороны до уровня плеч.",
        "Вернись под контролем, не бросая вес."
      ],
      mistakes: ["Сведение лопаток вместо работы дельт.", "Резкое возвращение.", "Полное выпрямление локтей."]
    },
    en: {
      steps: [
        "Sit with your chest against the pad and grab the handles.",
        "Slight elbow bend, shoulders depressed.",
        "Open the arms back and out to shoulder level.",
        "Return under control without dropping the weight."
      ],
      mistakes: ["Squeezing the shoulder blades instead of working the delts.", "Letting the weight snap back.", "Fully locking the elbows."]
    }
  },
  "band-face-pull": {
    ru: {
      steps: [
        "Закрепи ленту на уровне лица, возьми концы.",
        "Отступи для натяжения, руки прямые.",
        "Тяни ленту к лицу, разводя кисти.",
        "Вернись под контролем."
      ],
      mistakes: ["Подъём плеч.", "Тяга к груди.", "Слабое натяжение."]
    },
    en: {
      steps: [
        "Anchor the band at face height and hold the ends.",
        "Step back for tension, arms straight.",
        "Pull the band to the face, spreading the hands.",
        "Return under control."
      ],
      mistakes: ["Shrugging the shoulders.", "Pulling to the chest.", "Too little tension."]
    }
  },
  "barbell-upright-row": {
    ru: {
      steps: [
        "Встань прямо, штанга в руках хватом на ширине плеч.",
        "Тяни штангу вверх вдоль корпуса, локти ведут движение.",
        "Подними до уровня груди, не выше.",
        "Опусти под контролем."
      ],
      mistakes: ["Подъём локтей выше плеч — риск для плеч.", "Слишком узкий хват.", "Рывки."]
    },
    en: {
      steps: [
        "Stand tall, barbell held at shoulder-width grip.",
        "Pull the bar up along the body, elbows leading.",
        "Raise to chest level, no higher.",
        "Lower under control."
      ],
      mistakes: ["Raising the elbows above the shoulders risks the joints.", "Grip too narrow.", "Jerking."]
    }
  },
  "dumbbell-upright-row": {
    ru: {
      steps: [
        "Встань прямо, гантели перед бёдрами.",
        "Тяни гантели вверх вдоль корпуса, локти ведут.",
        "Подними до уровня груди.",
        "Опусти под контролем."
      ],
      mistakes: ["Локти выше плеч.", "Заброс инерцией.", "Округление спины."]
    },
    en: {
      steps: [
        "Stand tall, dumbbells in front of the thighs.",
        "Pull the dumbbells up along the body, elbows leading.",
        "Raise to chest level.",
        "Lower under control."
      ],
      mistakes: ["Elbows above the shoulders.", "Heaving with momentum.", "Rounding the back."]
    }
  },
  "barbell-curl": {
    ru: {
      steps: [
        "Встань прямо, штанга в руках хватом снизу, локти у корпуса.",
        "Согни руки, поднимая штангу к груди.",
        "Напряги бицепс в верхней точке.",
        "Опусти под контролем до прямых рук."
      ],
      mistakes: ["Раскачка корпусом.", "Локти уходят вперёд.", "Неполное опускание."]
    },
    en: {
      steps: [
        "Stand tall, barbell in an underhand grip, elbows at your sides.",
        "Curl the bar up toward the chest.",
        "Squeeze the biceps at the top.",
        "Lower under control to straight arms."
      ],
      mistakes: ["Swinging the torso.", "Elbows drifting forward.", "Not lowering all the way."]
    }
  },
  "dumbbell-curl": {
    ru: {
      steps: [
        "Встань или сядь, гантели по бокам, ладони вперёд.",
        "Согни руку, поднимая гантель к плечу.",
        "Напряги бицепс вверху, локоть на месте.",
        "Опусти под контролем."
      ],
      mistakes: ["Раскачка корпусом.", "Локоть уходит вперёд.", "Заброс гантели."]
    },
    en: {
      steps: [
        "Stand or sit, dumbbells at the sides, palms forward.",
        "Curl one arm, raising the dumbbell to the shoulder.",
        "Squeeze the biceps at the top, elbow fixed.",
        "Lower under control."
      ],
      mistakes: ["Swinging the torso.", "Elbow drifting forward.", "Heaving the dumbbell up."]
    }
  },
  "hammer-curl": {
    ru: {
      steps: [
        "Встань, гантели по бокам, ладони обращены друг к другу.",
        "Согни руку, поднимая гантель, кисть нейтральна.",
        "Напряги бицепс и предплечье вверху.",
        "Опусти под контролем."
      ],
      mistakes: ["Раскачка.", "Разворот кисти.", "Локоть уходит вперёд."]
    },
    en: {
      steps: [
        "Stand with dumbbells at the sides, palms facing each other.",
        "Curl one arm up keeping the wrist neutral.",
        "Squeeze the biceps and forearm at the top.",
        "Lower under control."
      ],
      mistakes: ["Swinging.", "Rotating the wrist.", "Elbow drifting forward."]
    }
  },
  "incline-dumbbell-curl": {
    ru: {
      steps: [
        "Сядь на наклонную скамью, руки свободно свисают.",
        "Согни руку, поднимая гантель, локоть на месте.",
        "Напряги бицепс вверху.",
        "Опусти до полного растяжения."
      ],
      mistakes: ["Локоть выводится вперёд.", "Раскачка плечом.", "Неполное растяжение внизу."]
    },
    en: {
      steps: [
        "Sit on an incline bench, arms hanging freely.",
        "Curl one arm up, keeping the elbow in place.",
        "Squeeze the biceps at the top.",
        "Lower to a full stretch."
      ],
      mistakes: ["Bringing the elbow forward.", "Swinging at the shoulder.", "Not stretching fully at the bottom."]
    }
  },
  "cable-curl": {
    ru: {
      steps: [
        "Встань у нижнего блока, возьми рукоять, локти у корпуса.",
        "Согни руки, поднимая рукоять к груди.",
        "Напряги бицепс вверху.",
        "Опусти под контролем, сохраняя натяжение."
      ],
      mistakes: ["Раскачка корпусом.", "Локти уходят вперёд.", "Провисание троса."]
    },
    en: {
      steps: [
        "Stand at a low pulley, grip the handle, elbows at your sides.",
        "Curl the handle up toward the chest.",
        "Squeeze the biceps at the top.",
        "Lower under control, keeping tension."
      ],
      mistakes: ["Swinging the torso.", "Elbows drifting forward.", "Letting the cable go slack."]
    }
  },
  "band-curl": {
    ru: {
      steps: [
        "Встань на середину ленты, возьми концы, ладони вперёд.",
        "Согни руки, поднимая кисти к плечам.",
        "Напряги бицепс вверху.",
        "Опусти под контролем сопротивления."
      ],
      mistakes: ["Раскачка.", "Локти уходят вперёд.", "Слабая лента."]
    },
    en: {
      steps: [
        "Stand on the middle of the band, hold the ends, palms forward.",
        "Curl the arms up toward the shoulders.",
        "Squeeze the biceps at the top.",
        "Lower under control against the band."
      ],
      mistakes: ["Swinging.", "Elbows drifting forward.", "Band too light."]
    }
  },
  "barbell-back-squat": {
    ru: {
      steps: [
        "Штанга на верх трапеций, стопы на ширине плеч, носки чуть наружу.",
        "Вдохни, напряги пресс, начни движение с таза.",
        "Опустись, пока бёдра не станут параллельны полу.",
        "Поднимись, толкаясь пятками, колени по линии стоп."
      ],
      mistakes: ["Колени заваливаются внутрь.", "Круглая спина.", "Отрыв пяток от пола."]
    },
    en: {
      steps: [
        "Bar on the upper traps, feet shoulder-width, toes slightly out.",
        "Inhale, brace the abs, initiate the movement from the hips.",
        "Descend until the thighs are parallel to the floor.",
        "Rise driving through the heels, knees tracking the toes."
      ],
      mistakes: ["Knees caving inward.", "Rounding the back.", "Heels lifting off the floor."]
    }
  },
  "barbell-front-squat": {
    ru: {
      steps: [
        "Штанга на передних дельтах, локти высоко вперёд.",
        "Стопы на ширине плеч, корпус вертикальный.",
        "Опустись вниз, держа грудь раскрытой.",
        "Поднимись, толкаясь пятками."
      ],
      mistakes: ["Локти опускаются — штанга катится вперёд.", "Наклон корпуса вперёд.", "Колени внутрь."]
    },
    en: {
      steps: [
        "Bar on the front delts, elbows high and forward.",
        "Feet shoulder-width, torso upright.",
        "Descend keeping the chest up.",
        "Rise driving through the heels."
      ],
      mistakes: ["Elbows dropping makes the bar roll forward.", "Leaning the torso forward.", "Knees caving in."]
    }
  },
  "goblet-squat": {
    ru: {
      steps: [
        "Держи гантель или гирю у груди двумя руками.",
        "Стопы на ширине плеч, корпус вертикальный.",
        "Опустись вниз, локти между коленей.",
        "Поднимись, толкаясь пятками."
      ],
      mistakes: ["Круглая спина.", "Колени заваливаются внутрь.", "Отрыв пяток."]
    },
    en: {
      steps: [
        "Hold a dumbbell or kettlebell at the chest with both hands.",
        "Feet shoulder-width, torso upright.",
        "Descend with the elbows tracking between the knees.",
        "Rise driving through the heels."
      ],
      mistakes: ["Rounding the back.", "Knees caving inward.", "Heels lifting."]
    }
  },
  "leg-press": {
    ru: {
      steps: [
        "Сядь, стопы на платформе на ширине плеч.",
        "Сними платформу со стопоров, колени над стопами.",
        "Опусти платформу, пока колени не подойдут к ~90°.",
        "Выжми, не разгибая колени до жёсткого локаута."
      ],
      mistakes: ["Отрыв таза от спинки внизу.", "Полное жёсткое выпрямление колен.", "Колени заваливаются внутрь."]
    },
    en: {
      steps: [
        "Sit down, feet on the platform shoulder-width apart.",
        "Release the safeties, knees tracking over the feet.",
        "Lower the platform until the knees reach about 90°.",
        "Press up without locking the knees hard."
      ],
      mistakes: ["Hips lifting off the pad at the bottom.", "Hard full knee lockout.", "Knees caving inward."]
    }
  },
  "bodyweight-squat": {
    ru: {
      steps: [
        "Стопы на ширине плеч, носки чуть наружу.",
        "Руки вытяни вперёд для баланса.",
        "Опустись вниз, отводя таз назад.",
        "Поднимись, толкаясь пятками."
      ],
      mistakes: ["Колени внутрь.", "Округление спины.", "Отрыв пяток."]
    },
    en: {
      steps: [
        "Feet shoulder-width, toes slightly out.",
        "Extend the arms forward for balance.",
        "Descend by sending the hips back.",
        "Rise driving through the heels."
      ],
      mistakes: ["Knees caving in.", "Rounding the back.", "Heels lifting."]
    }
  },
  "leg-extension": {
    ru: {
      steps: [
        "Сядь, валик над стопами, спина прижата к спинке.",
        "Разогни ноги, поднимая валик до прямых ног.",
        "Напряги квадрицепс в верхней точке.",
        "Опусти под контролем."
      ],
      mistakes: ["Рывок и инерция.", "Отрыв таза от сиденья.", "Резкое разгибание с ударом в колене."]
    },
    en: {
      steps: [
        "Sit down, pad over the feet, back against the seat.",
        "Extend the legs, raising the pad to straight legs.",
        "Squeeze the quads at the top.",
        "Lower under control."
      ],
      mistakes: ["Jerking and using momentum.", "Hips lifting off the seat.", "Snapping the knees straight."]
    }
  },
  "romanian-deadlift": {
    ru: {
      steps: [
        "Встань, штанга у бёдер, колени чуть согнуты.",
        "Отводи таз назад, опуская штангу вдоль ног.",
        "Опусти до растяжения задней поверхности бедра.",
        "Вернись, выводя таз вперёд, спина прямая."
      ],
      mistakes: ["Круглая спина.", "Сильное сгибание колен — превращается в становую.", "Штанга уходит от ног."]
    },
    en: {
      steps: [
        "Stand with the bar at the hips, knees slightly bent.",
        "Send the hips back, lowering the bar along the legs.",
        "Lower until you feel a hamstring stretch.",
        "Return by driving the hips forward, back flat."
      ],
      mistakes: ["Rounding the back.", "Bending the knees too much turns it into a deadlift.", "Letting the bar drift away from the legs."]
    }
  },
  "dumbbell-romanian-deadlift": {
    ru: {
      steps: [
        "Встань, гантели перед бёдрами, колени чуть согнуты.",
        "Отводи таз назад, опуская гантели вдоль ног.",
        "Опусти до растяжения задней поверхности бедра.",
        "Вернись, выводя таз вперёд."
      ],
      mistakes: ["Круглая спина.", "Гантели уходят вперёд от ног.", "Глубокий присед вместо наклона."]
    },
    en: {
      steps: [
        "Stand with dumbbells in front of the thighs, knees slightly bent.",
        "Send the hips back, lowering the dumbbells along the legs.",
        "Lower until you feel a hamstring stretch.",
        "Return by driving the hips forward."
      ],
      mistakes: ["Rounding the back.", "Dumbbells drifting forward off the legs.", "Squatting down instead of hinging."]
    }
  },
  "lying-leg-curl": {
    ru: {
      steps: [
        "Ляг на тренажёр лицом вниз, валик над пятками.",
        "Согни ноги, подтягивая валик к ягодицам.",
        "Напряги заднюю поверхность бедра вверху.",
        "Опусти под контролем."
      ],
      mistakes: ["Отрыв таза от подушки.", "Рывковое сгибание.", "Неполная амплитуда."]
    },
    en: {
      steps: [
        "Lie face down on the machine, pad above the heels.",
        "Curl the legs, bringing the pad toward the glutes.",
        "Squeeze the hamstrings at the top.",
        "Lower under control."
      ],
      mistakes: ["Hips lifting off the pad.", "Jerky curling.", "Partial range of motion."]
    }
  },
  "seated-leg-curl": {
    ru: {
      steps: [
        "Сядь, валик над пятками, бёдра зафиксированы.",
        "Согни ноги, опуская валик под себя.",
        "Напряги заднюю поверхность бедра.",
        "Вернись под контролем."
      ],
      mistakes: ["Рывки.", "Отрыв таза.", "Неполная амплитуда."]
    },
    en: {
      steps: [
        "Sit down, pad above the heels, thighs locked under the pad.",
        "Curl the legs, drawing the pad down and under.",
        "Squeeze the hamstrings.",
        "Return under control."
      ],
      mistakes: ["Jerking.", "Hips lifting.", "Partial range of motion."]
    }
  },
  "nordic-hamstring-curl": {
    ru: {
      steps: [
        "Встань на колени, попроси зафиксировать стопы или закрепи их.",
        "Корпус прямой от колен до головы, пресс напряжён.",
        "Медленно опускайся вперёд, удерживая тело прямым.",
        "Оттолкнись руками внизу и вернись за счёт бицепса бедра."
      ],
      mistakes: ["Сгибание в тазобедренном суставе.", "Слишком быстрое падение.", "Округление спины."]
    },
    en: {
      steps: [
        "Kneel down, anchor your feet or have a partner hold them.",
        "Body straight from knees to head, abs braced.",
        "Lower forward slowly, keeping the body straight.",
        "Push off with the hands at the bottom and return using the hamstrings."
      ],
      mistakes: ["Bending at the hips.", "Dropping too fast.", "Rounding the back."]
    }
  },
  "single-leg-glute-bridge": {
    ru: {
      steps: [
        "Ляг на спину, одна стопа на полу, вторая нога поднята.",
        "Напряги ягодицу опорной ноги.",
        "Подними таз вверх до прямой линии корпуса.",
        "Опусти под контролем, не роняя таз."
      ],
      mistakes: ["Прогиб в пояснице вместо работы ягодиц.", "Перекос таза.", "Рывковый подъём."]
    },
    en: {
      steps: [
        "Lie on your back, one foot on the floor, the other leg raised.",
        "Brace the glute of the supporting leg.",
        "Lift the hips up to a straight line with the torso.",
        "Lower under control without dropping the hips."
      ],
      mistakes: ["Arching the lower back instead of using the glutes.", "Hips tilting to one side.", "Jerky lifting."]
    }
  },
  "barbell-hip-thrust": {
    ru: {
      steps: [
        "Обопрись лопатками о скамью, штанга на бёдрах.",
        "Стопы на полу, колени согнуты ~90°.",
        "Подними таз вверх, напрягая ягодицы, корпус параллелен полу.",
        "Опусти под контролем."
      ],
      mistakes: ["Прогиб поясницы вверху.", "Стопы слишком далеко или близко.", "Запрокидывание головы."]
    },
    en: {
      steps: [
        "Rest your upper back on a bench, barbell across the hips.",
        "Feet on the floor, knees bent to about 90°.",
        "Drive the hips up, squeezing the glutes, torso parallel to the floor.",
        "Lower under control."
      ],
      mistakes: ["Arching the lower back at the top.", "Feet placed too far or too close.", "Throwing the head back."]
    }
  },
  "glute-bridge": {
    ru: {
      steps: [
        "Ляг на спину, стопы на полу, колени согнуты.",
        "Напряги ягодицы и пресс.",
        "Подними таз до прямой линии корпуса.",
        "Опусти под контролем."
      ],
      mistakes: ["Прогиб в пояснице.", "Подъём слишком высоко.", "Рывки."]
    },
    en: {
      steps: [
        "Lie on your back, feet on the floor, knees bent.",
        "Brace the glutes and abs.",
        "Lift the hips to a straight line with the torso.",
        "Lower under control."
      ],
      mistakes: ["Arching the lower back.", "Lifting too high.", "Jerking."]
    }
  },
  "bulgarian-split-squat": {
    ru: {
      steps: [
        "Поставь заднюю ногу на возвышение, передняя — впереди.",
        "Корпус слегка наклонён вперёд, пресс напряжён.",
        "Опустись вниз, сгибая переднюю ногу до ~90°.",
        "Поднимись, толкаясь пяткой передней ноги."
      ],
      mistakes: ["Колено передней ноги уходит далеко за носок.", "Перенос веса на заднюю ногу.", "Завал колена внутрь."]
    },
    en: {
      steps: [
        "Place the rear foot on an elevation, front foot out ahead.",
        "Torso leaned slightly forward, abs braced.",
        "Lower down, bending the front leg to about 90°.",
        "Rise driving through the front heel."
      ],
      mistakes: ["Front knee travelling far past the toes.", "Shifting weight onto the back leg.", "Knee caving inward."]
    }
  },
  "walking-lunge": {
    ru: {
      steps: [
        "Встань прямо, сделай шаг вперёд.",
        "Опустись, пока оба колена не согнутся под ~90°.",
        "Оттолкнись передней ногой и шагни вперёд другой ногой.",
        "Держи корпус вертикальным."
      ],
      mistakes: ["Колено переднее далеко за носок.", "Наклон корпуса вперёд.", "Короткий шаг."]
    },
    en: {
      steps: [
        "Stand tall and take a step forward.",
        "Lower until both knees are bent to about 90°.",
        "Push off the front leg and step forward with the other leg.",
        "Keep the torso upright."
      ],
      mistakes: ["Front knee travelling far past the toes.", "Leaning the torso forward.", "Steps too short."]
    }
  },
  "dumbbell-step-up": {
    ru: {
      steps: [
        "Гантели по бокам, встань перед тумбой.",
        "Поставь стопу на тумбу полностью.",
        "Поднимись, толкаясь пяткой верхней ноги.",
        "Опустись под контролем, не прыгая."
      ],
      mistakes: ["Отталкивание нижней ногой.", "Завал колена внутрь.", "Слишком высокая тумба."]
    },
    en: {
      steps: [
        "Dumbbells at the sides, stand in front of the box.",
        "Place a foot fully on the box.",
        "Rise by driving through the heel of the top leg.",
        "Lower under control, no jumping."
      ],
      mistakes: ["Pushing off with the bottom leg.", "Knee caving inward.", "Box too high."]
    }
  },
  "standing-calf-raise": {
    ru: {
      steps: [
        "Встань носками на возвышение, пятки свободны.",
        "Опусти пятки вниз до растяжения икр.",
        "Поднимись на носки максимально высоко.",
        "Опустись под контролем."
      ],
      mistakes: ["Рывковые подскоки.", "Неполная амплитуда.", "Сгибание колен."]
    },
    en: {
      steps: [
        "Stand with the balls of the feet on an elevation, heels free.",
        "Lower the heels down to a calf stretch.",
        "Rise onto the toes as high as possible.",
        "Lower under control."
      ],
      mistakes: ["Bouncing jerkily.", "Partial range of motion.", "Bending the knees."]
    }
  },
  "seated-calf-raise": {
    ru: {
      steps: [
        "Сядь, валик на нижней части бёдер, носки на платформе.",
        "Опусти пятки вниз до растяжения икр.",
        "Поднимись на носки максимально высоко.",
        "Опустись под контролем."
      ],
      mistakes: ["Малая амплитуда.", "Рывки.", "Быстрый темп без растяжения."]
    },
    en: {
      steps: [
        "Sit down, pad on the lower thighs, toes on the platform.",
        "Lower the heels down to a calf stretch.",
        "Rise onto the toes as high as possible.",
        "Lower under control."
      ],
      mistakes: ["Short range of motion.", "Jerking.", "Fast tempo with no stretch."]
    }
  },
  "bodyweight-calf-raise": {
    ru: {
      steps: [
        "Встань носками на край ступени, пятки свисают.",
        "Опусти пятки до растяжения икр.",
        "Поднимись на носки максимально высоко.",
        "Опустись под контролем."
      ],
      mistakes: ["Неполная амплитуда.", "Подскоки.", "Сгибание колен."]
    },
    en: {
      steps: [
        "Stand with the balls of the feet on a step edge, heels hanging off.",
        "Lower the heels to a calf stretch.",
        "Rise onto the toes as high as possible.",
        "Lower under control."
      ],
      mistakes: ["Partial range of motion.", "Bouncing.", "Bending the knees."]
    }
  },
  "plank": {
    ru: {
      steps: [
        "Упор на предплечья и носки, локти под плечами.",
        "Тело — прямая линия от головы до пяток.",
        "Напряги пресс и ягодицы, дыши ровно.",
        "Удерживай положение заданное время."
      ],
      mistakes: ["Провисание таза.", "Слишком высокий таз.", "Запрокинутая или опущенная голова."]
    },
    en: {
      steps: [
        "Support on the forearms and toes, elbows under the shoulders.",
        "Body in a straight line from head to heels.",
        "Brace the abs and glutes, breathe steadily.",
        "Hold the position for the set time."
      ],
      mistakes: ["Sagging hips.", "Hips piked too high.", "Head dropped or thrown back."]
    }
  },
  "crunch": {
    ru: {
      steps: [
        "Ляг на спину, колени согнуты, стопы на полу.",
        "Руки у висков или на груди.",
        "Скрути корпус, отрывая лопатки от пола.",
        "Опустись под контролем."
      ],
      mistakes: ["Тяга за шею руками.", "Подъём всей спины вместо скручивания.", "Рывки."]
    },
    en: {
      steps: [
        "Lie on your back, knees bent, feet on the floor.",
        "Hands by the temples or on the chest.",
        "Curl the torso, lifting the shoulder blades off the floor.",
        "Lower under control."
      ],
      mistakes: ["Pulling on the neck with the hands.", "Lifting the whole back instead of curling.", "Jerking."]
    }
  },
  "hanging-leg-raise": {
    ru: {
      steps: [
        "Повисни на турнике, плечи опущены.",
        "Напряги пресс, подними прямые ноги вверх.",
        "Слегка скрути таз в верхней точке.",
        "Опусти ноги под контролем без раскачки."
      ],
      mistakes: ["Раскачка корпусом.", "Подъём за счёт инерции.", "Сгибание ног вместо подъёма."]
    },
    en: {
      steps: [
        "Hang from the bar, shoulders depressed.",
        "Brace the abs and raise the straight legs up.",
        "Slightly curl the pelvis at the top.",
        "Lower the legs under control without swinging."
      ],
      mistakes: ["Swinging the body.", "Lifting with momentum.", "Bending the legs instead of raising them."]
    }
  },
  "lying-leg-raise": {
    ru: {
      steps: [
        "Ляг на спину, руки вдоль тела, поясница прижата.",
        "Подними прямые ноги до вертикали.",
        "Опусти ноги под контролем, не касаясь пола.",
        "Поясница прижата к полу всю амплитуду."
      ],
      mistakes: ["Отрыв поясницы от пола.", "Рывки.", "Сгибание ног."]
    },
    en: {
      steps: [
        "Lie on your back, arms at the sides, lower back pressed down.",
        "Raise the straight legs up to vertical.",
        "Lower the legs under control without touching the floor.",
        "Keep the lower back pressed to the floor throughout."
      ],
      mistakes: ["Lower back lifting off the floor.", "Jerking.", "Bending the legs."]
    }
  },
  "cable-crunch": {
    ru: {
      steps: [
        "Встань на колени у верхнего блока, канат у головы.",
        "Скрути корпус вниз, приближая локти к бёдрам.",
        "Напряги пресс в нижней точке.",
        "Вернись под контролем, сохраняя натяжение."
      ],
      mistakes: ["Тяга весом за счёт рук.", "Движение в тазобедренном суставе.", "Округление за счёт спины."]
    },
    en: {
      steps: [
        "Kneel at a high pulley, rope by the head.",
        "Curl the torso down, bringing the elbows toward the thighs.",
        "Squeeze the abs at the bottom.",
        "Return under control, keeping tension."
      ],
      mistakes: ["Pulling the weight with the arms.", "Moving at the hips.", "Rounding from the back."]
    }
  },
  "russian-twist": {
    ru: {
      steps: [
        "Сядь, колени согнуты, корпус отклонён назад.",
        "Держи вес у груди, стопы на полу или на весу.",
        "Поворачивай корпус из стороны в сторону.",
        "Касайся веса пола рядом с бедром."
      ],
      mistakes: ["Поворот только руками без корпуса.", "Округление спины.", "Слишком быстрый темп."]
    },
    en: {
      steps: [
        "Sit down, knees bent, torso leaned back.",
        "Hold a weight at the chest, feet on the floor or raised.",
        "Rotate the torso from side to side.",
        "Tap the weight to the floor beside the hip."
      ],
      mistakes: ["Rotating with the arms only, not the torso.", "Rounding the back.", "Going too fast."]
    }
  },
  "ab-wheel-rollout": {
    ru: {
      steps: [
        "Встань на колени, возьми ролик, руки под плечами.",
        "Напряги пресс и ягодицы, спина нейтральна.",
        "Кати ролик вперёд, удлиняя корпус, не прогибая поясницу.",
        "Усилием пресса верни ролик к коленям."
      ],
      mistakes: ["Прогиб поясницы.", "Уход слишком далеко без контроля.", "Тяга руками вместо пресса."]
    },
    en: {
      steps: [
        "Kneel down, grip the wheel, hands under the shoulders.",
        "Brace the abs and glutes, back neutral.",
        "Roll the wheel forward, extending the body without arching the lower back.",
        "Pull the wheel back to the knees using the abs."
      ],
      mistakes: ["Arching the lower back.", "Rolling too far without control.", "Pulling with the arms instead of the abs."]
    }
  },
  "mountain-climber": {
    ru: {
      steps: [
        "Прими упор лёжа, руки под плечами.",
        "Напряги пресс, корпус — прямая линия.",
        "Поочерёдно подтягивай колени к груди.",
        "Держи таз стабильным, темп ровный."
      ],
      mistakes: ["Подъём таза вверх.", "Провисание поясницы.", "Сутулые плечи."]
    },
    en: {
      steps: [
        "Get into a plank, hands under the shoulders.",
        "Brace the abs, body in a straight line.",
        "Alternately drive the knees toward the chest.",
        "Keep the hips stable, tempo steady."
      ],
      mistakes: ["Hips rising up.", "Lower back sagging.", "Hunched shoulders."]
    }
  }
};
