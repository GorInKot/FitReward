export const ru = {
  app: {
    title: "FitReward",
    loading: "Загрузка...",
    loadingProfile: "Не удалось загрузить профиль: {error}"
  },
  nav: {
    home: "Главная",
    workout: "Тренировка",
    progress: "Прогресс",
    plans: "Планы",
    profile: "Профиль"
  },
  common: {
    save: "Сохранить",
    saving: "Сохранение...",
    cancel: "Отмена",
    back: "Назад",
    next: "Далее",
    error: "Ошибка",
    confirm: "Подтвердить",
    yes: "Да",
    no: "Нет",
    close: "Закрыть",
    edit: "Редактировать",
    delete: "Удалить",
    minutes: "{n} мин",
    seconds: "{n} сек",
    weekly: "{n} раз в неделю"
  },
  language: {
    title: "Язык",
    ru: "Русский",
    en: "English"
  },
  theme: {
    title: "Тема",
    auto: "Авто",
    light: "Светлая",
    dark: "Тёмная"
  },
  reminders: {
    title: "Напоминания",
    description: "Бот напомнит в тренировочный день, если ты ещё не начал тренировку.",
    toggleLabel: "Напоминания о тренировках",
    on: "Вкл",
    off: "Выкл",
    timeLabel: "Время напоминания",
    timezoneNote: "Часовой пояс: {tz}"
  },
  weekday: {
    "0": "Вс",
    "1": "Пн",
    "2": "Вт",
    "3": "Ср",
    "4": "Чт",
    "5": "Пт",
    "6": "Сб"
  },
  trainingDays: {
    title: "Дни тренировок",
    description: "Отметь дни недели — по ним бот напомнит о тренировке."
  },
  guide: {
    skip: "Пропустить",
    done: "Поехали!",
    reopenTitle: "Гид по приложению",
    reopenDescription: "Краткий обзор разделов — если что-то забылось.",
    reopenButton: "Открыть гид",
    welcome: {
      title: "Добро пожаловать в FitReward",
      body: "Это твой умный фитнес-тренер: он сам подбирает программу под цель и опыт, ведёт тренировки и подстраивает нагрузку. Коротко покажем, что где находится."
    },
    home: {
      tag: "Главная",
      title: "Главная",
      body: "Обзор дня: следующая тренировка с кнопкой запуска и статистика за неделю. Если накопится усталость — здесь появится подсказка о разгрузке."
    },
    workout: {
      tag: "Тренировка",
      title: "Тренировка",
      body: "Запускай сессию и логируй каждый сет: вес, повторения и RIR — запас повторений. Под упражнением видно прошлый результат и цель на сегодня."
    },
    plans: {
      tag: "Планы",
      title: "Планы",
      body: "Твоя программа по дням: подобранные упражнения, подходы и отдых. Программу можно пересоздать, если изменились цель или условия."
    },
    progress: {
      tag: "Прогресс",
      title: "Прогресс",
      body: "Замеры тела и график веса, календарь тренировок за 30 дней и личные рекорды — видно, как ты двигаешься к цели."
    },
    profile: {
      tag: "Профиль",
      title: "Профиль",
      body: "Личные данные, язык, напоминания от бота и повторный онбординг. Этот гид всегда можно открыть отсюда снова."
    }
  },
  profile: {
    title: "Профиль",
    loading: "Профиль загружается...",
    edit: "Редактировать",
    fields: {
      firstName: "Имя",
      lastName: "Фамилия",
      age: "Возраст",
      weight: "Вес (кг)",
      height: "Рост (см)"
    },
    trainingProfile: "Тренировочный профиль",
    notOnboarded: "Онбординг ещё не пройден.",
    restartOnboarding: "Пройти онбординг заново",
    startOnboarding: "Пройти онбординг",
    row: {
      goal: "Цель",
      experience: "Опыт",
      frequency: "Частота",
      environment: "Среда",
      structure: "Структура"
    }
  },
  onboarding: {
    progress: "Шаг {step} из {total}",
    step1: {
      title: "Какая твоя главная цель?",
      subtitle: "От этого зависит вся программа тренировок"
    },
    step2: {
      title: "Какой у тебя опыт тренировок?",
      subtitle: "Подберём подходящую нагрузку и упражнения"
    },
    step3: {
      title: "Сколько дней в неделю реально готов тренироваться?",
      subtitle: "Не идеал — а то, что выдержишь стабильно",
      perWeek: "{n} {word} в неделю",
      day: "день",
      days_few: "дня",
      days_many: "дней"
    },
    step4: {
      title: "Где будешь тренироваться?",
      subtitle: "От этого зависит подбор упражнений"
    },
    step5: {
      title: "Есть ли ограничения?",
      subtitle: "Отметь все, что подходит. Подберём упражнения с учётом этого"
    },
    submit: "Получить рекомендацию",
    submitting: "Сохраняем...",
    result: {
      done: "Готово!",
      recommendTitle: "Мы рекомендуем: {structure}",
      whyTitle: "Почему",
      continue: "Продолжить"
    }
  },
  goal: {
    MUSCLE_GAIN: "Набор мышц",
    MUSCLE_GAIN_hint: "Гипертрофия, увеличение объёма",
    FAT_LOSS: "Снижение веса",
    FAT_LOSS_hint: "Дефицит калорий + тренировки",
    GENERAL_FITNESS: "Общая форма",
    GENERAL_FITNESS_hint: "Здоровье и тонус",
    STRENGTH: "Сила",
    STRENGTH_hint: "Прирост в базовых движениях",
    ENDURANCE: "Выносливость",
    ENDURANCE_hint: "Кардио и работоспособность",
    BODY_RECOMPOSITION: "Рекомпозиция",
    BODY_RECOMPOSITION_hint: "Жир ↓, мышцы ↑ одновременно",
    RETURN_AFTER_BREAK: "Возврат к тренировкам",
    RETURN_AFTER_BREAK_hint: "Мягко вернуться в форму"
  },
  experience: {
    NEVER: "Никогда не тренировался",
    LESS_THAN_6_MONTHS: "Меньше 6 месяцев",
    ONE_TO_TWO_YEARS: "1–2 года",
    THREE_PLUS_YEARS: "3+ года"
  },
  environment: {
    GYM: "Спортзал",
    GYM_hint: "Полный доступ к оборудованию",
    HOME: "Дома",
    HOME_hint: "Гантели, штанга, скамья",
    HOME_MINIMAL: "Дома с минимумом",
    HOME_MINIMAL_hint: "Резинки, гири, эспандер",
    BODYWEIGHT: "Только своё тело",
    BODYWEIGHT_hint: "Без оборудования"
  },
  limitation: {
    NONE: "Нет ограничений",
    LOWER_BACK: "Поясница",
    KNEES: "Колени",
    SHOULDERS: "Плечи",
    POST_INJURY: "После травмы"
  },
  structure: {
    FULL_BODY: "Full-body",
    UPPER_LOWER: "Upper/Lower",
    PUSH_PULL_LEGS: "Push/Pull/Legs",
    SPLIT: "Классический сплит"
  },
  day: {
    full_body: "Full-body",
    upper: "Верх тела",
    lower: "Низ тела",
    push: "Push (грудь/плечи/трицепс)",
    pull: "Pull (спина/бицепс)",
    legs: "Ноги",
    chest: "Грудь",
    back: "Спина",
    shoulders: "Плечи",
    arms: "Руки",
    dayN: "День {n}: {name}"
  },
  slot: {
    compound_press_chest: "Жим (грудь)",
    compound_pull_lats: "Тяга (широчайшие)",
    horizontal_row_upper_back: "Тяга горизонтальная (верх спины)",
    horizontal_press_chest: "Жим горизонтальный (грудь)",
    incline_press_upper_chest: "Жим наклонный (верх груди)",
    overhead_press_shoulders: "Жим над головой (плечи)",
    vertical_pull_lats: "Подтягивания/тяга сверху (широчайшие)",
    lat_pulldown: "Тяга на низ (широчайшие)",
    squat_quads: "Присед (квадрицепс)",
    hinge_hamstrings: "Тяга бёдрами (заднее бедро)",
    lunge_glutes: "Выпады (ягодицы)",
    hamstring_curl: "Сгибание ног (заднее бедро)",
    leg_extension: "Разгибание ног (квадрицепс)",
    calf_raise: "Икры",
    core_abs: "Корпус",
    biceps_isolation: "Сгибание на бицепс",
    triceps_isolation: "Разгибание на трицепс",
    triceps_pushdown: "Трицепс на блоке",
    triceps_overhead: "Трицепс из-за головы",
    rear_delt: "Задняя дельта",
    lateral_raise: "Махи в стороны",
    front_raise: "Махи перед собой",
    upright_row: "Тяга к подбородку",
    shrugs: "Шраги",
    face_pull_rear_delt: "Тяга к лицу",
    hammer_curl: "Молотки на бицепс",
    incline_curl: "Бицепс на наклонной",
    barbell_curl: "Сгибание со штангой",
    chest_fly: "Разводка (грудь)",
    dips_chest: "Отжимания на брусьях (грудь)",
    dips_triceps: "Отжимания на брусьях (трицепс)",
    cable_crossover: "Кроссовер на блоке",
    deadlift_or_bent_row: "Становая тяга / тяга в наклоне"
  },
  reason: {
    full_body_low_frequency: "{days} тренировок в неделю — оптимальная частота для full-body",
    full_body_muscle_coverage: "Каждая мышечная группа прорабатывается 2–3 раза в неделю",
    beginner_needs_frequent_practice: "Новичкам важна частая практика базовых движений",
    upper_lower_four_days: "4 тренировки в неделю удобно делить на верх и низ тела",
    upper_lower_twice_per_part: "Каждая часть тела получает 2 тренировочных дня",
    upper_lower_transition: "Upper/Lower — мягкий переход от full-body для растущего объёма",
    beginner_high_frequency_risk: "Для уровня «новичок» 5+ тренировок в неделю — высокий риск перетренированности",
    beginner_fallback_full_body: "Рекомендуем full-body с возможностью 1–2 дней отдыха",
    advanced_split: "Опыт 3+ года + 5–6 дней позволяет использовать классический сплит",
    split_max_focus: "Каждая мышечная группа — максимум фокуса в свой день",
    ppl_intermediate_balance: "При среднем опыте и высокой частоте Push/Pull/Legs даёт баланс объёма и восстановления",
    ppl_twice_per_group: "Каждая группа мышц 2 раза в неделю с разным акцентом",
    universal_fallback: "Универсальный выбор для большинства уровней подготовки"
  },
  workout: {
    loading: "Загрузка...",
    readyTitle: "Готов к тренировке?",
    nextDay: "Следующая: {name}",
    start: "Начать тренировку",
    starting: "Начинаем...",
    noProgram: "Программа не найдена. Создай её на вкладке «Планы».",
    openPlans: "Открыть планы",
    activeSession: "Активная тренировка",
    progress: "Прогресс: {done}/{total} упражнений",
    abandon: "Прервать",
    finish: "Завершить тренировку",
    abandonConfirm: "Прервать тренировку? Записанные сеты сохранятся как незавершённые.",
    restDayConfirm: "Сегодня выходной — этого дня нет в твоём расписании тренировок. Точно хочешь начать?",
    completion: {
      title: "Как ощущения?",
      subtitle: "Оцени общую усталость от 1 до 10",
      submit: "Завершить",
      submitting: "Сохраняем..."
    },
    exercise: {
      setN: "Сет {n}",
      logSet: "Записать сет {n}",
      complete: "Завершить упр.",
      saving: "...",
      restMin: "отдых {n} мин",
      restSec: "отдых {n} сек",
      suggested: "{sets} × {reps} · {rest}",
      weightLabel: "Вес (кг)",
      repsLabel: "Повторения",
      rirLabel: "RIR (повторений в запасе)",
      errorLog: "Не удалось записать сет",
      errorDelete: "Не удалось удалить",
      errorComplete: "Не удалось"
    },
    rir: {
      "0": "0 (на отказ)",
      "1": "1 в запасе",
      "2": "2 в запасе",
      "3": "3 в запасе",
      "5": "Слишком легко"
    }
  },
  plans: {
    loading: "Загрузка программы...",
    notFoundTitle: "Программа не найдена",
    notFoundSubtitle: "Похоже, программа ещё не создана. Сгенерируем её сейчас.",
    generate: "Сгенерировать программу",
    generating: "Создаём...",
    activeProgram: "Активная программа",
    daysPerWeek: "{n} дней в неделю",
    regenerate: "Пересоздать программу",
    regenerating: "Пересоздаём...",
    errorRegenerate: "Не удалось пересоздать программу",
    errorLoad: "Не удалось загрузить программу",
    suggested: "{sets} × {reps}",
    setExtra: "Отдых: {rest} · {equipment}"
  },
  home: {
    greeting: "Привет!",
    nextWorkout: "Следующая: {name}",
    noProgram: "Создай программу на вкладке «Планы»",
    startWorkout: "Начать тренировку",
    statSessions: "Тренировок за неделю",
    statStreak: "Серия",
    statVolume: "Объём, кг·повт",
    streakDays: "{n} дн.",
    weekTitle: "Эта неделя"
  },
  progress: {
    title: "Прогресс",
    statSessions: "Всего тренировок",
    statStreak: "Серия",
    statWeekVolume: "Объём за неделю",
    weightTitle: "История веса",
    weightEmpty: "Добавь свой первый замер ниже",
    addMetric: "Добавить замер",
    cancel: "Отмена",
    save: "Сохранить",
    saving: "Сохраняем...",
    weightLabel: "Вес (кг)",
    bodyFatLabel: "Жир (%)",
    notesLabel: "Заметка",
    deleteConfirm: "Удалить запись?",
    calendarTitle: "Последние 30 дней",
    prTitle: "Личные рекорды",
    prEmpty: "Залогируй сет с весом — здесь появятся PR",
    prValue: "{weight} × {reps}",
    historyTitle: "История замеров",
    historyEmpty: "Пока пусто",
    loadFailed: "Не удалось загрузить прогресс"
  },
  unit: {
    kg: "кг",
    reps: "повт"
  },
  equipment: {
    BARBELL: "Штанга",
    DUMBBELL: "Гантели",
    KETTLEBELL: "Гиря",
    MACHINE: "Тренажёр",
    CABLE: "Блок",
    BODYWEIGHT: "Своё тело",
    RESISTANCE_BAND: "Резина",
    BENCH: "Скамья",
    PULL_UP_BAR: "Турник",
    GYMNASTIC_RINGS: "Кольца",
    SWISS_BALL: "Фитбол",
    OTHER: "Другое"
  },
  muscle: {
    CHEST: "Грудь",
    UPPER_BACK: "Верх спины",
    LATS: "Широчайшие",
    LOWER_BACK: "Поясница",
    SHOULDERS_FRONT: "Передняя дельта",
    SHOULDERS_SIDE: "Средняя дельта",
    SHOULDERS_REAR: "Задняя дельта",
    BICEPS: "Бицепс",
    TRICEPS: "Трицепс",
    FOREARMS: "Предплечья",
    QUADS: "Квадрицепс",
    HAMSTRINGS: "Бицепс бедра",
    GLUTES: "Ягодицы",
    CALVES: "Икры",
    ABS: "Пресс",
    OBLIQUES: "Косые мышцы"
  },
  exerciseGuide: {
    technique: "Техника",
    mistakes: "Частые ошибки",
    loading: "Загрузка...",
    noGuide: "Описание этого упражнения пока недоступно."
  },
  achievement: {
    sectionTitle: "Достижения",
    locked: "🔒",
    rewardSuffix: "+{n} ⭐",
    progress: "{unlocked}/{total}",
    toastTitle: "Получено достижение!",
    onboarding_complete: { title: "Старт пути", description: "Прошёл онбординг" },
    first_workout: { title: "Первая тренировка", description: "Завершил свою первую сессию" },
    streak_3: { title: "Три дня подряд", description: "3 дня тренировок без пропусков" },
    streak_7: { title: "Неделя в режиме", description: "7 дней подряд с тренировками" },
    sessions_10: { title: "Десятка", description: "10 завершённых тренировок" },
    sessions_30: { title: "Постоянство", description: "30 завершённых тренировок" },
    first_metric: { title: "Первый замер", description: "Зафиксировал параметры тела" },
    first_pr: { title: "Первая нагрузка", description: "Залогал сет с весом" },
    volume_10000: { title: "Тоннаж недели", description: "10 000 кг·повт за 7 дней" },
    program_week_complete: { title: "План на отлично", description: "Выполнил все тренировки недели" }
  },
  fatigue: {
    bannerTitle: "Похоже, накопилась усталость",
    bannerHint: "Подумай о неделе с пониженной нагрузкой или дополнительном дне отдыха.",
    high_fatigue_streak: "Последние {n} тренировки оценены на 8+ по усталости",
    rir_dropping: "В упражнении «{slot}» становится тяжелее тот же вес: RIR падает",
    slotFallback: "одно из упражнений"
  },
  reps: {
    range: "{low}–{high}",
    single: "{value}"
  },
  progression: {
    lastTime: "Прошлая: {weight}{reps}{rir}",
    lastNoWeight: "{reps}",
    lastWithRir: " · RIR {rir}",
    suggestionHeader: "Цель сегодня",
    suggestionWeightReps: "{weight} × {reps}",
    suggestionReps: "{reps} повторений",
    first_time: "Первая тренировка — стартуй с лёгкого",
    repeat_last: "Повтори прошлый результат",
    hold: "Держим вес (RIR в зоне)",
    add_weight: "RIR был большим — добавь немного веса",
    push_reps: "RIR близко к нулю — добавь 1 повтор",
    double_progression: "Дошёл до верха диапазона — небольшой шаг вверх по весу",
    too_easy: "Слишком легко прошлый раз — серьёзный шаг по весу"
  }
};
