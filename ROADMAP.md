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

## Фаза 5. Логирование тренировки (P1) — ✅ ВЫПОЛНЕНО (2026-05-14)

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
- [x] Прод: открыть «Тренировка» → начать сессию → залогать пару сетов → завершить → проверить, что сессия исчезла из активных

---

## Фаза 5.5. i18n RU/EN с переключателем (P0 побочная задача) — 🟡 КОД ГОТОВ, ОЖИДАЕТ ПРОДА

Полная локализация: автодетект из Telegram WebApp `language_code`, переключатель в Профиле, persistence в localStorage.

### Backend
- [x] `programTemplates.ts`: слоты используют ключи (`slot.compound_press_chest`) вместо локализованных строк
- [x] Шаблоны дней → ключи (`day.full_body`, `day.upper`, etc.)
- [x] `trainingRecommendation.ts`: причины возвращаются как `{ key, params }[]`
- [x] `programGenerator.ts`: `ProgramDay.name` хранит ключ, `slotName` хранит ключ
- [x] Удалено поле `User.recommendationReasons` (вычисляется свежим, миграция `20260515_i18n_refactor`)
- [x] Profile/onboarding response отдают ключи + params, не локализованный текст

### Frontend
- [x] Кастомный i18n (`src/i18n/`) с `useTranslation`, поддержка вложенных ключей и `{placeholder}` интерполяции
- [x] Локали RU и EN — все строки UI вынесены в словари (включая slot/day/reason/structure/goal/experience/environment/limitation)
- [x] Детект языка: localStorage → Telegram `language_code` → fallback EN
- [x] Переключатель «Русский / English» в Профиле
- [x] Все компоненты (App/Home/Progress/Plans/Workout/Profile/Onboarding) переведены на t() вызовы

### Тест
- [ ] Прод: пройти онбординг заново (старая программа в БД имеет русские названия слотов, новая — ключи)
- [ ] Переключить язык в Профиле → весь UI и план переключаются на EN
- [ ] Закрыть/открыть Mini App → выбор языка сохраняется

---

## Фаза 6. Адаптивная прогрессия (P1) — ✅ ВЫПОЛНЕНО (2026-05-15)

После каждой сессии корректировать веса/повторения для следующего раза.

### Backend
- [x] `services/progressionEngine.ts` — чистая функция `nextSuggestion()`:
  - RIR 0–1: ниже верха диапазона → +1 повтор; на верхе диапазона → +2.5% вес, сброс reps в низ
  - RIR 2: держим всё
  - RIR 3+: +3% вес
  - «Слишком легко» (RIR=5): +7.5% вес
  - Округление до 0.5 кг
- [x] При запросе сессии (`/active`, `/:id`, `POST /`): для каждого упражнения ищется последний завершённый SessionExercise того же `exerciseCatalogId` у этого юзера → выбирается «лучший» сет (max вес, потом max reps) → считается suggestion
- [x] Ответ обогащается полями `previous` (последний сет) и `suggestion` (рекомендация на сегодня)

### Frontend
- [x] Типы `ApiPreviousBest`, `ApiSuggestion` в API-клиенте
- [x] Workout.tsx: предзаполнение полей «Вес» и «Повторения» из suggestion при открытии карточки (до первого логированного сета)
- [x] Блок-подсказка под названием упражнения: «Прошлая: 80 × 8 · RIR 2» + «Цель сегодня: 82.5 × 8 — RIR был большим, добавь немного веса»
- [x] Переводы для прогрессии в RU/EN

### Не сделано (отложено)
- [ ] Детект плато: 3 сессии подряд без роста → флаг deload (вынесено в Фазу 8 Fatigue management)
- [ ] Показывать «↑ Вес повышен» индикатор сравнения с прошлой тренировкой

### Тест
- [x] Прод: пройти 2 сессии одного дня → во 2-й увидеть «Прошлая: …» и «Цель сегодня: …» под каждым упражнением, поля предзаполнены
- [x] Bugfix: матчинг по slotName + exerciseCatalogId (раньше искало только по exerciseCatalogId — не находило, потому что генератор подбирает разные упражнения в разные дни)

---

## Фаза 7. Progress tracking (P1) — ✅ ВЫПОЛНЕНО (2026-05-15)

Замеры тела, история, графики, метрики. Также восстановлен полноценный Home.

### Backend
- [x] Prisma модель `BodyMetric` (id, userId, date, weight, bodyFat, notes)
- [x] Миграция `20260515_body_metrics`
- [x] CRUD: GET/POST/DELETE `/api/metrics`
- [x] GET `/api/dashboard` — агрегированный блок:
  - stats: completedSessions, weekSessionsCount, weekVolume, streak
  - weightHistory[] — все замеры по возрастанию даты
  - calendar[] — последние 30 дней с флагом trained
  - personalRecords[] — топ-8 упражнений по max весу

