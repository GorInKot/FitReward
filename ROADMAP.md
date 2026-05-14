# FitReward — Roadmap

Чек-лист по разработке FitReward как **умного фитнес-тренера** (не generic workout tracker).
Продуктовое видение: пользователь не выбирает методологию тренировок (Full-body/Split) — система рекомендует её сама на основе ответов в онбординге и адаптируется по ходу занятий.

Отмечай выполненные задачи как `[x]`. Каждая фаза заканчивается деплоем в прод и проверкой в Telegram.

---

## Фаза 1. Безопасность профиля (P0) — ✅ ВЫПОЛНЕНО (2026-05-14)

- [x] Middleware `requireTelegramAuth` с валидацией HMAC + `auth_date` (24ч)
- [x] Dev-bypass через `ALLOW_DEV_AUTH=true` для локальной разработки
- [x] Рефакторинг `/api/profile/:telegramId` → `/api/profile/me`
- [x] Фронт автоматически шлёт `X-Telegram-Init-Data`
- [x] Прод-проверка в Telegram

---

## Фаза 2. Онбординг + рекомендация структуры тренировок (P0) — ✅ ВЫПОЛНЕНО (2026-05-14)

Первый раз заходит пользователь — проходит 5-шаговый wizard → система рекомендует Full-body/Upper-Lower/PPL/Split с обоснованием.

### Backend
- [x] Переписать `prisma/schema.prisma` с нуля:
  - [x] Расширить `User` полями онбординга + `recommendedStructure`, `recommendationReasons`, `onboardingCompletedAt`
  - [x] Новые enums: `PrimaryGoal`, `ExperienceLevel`, `TrainingEnvironment`, `Limitation`, `TrainingStructure`
  - [x] Удалить старые модели `Workout`, `Exercise`, `Progress`, `Achievement`, `UserAchievement`
  - [x] Удалить старые enums `FitnessLevel`, `Goal`, `WorkoutType`, `ExerciseType`, `AchievementType`
- [x] Миграция `20260514_onboarding_redesign` (drop + recreate)
- [x] Удалить старые роуты-заглушки `/api/workouts`, `/api/progress`, `/api/plans`, `/api/achievements`
- [x] `POST /api/onboarding` + `POST /api/onboarding/preview` с Zod-валидацией
- [x] `GET /api/profile/me` расширен флагом `onboardingCompleted` и новыми полями
- [x] Чистая функция `recommendTrainingStructure` в `services/trainingRecommendation.ts`

### Frontend
- [x] Маршрут `/onboarding` с компонентом-wizard (5 шагов + result screen)
- [x] Прогресс-бар шагов, валидация на каждом
- [x] Экран рекомендации с обоснованием
- [x] Zustand `profileStore` для общего состояния (избегает race condition при редиректе)
- [x] Логика: `!profile.onboardingCompleted` → редирект на `/onboarding`
- [x] Profile.tsx переписан под новые поля
- [x] Кнопка «Пройти онбординг заново» в Profile

### Тест
- [x] Локально: typecheck чистый, API preview/profile работают (submit упадёт без БД — это OK)
- [x] Прод: пройти онбординг в Telegram, проверить сохранение, проверить, что повторный вход не редиректит
- [x] Bugfix: serializeProfile() вынесен в общий хелпер, чтобы `/api/onboarding` тоже возвращал `onboardingCompleted` (без него фронт вечно редиректил на онбординг)

---

## Фаза 3. Каталог упражнений из публичного датасета (P1) — 🟡 КОД ГОТОВ, ОЖИДАЕТ SEED

Импорт wger.de open dataset → нормализация → таблица `ExerciseCatalog`.

- [x] Prisma модель `ExerciseCatalog` (slug, nameEn/nameRu, category, muscles, equipment, difficulty, instructions, imageUrl, source/sourceId)
- [x] Новые enums: `MovementCategory`, `MuscleGroup`, `Equipment`, `Difficulty`
- [x] Миграция `20260514_exercise_catalog`
- [x] Скрипт `backend/scripts/seed-exercises.ts`:
  - [x] Постранично выгружает `/api/v2/exerciseinfo/` (limit=100)
  - [x] Маппинг wger categories/muscles/equipment → наши enums
  - [x] Извлекает английское и русское название из translations (language=2 и 7)
  - [x] HTML-stripping инструкций, slug-генерация
  - [x] Идемпотентный `createMany({ skipDuplicates: true })`
