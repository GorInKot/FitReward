export const en = {
  app: {
    title: "FitReward",
    loading: "Loading...",
    loadingProfile: "Failed to load profile: {error}"
  },
  nav: {
    home: "Home",
    workout: "Workout",
    progress: "Progress",
    plans: "Plans",
    profile: "Profile"
  },
  common: {
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    error: "Error",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    close: "Close",
    edit: "Edit",
    delete: "Delete",
    minutes: "{n} min",
    seconds: "{n} sec",
    weekly: "{n} per week"
  },
  language: {
    title: "Language",
    ru: "Русский",
    en: "English"
  },
  theme: {
    title: "Theme",
    auto: "Auto",
    light: "Light",
    dark: "Dark"
  },
  reminders: {
    title: "Reminders",
    description: "The bot nudges you on training days if you haven't started a workout yet.",
    toggleLabel: "Workout reminders",
    on: "On",
    off: "Off",
    timeLabel: "Reminder time",
    timezoneNote: "Timezone: {tz}"
  },
  weekday: {
    "0": "Sun",
    "1": "Mon",
    "2": "Tue",
    "3": "Wed",
    "4": "Thu",
    "5": "Fri",
    "6": "Sat"
  },
  trainingDays: {
    title: "Training days",
    description: "Pick the weekdays — the bot reminds you to train on those days."
  },
  guide: {
    skip: "Skip",
    done: "Let's go!",
    reopenTitle: "App guide",
    reopenDescription: "A quick tour of the sections — in case you forgot.",
    reopenButton: "Open guide",
    welcome: {
      title: "Welcome to FitReward",
      body: "This is your smart fitness coach: it builds a program around your goal and experience, runs your workouts and adapts the load. Here's a quick tour of what's where."
    },
    home: {
      tag: "Home",
      title: "Home",
      body: "Your day at a glance: the next workout with a start button and your weekly stats. If fatigue builds up, a deload hint appears here."
    },
    workout: {
      tag: "Workout",
      title: "Workout",
      body: "Start a session and log every set: weight, reps and RIR — reps in reserve. Each exercise shows your last result and today's target."
    },
    plans: {
      tag: "Plans",
      title: "Plans",
      body: "Your program by day: picked exercises, sets and rest. You can regenerate it if your goal or conditions change."
    },
    progress: {
      tag: "Progress",
      title: "Progress",
      body: "Body measurements and a weight chart, a 30-day workout calendar and personal records — see how you're moving toward your goal."
    },
    profile: {
      tag: "Profile",
      title: "Profile",
      body: "Personal data, language, bot reminders and redoing onboarding. You can always reopen this guide from here."
    }
  },
  profile: {
    title: "Profile",
    loading: "Loading profile...",
    edit: "Edit",
    fields: {
      firstName: "First name",
      lastName: "Last name",
      age: "Age",
      weight: "Weight (kg)",
      height: "Height (cm)"
    },
    trainingProfile: "Training profile",
    notOnboarded: "Onboarding not completed yet.",
    restartOnboarding: "Redo onboarding",
    startOnboarding: "Start onboarding",
    row: {
      goal: "Goal",
      experience: "Experience",
      frequency: "Frequency",
      environment: "Environment",
      structure: "Structure"
    }
  },
  onboarding: {
    progress: "Step {step} of {total}",
    step1: {
      title: "What's your primary goal?",
      subtitle: "This shapes the entire training program"
    },
    step2: {
      title: "What's your training experience?",
      subtitle: "Determines load and exercise selection"
    },
    step3: {
      title: "How many days per week can you realistically train?",
      subtitle: "Not the ideal — what you can sustain",
      perWeek: "{n} {word} per week",
      day: "day",
      days_few: "days",
      days_many: "days"
    },
    step4: {
      title: "Where do you train?",
      subtitle: "Affects exercise selection"
    },
    step5: {
      title: "Any limitations or injuries?",
      subtitle: "Select all that apply. We'll adapt exercises accordingly"
    },
    submit: "Get recommendation",
    submitting: "Saving...",
    result: {
      done: "Done!",
      recommendTitle: "We recommend: {structure}",
      whyTitle: "Why",
      continue: "Continue"
    }
  },
  goal: {
    MUSCLE_GAIN: "Muscle gain",
    MUSCLE_GAIN_hint: "Hypertrophy, building size",
    FAT_LOSS: "Fat loss",
    FAT_LOSS_hint: "Calorie deficit + training",
    GENERAL_FITNESS: "General fitness",
    GENERAL_FITNESS_hint: "Health and tone",
    STRENGTH: "Strength",
    STRENGTH_hint: "Progress in compound lifts",
    ENDURANCE: "Endurance",
    ENDURANCE_hint: "Cardio and work capacity",
    BODY_RECOMPOSITION: "Body recomposition",
    BODY_RECOMPOSITION_hint: "Fat ↓, muscle ↑ at the same time",
    RETURN_AFTER_BREAK: "Return after break",
    RETURN_AFTER_BREAK_hint: "Ease back into shape"
  },
  experience: {
    NEVER: "Never trained",
    LESS_THAN_6_MONTHS: "Less than 6 months",
    ONE_TO_TWO_YEARS: "1–2 years",
    THREE_PLUS_YEARS: "3+ years"
  },
  environment: {
    GYM: "Gym",
    GYM_hint: "Full access to equipment",
    HOME: "Home",
    HOME_hint: "Dumbbells, barbell, bench",
    HOME_MINIMAL: "Home (minimal gear)",
    HOME_MINIMAL_hint: "Bands, kettlebell, etc.",
    BODYWEIGHT: "Bodyweight only",
    BODYWEIGHT_hint: "No equipment"
  },
  limitation: {
    NONE: "No limitations",
    LOWER_BACK: "Lower back",
    KNEES: "Knees",
    SHOULDERS: "Shoulders",
    POST_INJURY: "Post-injury"
  },
  structure: {
    FULL_BODY: "Full-body",
    UPPER_LOWER: "Upper/Lower",
    PUSH_PULL_LEGS: "Push/Pull/Legs",
    SPLIT: "Body-part split"
  },
  day: {
    full_body: "Full-body",
    upper: "Upper body",
    lower: "Lower body",
    push: "Push (chest/shoulders/triceps)",
    pull: "Pull (back/biceps)",
    legs: "Legs",
    chest: "Chest",
    back: "Back",
    shoulders: "Shoulders",
    arms: "Arms",
    dayN: "Day {n}: {name}"
  },
  slot: {
    compound_press_chest: "Compound press (chest)",
    compound_pull_lats: "Compound pull (lats)",
    horizontal_row_upper_back: "Horizontal row (upper back)",
    horizontal_press_chest: "Horizontal press (chest)",
    incline_press_upper_chest: "Incline press (upper chest)",
    overhead_press_shoulders: "Overhead press (shoulders)",
    vertical_pull_lats: "Pull-up / lat pulldown",
    lat_pulldown: "Lat pulldown",
    squat_quads: "Squat (quads)",
    hinge_hamstrings: "Hip hinge (hamstrings)",
    lunge_glutes: "Lunge (glutes)",
    hamstring_curl: "Leg curl (hamstrings)",
    leg_extension: "Leg extension (quads)",
    calf_raise: "Calf raise",
    core_abs: "Core",
    biceps_isolation: "Biceps curl",
    triceps_isolation: "Triceps extension",
    triceps_pushdown: "Triceps pushdown",
    triceps_overhead: "Overhead triceps extension",
    rear_delt: "Rear delt",
    lateral_raise: "Lateral raise",
    front_raise: "Front raise",
    upright_row: "Upright row",
    shrugs: "Shrugs",
    face_pull_rear_delt: "Face pull",
    hammer_curl: "Hammer curl",
    incline_curl: "Incline curl",
    barbell_curl: "Barbell curl",
    chest_fly: "Chest fly",
    dips_chest: "Dips (chest)",
    dips_triceps: "Dips (triceps)",
    cable_crossover: "Cable crossover",
    deadlift_or_bent_row: "Deadlift / bent-over row"
  },
  reason: {
    full_body_low_frequency: "{days} workouts/week is the sweet spot for full-body",
    full_body_muscle_coverage: "Each muscle group hit 2–3 times per week",
    beginner_needs_frequent_practice: "Beginners need frequent practice of the basic movements",
    upper_lower_four_days: "4 days/week splits neatly into upper and lower",
    upper_lower_twice_per_part: "Each body part gets 2 training days",
    upper_lower_transition: "Upper/Lower is a smooth step up from full-body",
    beginner_high_frequency_risk: "At the beginner level, 5+ workouts/week risks overtraining",
    beginner_fallback_full_body: "Full-body with 1–2 rest days is recommended instead",
    advanced_split: "3+ years of experience and 5–6 days allow a classic body-part split",
    split_max_focus: "Each muscle group gets a dedicated, focused day",
    ppl_intermediate_balance: "At intermediate level with high frequency, Push/Pull/Legs balances volume and recovery",
    ppl_twice_per_group: "Each muscle group is trained twice per week with a different emphasis",
    universal_fallback: "Solid default across most training levels"
  },
  workout: {
    loading: "Loading...",
    readyTitle: "Ready to train?",
    nextDay: "Up next: {name}",
    start: "Start workout",
    starting: "Starting...",
    noProgram: "No program yet. Generate one on the Plans tab.",
    openPlans: "Open plans",
    activeSession: "Active workout",
    progress: "Progress: {done}/{total} exercises",
    abandon: "Abandon",
    finish: "Finish workout",
    abandonConfirm: "Abandon this workout? Logged sets will stay as incomplete.",
    restDayConfirm: "Today is a rest day — it's not in your training schedule. Start anyway?",
    completion: {
      title: "How did it feel?",
      subtitle: "Rate overall fatigue from 1 to 10",
      submit: "Finish",
      submitting: "Saving..."
    },
    exercise: {
      setN: "Set {n}",
      logSet: "Log set {n}",
      complete: "Mark done",
      saving: "...",
      restMin: "rest {n} min",
      restSec: "rest {n} sec",
      suggested: "{sets} × {reps} · {rest}",
      weightLabel: "Weight (kg)",
      repsLabel: "Reps",
      rirLabel: "RIR (reps in reserve)",
      errorLog: "Couldn't log the set",
      errorDelete: "Couldn't delete",
      errorComplete: "Couldn't complete"
    },
    rir: {
      "0": "0 (to failure)",
      "1": "1 in reserve",
      "2": "2 in reserve",
      "3": "3 in reserve",
      "5": "Too easy"
    }
  },
  plans: {
    loading: "Loading program...",
    notFoundTitle: "No program yet",
    notFoundSubtitle: "Looks like the program hasn't been generated. Let's create one.",
    generate: "Generate program",
    generating: "Creating...",
    activeProgram: "Active program",
    daysPerWeek: "{n} days per week",
    regenerate: "Regenerate program",
    regenerating: "Regenerating...",
    errorRegenerate: "Couldn't regenerate the program",
    errorLoad: "Couldn't load the program",
    suggested: "{sets} × {reps}",
    setExtra: "Rest: {rest} · {equipment}"
  },
  home: {
    greeting: "Hi!",
    nextWorkout: "Up next: {name}",
    noProgram: "Generate a program on the Plans tab",
    startWorkout: "Start workout",
    statSessions: "Sessions this week",
    statStreak: "Streak",
    statVolume: "Volume, kg·reps",
    streakDays: "{n}d",
    weekTitle: "This week"
  },
  progress: {
    title: "Progress",
    statSessions: "Total sessions",
    statStreak: "Streak",
    statWeekVolume: "Volume this week",
    weightTitle: "Weight history",
    weightEmpty: "Add your first measurement below",
    addMetric: "Add measurement",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving...",
    weightLabel: "Weight (kg)",
    bodyFatLabel: "Body fat (%)",
    notesLabel: "Note",
    deleteConfirm: "Delete this entry?",
    calendarTitle: "Last 30 days",
    prTitle: "Personal records",
    prEmpty: "Log a set with weight — PRs will appear here",
    prValue: "{weight} × {reps}",
    historyTitle: "Measurements",
    historyEmpty: "Empty for now",
    loadFailed: "Failed to load progress"
  },
  unit: {
    kg: "kg",
    reps: "reps"
  },
  equipment: {
    BARBELL: "Barbell",
    DUMBBELL: "Dumbbell",
    KETTLEBELL: "Kettlebell",
    MACHINE: "Machine",
    CABLE: "Cable",
    BODYWEIGHT: "Bodyweight",
    RESISTANCE_BAND: "Band",
    BENCH: "Bench",
    PULL_UP_BAR: "Pull-up bar",
    GYMNASTIC_RINGS: "Rings",
    SWISS_BALL: "Swiss ball",
    OTHER: "Other"
  },
  muscle: {
    CHEST: "Chest",
    UPPER_BACK: "Upper back",
    LATS: "Lats",
    LOWER_BACK: "Lower back",
    SHOULDERS_FRONT: "Front delts",
    SHOULDERS_SIDE: "Side delts",
    SHOULDERS_REAR: "Rear delts",
    BICEPS: "Biceps",
    TRICEPS: "Triceps",
    FOREARMS: "Forearms",
    QUADS: "Quads",
    HAMSTRINGS: "Hamstrings",
    GLUTES: "Glutes",
    CALVES: "Calves",
    ABS: "Abs",
    OBLIQUES: "Obliques"
  },
  exerciseGuide: {
    technique: "Technique",
    mistakes: "Common mistakes",
    loading: "Loading...",
    noGuide: "A guide for this exercise isn't available yet."
  },
  achievement: {
    sectionTitle: "Achievements",
    locked: "🔒",
    rewardSuffix: "+{n} ⭐",
    progress: "{unlocked}/{total}",
    toastTitle: "Achievement unlocked!",
    onboarding_complete: { title: "Started the journey", description: "Completed onboarding" },
    first_workout: { title: "First workout", description: "Finished your first session" },
    streak_3: { title: "Three in a row", description: "3 days of training without skipping" },
    streak_7: { title: "Week in the zone", description: "7 consecutive training days" },
    sessions_10: { title: "Tenner", description: "10 completed workouts" },
    sessions_30: { title: "Consistency", description: "30 completed workouts" },
    first_metric: { title: "First measurement", description: "Logged your body metrics" },
    first_pr: { title: "First load", description: "Logged a set with weight" },
    volume_10000: { title: "Weekly tonnage", description: "10,000 kg·reps over 7 days" },
    program_week_complete: { title: "Perfect plan week", description: "Hit every planned session of the week" }
  },
  fatigue: {
    bannerTitle: "You look fatigued",
    bannerHint: "Consider a deload week or an extra rest day.",
    high_fatigue_streak: "Your last {n} sessions all rated 8+ on fatigue",
    rir_dropping: "On '{slot}' the same weight is feeling harder — RIR keeps dropping",
    slotFallback: "one of the exercises"
  },
  reps: {
    range: "{low}–{high}",
    single: "{value}"
  },
  progression: {
    lastTime: "Last: {weight}{reps}{rir}",
    lastNoWeight: "{reps}",
    lastWithRir: " · RIR {rir}",
    suggestionHeader: "Today's target",
    suggestionWeightReps: "{weight} × {reps}",
    suggestionReps: "{reps} reps",
    first_time: "First time — start light",
    repeat_last: "Repeat last performance",
    hold: "Hold the weight (RIR is on target)",
    add_weight: "RIR was high — add a bit of weight",
    push_reps: "RIR was very low — add one rep",
    double_progression: "Hit top of the range — small weight bump",
    too_easy: "Was too easy last time — meaningful weight bump"
  }
};