### Frontend
- [x] API-клиент: `getMetrics`, `createMetric`, `deleteMetric`, `getDashboard`
- [x] Progress page переписана:
  - 3 stat-карточки сверху (всего тренировок, серия, объём за неделю)
  - История веса — простой bar-chart по последним 12 точкам + кнопка «Добавить замер» (модалка-форма inline)
  - Календарь 30 дней (зелёные = тренировался)
  - Personal Records (топ-8 по весу)
  - История замеров (удаление крестиком)
- [x] Home page восстановлена: приветствие с именем, следующая тренировка с кнопкой «Начать», блок «Эта неделя» с реальной статистикой
- [x] Переводы для всех новых строк RU/EN

### Не сделано (отложено)
- [ ] Tonnage за месяц (есть только за неделю)
- [ ] Photos / measurements JSONB

### Тест
- [x] Прод: добавить замер веса → должен появиться в графике и списке
- [x] Завершить тренировку → streak +1, weekSessionsCount +1, weekVolume растёт
- [x] Personal Records показывают залогированные сеты с весом

---

## Фаза 8. Fatigue management (P2) — 🟡 КОД ГОТОВ, ОЖИДАЕТ ПРОДА (детект без deload-application)

Детект перетренированности и информационный баннер.

### Backend
- [x] `services/fatigueDetector.ts` — чистая функция `detectFatigue(sessions)`:
  - Сигнал `high_fatigue_streak`: 3 завершённые сессии подряд с `perceivedFatigue >= 8`
  - Сигнал `rir_dropping`: для одного слота 3 последние сессии — RIR падает при равном или растущем весе («стало тяжелее на том же весе»)
  - Возвращает `{ status: 'ok' | 'elevated', reasons: { key, params }[] }`
- [x] `/api/dashboard` обогащён полем `fatigue`

### Frontend
- [x] Тип `ApiFatigueStatus` в API-клиенте
- [x] На Home: жёлтый баннер при `fatigue.status === "elevated"` с расшифровкой причин и подсказкой про deload
- [x] Slot keys в reason.params переводятся через t() прежде чем подставиться в строку

### Не сделано (отложено)
- [ ] Автоматическое применение deload (−40% volume) — нужна доп. логика на ProgramExerciseSlot / WorkoutSession для временного override
- [ ] Сигнал «пропущенные тренировки» — нужен механизм расписания / напоминаний (вынесено в Фазу 11 бот)
- [ ] Уведомление в боте — Фаза 11

### Тест
- [ ] Прод: после 3 тренировок с perceivedFatigue=10 → на Home появляется жёлтый баннер

---

## Фаза 9. AI-коуч (P2) — ⏸ ОТЛОЖЕНО

Требует ANTHROPIC_API_KEY и платный API. Пока пропускаем. Когда вернёмся — пользователь предпочёл FAB-кнопку «Спросить» на любом экране и сохранение истории в БД.



Conversational layer для объяснений и советов.

- [ ] Подключить Claude API через `@anthropic-ai/sdk`
- [ ] Env: `ANTHROPIC_API_KEY` на Render
- [ ] Endpoint `POST /api/coach/chat` — стрим ответов
- [ ] System prompt: контекст пользователя (профиль + последние сессии + PRs)
- [ ] Frontend: кнопка «Спросить тренера» с чатом
- [ ] Prompt caching для system prompt + контекста пользователя
- [ ] Лимит запросов на free tier (например 10/день, дальше — premium)

---

## Фаза 10. Достижения и геймификация (P2) — 🟡 КОД ГОТОВ, ОЖИДАЕТ ПРОДА

### Backend
- [x] Prisma модели `Achievement` + `UserAchievement` + enum `AchievementCategory`
- [x] Миграция `20260515_achievements`
- [x] Auto-seed 10 ачивок при старте сервера (idempotent через upsert by key):
  - `onboarding_complete`, `first_workout`, `streak_3`, `streak_7`,
  - `sessions_10`, `sessions_30`, `first_metric`, `first_pr`,
  - `volume_10000`, `program_week_complete`
- [x] `services/achievementEngine.ts` — `checkAndUnlockAchievements(userId)` проверяет все 10 правил
- [x] Хуки fire-and-forget после `onboarding submit`, `sessions complete`, `sets log` (если weight), `metrics create`
- [x] `GET /api/achievements` — все ачивки с `unlockedAt` и `notifiedAt`
- [x] `POST /api/achievements/seen` — батч-mark пользователь увидел toast

### Frontend
- [x] `store/achievementStore.ts` (Zustand) — `achievements`, `pendingToasts`, `load`, `refresh`, `dismissToast`
- [x] `AchievementToast` компонент — глобальный bottom-banner с дисмиссом
- [x] App.tsx: refresh ачивок при каждом route change → toasts появляются после действий
- [x] Profile — секция «Достижения» grid 2×N (разблокированные подсвечены emerald, заблокированные приглушены)
- [x] Переводы 10 ачивок (title + description) на RU/EN

### Не сделано (отложено)
- [ ] Уведомления через бота — Фаза 11
- [ ] Stars-награды реальная привязка — Фаза 12