- [x] `GET /api/exercises?category=&equipment=&muscle=&search=&limit=&offset=` с пагинацией
- [x] `GET /api/exercises/:slug` для одной записи
- [x] `npm run seed:exercises -w backend` для запуска
- [ ] Запустить seed против Neon (документация в коммите)
- [ ] Проверить выдачу API в проде

---

## Фаза 4. Генератор программы из шаблонов (P1) — ✅ ВЫПОЛНЕНО (2026-05-14)

На основе `recommendedStructure` собираем недельный план: список тренировочных дней с подобранными упражнениями.

### Backend
- [x] Prisma модели: `Program`, `ProgramDay`, `ProgramExerciseSlot`, enum `ProgramStatus`
- [x] Миграция `20260514_program_tables`
- [x] Шаблоны слотов на структуру (`services/programTemplates.ts`): Full-body, Upper, Lower, Push, Pull, Legs, Chest, Back, Shoulders, Arms
- [x] Goal-based рецептура `services/prescription.ts` (compound vs isolation, под цель)
- [x] Адаптивное число упражнений от опыта (4/5/6/7)
- [x] Фильтры окружения и ограничений `services/equipmentFilters.ts`:
  - Маппинг GYM/HOME/HOME_MINIMAL/BODYWEIGHT → доступное оборудование
  - LOWER_BACK ограничение → исключает упражнения с primaryMuscle=LOWER_BACK
  - POST_INJURY → ограничивает difficulty до BEGINNER
  - SHOULDERS/KNEES — задокументировано как known limitation (требует тэгов на упражнениях)
- [x] Генератор `services/programGenerator.ts`:
  - Цикл шаблонов дней под `trainingDaysPerWeek`
  - Скоринг кандидатов по difficulty + equipment + match с primaryMuscle
  - Дедупликация slugs внутри программы (разные упражнения в разные дни)
  - Транзакционное сохранение с архивированием предыдущей программы
- [x] `POST /api/program/generate`, `POST /api/program/regenerate`, `GET /api/program/current`
- [x] Авто-генерация программы после успешного онбординга (best-effort, не блокирует ответ)

### Frontend
- [x] Расширены API-типы (Program/Day/Slot)
- [x] `Plans.tsx` переписан: показывает структуру, дни (tabs), упражнения с подсказками sets × reps + отдых
- [x] Кнопка «Пересоздать программу»

### Тест
- [x] Прод: после онбординга открыть «Планы» → должна быть программа
- [x] Кнопка «Пересоздать» работает

---

## Фаза 5. Логирование тренировки (P1) — 🟡 КОД ГОТОВ, ОЖИДАЕТ ПРОДА

Запуск тренировки → лог сетов с весом/повторениями/RIR → завершение.

### Backend
- [x] Prisma модели: `WorkoutSession`, `SessionExercise` (snapshot of slot), `SetLog`
- [x] Миграция `20260514_workout_sessions`
- [x] `POST /api/sessions` (start from programDayId, snapshots exercises)
- [x] `GET /api/sessions/active` / `GET /api/sessions` / `GET /api/sessions/:id`
- [x] `POST /api/sessions/:id/sets` (Zod-валидация, проверка владельца)
- [x] `DELETE /api/sessions/:id/sets/:setId` (удалить ошибочный сет)
- [x] `POST /api/sessions/:id/exercises/complete` (отметить упражнение завершённым)
- [x] `PATCH /api/sessions/:id/complete` (perceivedFatigue 1–10, notes)
- [x] `DELETE /api/sessions/:id` (abandon active session)
- [x] `GET /api/sessions/program/next-day` (следующий день на основе истории)

### Frontend
- [x] API-клиент `getActiveSession`, `getNextProgramDay`, `startSession`, `logSet`, `deleteSet`, `completeExercise`, `completeSession`, `abandonSession`
- [x] Полная переписка `Workout.tsx`:
  - [x] Состояние «нет активной сессии»: показывает следующий день + кнопка «Начать»
  - [x] Состояние «активная сессия»: прогресс-бар, карточки упражнений (collapsible)
  - [x] Внутри упражнения: список залогированных сетов с возможностью удалить + форма «вес / повторения / RIR»
  - [x] Кнопка «Завершить упр.» помечает упражнение выполненным
  - [x] Завершение сессии: экран «оцени усталость 1–10» → PATCH → редирект на «Прогресс»
  - [x] Кнопка «Прервать» (с confirm) удаляет сессию
- [ ] Bot: напоминания о следующей тренировке (вынесено в Фазу 11)

### Тест
- [ ] Прод: открыть «Тренировка» → начать сессию → залогать пару сетов → завершить → проверить, что сессия исчезла из активных

