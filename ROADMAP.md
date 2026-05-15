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

## Фаза 6. Адаптивная прогрессия (P1) — 🟡 КОД ГОТОВ, ОЖИДАЕТ ПРОДА

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
- [ ] Прод: пройти 2 сессии одного дня → во 2-й увидеть «Прошлая: …» и «Цель сегодня: …» под каждым упражнением, поля предзаполнены

---

## Фаза 7. Progress tracking (P1) — 🟡 КОД ГОТОВ, ОЖИДАЕТ ПРОДА

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
- [ ] Прод: добавить замер веса → должен появиться в графике и списке
- [ ] Завершить тренировку → streak +1, weekSessionsCount +1, weekVolume растёт
- [ ] Personal Records показывают залогированные сеты с весом

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

## Известные проблемы (по фидбеку 2026-05-15)

Зафиксировано для решения в Polish (Фаза 13) или в соответствующих фазах:

- **Cold start медленный** — Render free усыпляет сервис, первый запрос после простоя ~30 сек. Решения: keep-alive ping раз в 10 мин (например через UptimeRobot), переход на платный Render Starter ($7/мес), миграция бэка на Fly.io machines.
- **Главный экран обеднён** — после i18n-рефактора Home показывает только «Привет! Сегодня: открой "Тренировку"». Нужно: статистика недели (тренировок выполнено / минут / серия), последние ачивки. Зависит от Фазы 7 (Progress tracking).
- **«День 1: День 1: Full-body» дубль в Планах** — у пользователей со старой программой (до Фазы 5.5) `ProgramDay.name` хранит уже отформатированную строку «День 1: Full-body». Фронт обёртывает её в `t("day.dayN", { n, name })` ещё раз. Быстрый фикс: при показе детектить, если name уже начинается с «День»/«Day», не оборачивать. Или: миграция данных, переписывающая старые programDay.name на ключи. Радикальный путь: попросить пользователя «Пересоздать программу».
- **Названия упражнений на английском** — wger dataset покрывает Russian переводы на ~30% упражнений. Когда `nameRu = null`, показываем `nameEn`. Решения: (а) ручной перевод топ-100 самых частых упражнений в виде словаря в репо, который мержится поверх wger; (б) LLM-перевод batch при сидинге; (в) свой каталог.

---

## Фаза 13. Polish / DX (P3)

- [ ] Очистить неиспользуемые stores и заглушечные хуки фронта
- [ ] Loading skeletons
- [ ] Тост-нотификации для ошибок API
- [ ] Haptic feedback через `@twa-dev/sdk`
- [ ] Тёмная/светлая тема в соответствии с темой Telegram
- [ ] README — реальные инструкции по локалу и деплою