### Тест
- [ ] Прод: онбординг → toast «Старт пути»
- [ ] Заверши первую тренировку → toast «Первая тренировка»
- [ ] Залогь сет с весом → toast «Первая нагрузка»
- [ ] Profile → секция «Достижения» показывает 10 карточек, разблокированные подсвечены

---

## Фаза 11. Бот в проде + напоминания (P2) — 🟡 КОД ГОТОВ, ОЖИДАЕТ ДЕПЛОЯ

Архитектура: бот — отдельный free Web Service на webhook. Напоминания — в тренировочный
день; данные считает backend, рассылает бот.

### Backend
- [x] Схема `User`: `timezone`, `locale`, `reminderHour`, `remindersEnabled`, `lastReminderSentAt` (миграция `20260516_reminders`)
- [x] `services/trainingSchedule.ts`: маппинг `trainingDaysPerWeek` → дни недели + `zonedParts()` (час/день недели в таймзоне юзера)
- [x] `routes/internal.ts` (защита `INTERNAL_API_SECRET`):
  - `POST /internal/reminder-targets` — кого пинговать сейчас (час == reminderHour, тренировочный день, сегодня без сессии, ещё не пинговали) + ставит `lastReminderSentAt`
  - `GET /internal/user-summary?telegramId=` — данные для команд бота
- [x] `PUT /api/profile/me` принимает `timezone`, `locale`, `reminderHour`, `remindersEnabled`

### Бот
- [x] Переписан с `bot.launch()` (polling) на webhook + Express (биндинг порта для Render Web Service)
- [x] Команды `/start`, `/today`, `/streak`, `/profile` через `/internal/user-summary`
- [x] `services/reminders.ts` + `POST /tasks/reminders` (триггерится внешним кроном, отвечает сразу)
- [x] Мини-i18n RU/EN (`bot/src/i18n.ts`), self-register webhook при старте
- [x] Удалены мёртвые заглушки `handlers/workout.ts`, `handlers/achievements.ts`, `services/notifications.ts`

### Frontend
- [x] `App.tsx` синхронизирует таймзону устройства + активную локаль в профиль
- [x] Секция «Напоминания» в Профиле: тумблер + выбор часа, переводы RU/EN

### Инфра / ручное
- [x] `render.yaml`: сервис `fitreward-bot` + env `INTERNAL_API_SECRET` на backend
- [ ] Render: создать Web Service `fitreward-bot`, env-переменные
- [ ] @BotFather: `/setmenubutton` → Mini App URL, `/setcommands`
- [ ] cron-job.org: ежечасный `POST .../tasks/reminders` с `X-Internal-Secret`
- [ ] Прод-тест в Telegram: команды + напоминание

---

## Фаза 12. Telegram Stars / монетизация (P3)

- [ ] Решить premium-фичи: безлимитные AI-запросы? Расширенная аналитика? Доступ к продвинутым программам?
- [ ] Telegram invoice через `bot.telegram.sendInvoice`
- [ ] Обработка `successful_payment` → `User.isPremium = true`
- [ ] UI: бейдж Premium, gating premium-фич

---

## Известные проблемы (по фидбеку 2026-05-15)

Зафиксировано для решения в Polish (Фаза 13) или в соответствующих фазах:

- **Cold start медленный** — Render free усыпляет сервис, первый запрос после простоя ~30 сек. Решения: keep-alive ping раз в 10 мин (например через UptimeRobot), переход на платный Render Starter ($7/мес), миграция бэка на Fly.io machines.
- **Главный экран обеднён** — после i18n-рефактора Home показывает только «Привет! Сегодня: открой "Тренировку"». Нужно: статистика недели (тренировок выполнено / минут / серия), последние ачивки. Зависит от Фазы 7 (Progress tracking).
- ~~**«День 1: День 1: Full-body» дубль в Планах**~~ — ✅ исправлено 2026-05-16: helper `formatDayName` различает i18n-ключ (`day.*`) и легаси-строку.
- ~~**Названия упражнений на английском**~~ — ✅ исправлено 2026-05-16: датасет wger оказался слишком шумным (667 записей, мусорные имена). Решение — курируемый каталог из ~85 двуязычных упражнений (`src/data/curatedExercises.ts`), auto-seed при старте, генератор берёт `source="curated"` с fallback на полный каталог. Скрипт `translate:exercises` остаётся для разовых правок wger-данных, но больше не нужен для генерации.

---

## Фаза 13. Polish / DX (P3) — 🟡 В ПРОЦЕССЕ

- [x] Очистить неиспользуемые stores и заглушечные хуки фронта (удалены useWorkout, useProgress, authStore, workoutStore, progressStore — мёртвый скаффолд)
- [x] Haptic feedback через `@twa-dev/sdk` — `utils/haptics.ts`, отклик на старт тренировки, лог сета, завершение упражнения/сессии, появление ачивки
- [ ] Loading skeletons
- [ ] Тост-нотификации для ошибок API
- [ ] Тёмная/светлая тема в соответствии с темой Telegram
- [ ] README — реальные инструкции по локалу и деплою