---

## Фаза 6. Адаптивная прогрессия (P1)

После каждой сессии корректировать веса/повторения для следующего раза.

- [ ] Алгоритм в `services/progressionEngine.ts`:
  - [ ] RIR 0–1 на последнем сете → увеличить вес на 2.5–5%
  - [ ] RIR 3+ → текущий вес слишком лёгкий → повысить
  - [ ] RIR 2 → держать
  - [ ] «Слишком легко» → +10%
  - [ ] Учёт типа упражнения: компаунды растут быстрее
- [ ] При завершении сессии → пересчёт `ProgramDay.exercises[].suggestedWeight` для следующего цикла
- [ ] Детект плато: 3 сессии подряд без роста → флаг + предложение deload
- [ ] Frontend: показывать «↑ Вес повышен по сравнению с прошлой тренировкой»

---

## Фаза 7. Progress tracking (P1)

Замеры тела, история, графики, метрики.

- [ ] Prisma модель `BodyMetric` (id, userId, date, weight, bodyFat, measurements JSONB, photos[], notes)
- [ ] CRUD `/api/metrics`
- [ ] Frontend Progress page:
  - [ ] Реальный график веса (svg или Recharts)
  - [ ] Календарь тренировок: дни с completedAt подсвечены
  - [ ] Personal Records: вытащить из SetLog max(weight) по упражнению
  - [ ] Tonnage за неделю/месяц (volume = sets × reps × weight)
  - [ ] Серия дней подряд (streak)
- [ ] Форма «Добавить замер»

---

## Фаза 8. Fatigue management (P2)

Детект перетренированности и предложение deload.

- [ ] Метрики усталости в `services/fatigueDetector.ts`:
  - [ ] Снижение производительности (RIR растёт при том же весе)
  - [ ] Пропущенные тренировки (>2 за неделю)
  - [ ] Высокий perceivedFatigue 3 сессии подряд
- [ ] Сигнал deload: −40% volume на 1 неделю
- [ ] Frontend: баннер «Похоже, ты устал. Рекомендуем неделю с пониженной нагрузкой» + кнопка «Применить deload»
- [ ] Bot: уведомление о deload

---

## Фаза 9. AI-коуч (P2)

Conversational layer для объяснений и советов.

- [ ] Подключить Claude API через `@anthropic-ai/sdk`
- [ ] Env: `ANTHROPIC_API_KEY` на Render
- [ ] Endpoint `POST /api/coach/chat` — стрим ответов
- [ ] System prompt: контекст пользователя (профиль + последние сессии + PRs)
- [ ] Frontend: кнопка «Спросить тренера» с чатом
- [ ] Prompt caching для system prompt + контекста пользователя
- [ ] Лимит запросов на free tier (например 10/день, дальше — premium)

---

## Фаза 10. Достижения и геймификация (P2)

- [ ] Prisma модели `Achievement` + `UserAchievement` (вернуть)
- [ ] Сидер достижений: «Первая тренировка», «Неделя в режиме», «Удвоил вес в жиме», «10 PR'ов», etc.
- [ ] `services/achievementEngine.ts` — реальная проверка триггеров после каждой сессии
- [ ] Уведомления через бота при unlock

---

## Фаза 11. Бот в проде + напоминания (P2)

- [ ] Деплой `bot/` как Background Worker на Render (добавить в `render.yaml`)
- [ ] @BotFather: `/setmenubutton` → Mini App URL
- [ ] Cron-планировщик в боте (`node-cron`):
  - Если сегодня тренировочный день и сессия не начата к 18:00 → reminder
- [ ] Команды `/profile`, `/today` (показать план на сегодня), `/streak`

---

## Фаза 12. Telegram Stars / монетизация (P3)

- [ ] Решить premium-фичи: безлимитные AI-запросы? Расширенная аналитика? Доступ к продвинутым программам?
- [ ] Telegram invoice через `bot.telegram.sendInvoice`
- [ ] Обработка `successful_payment` → `User.isPremium = true`
- [ ] UI: бейдж Premium, gating premium-фич

---

## Фаза 13. Polish / DX (P3)

- [ ] Очистить неиспользуемые stores и заглушечные хуки фронта
- [ ] Loading skeletons
- [ ] Тост-нотификации для ошибок API
- [ ] Haptic feedback через `@twa-dev/sdk`
- [ ] Тёмная/светлая тема в соответствии с темой Telegram
- [ ] README — реальные инструкции по локалу и деплою
