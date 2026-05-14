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

## Фаза 2. Онбординг + рекомендация структуры тренировок (P0) — 🟡 ОЖИДАЕТ ПРОВЕРКИ В ПРОДЕ

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
- [ ] Прод: пройти онбординг в Telegram, проверить сохранение, проверить, что повторный вход не редиректит

---

## Фаза 3. Каталог упражнений из публичного датасета (P1)

Импорт wger.de open dataset → нормализация → таблица `ExerciseCatalog`.

- [ ] Скрипт `backend/scripts/seed-exercises.ts`:
  - [ ] Скачать wger exercise dataset (CC-BY-SA, ~800 упражнений с переводами)
  - [ ] Маппинг полей: name, category, muscleGroups[], equipment[], instructions, imageUrl
  - [ ] Дедупликация по name + категории
  - [ ] Запись в `ExerciseCatalog` через `prisma.exerciseCatalog.createMany`
- [ ] Prisma модель `ExerciseCatalog`:
  - id, slug, name (ru/en), category (PUSH/PULL/LEGS/CORE/CARDIO), primaryMuscles[], secondaryMuscles[], equipment, difficulty, instructions, imageUrl
- [ ] Новые enums: `MuscleGroup`, `Equipment`, `MovementCategory`
- [ ] `GET /api/exercises?category=&equipment=&search=` — поиск с фильтрами
- [ ] Запустить seed в проде через Render shell или `prisma db seed`
- [ ] (опционально) Frontend: страница «Библиотека упражнений» для отладки

---

## Фаза 4. Генератор программы из шаблонов (P1)

На основе `recommendedStructure` собираем недельный план: список тренировочных дней с подобранными упражнениями.

- [ ] Prisma модели:
  - `ProgramTemplate` (стандартные планы Full-body/UL/PPL) — захардкожены через seed
  - `Program` (инстанс программы для конкретного юзера, активна одна за раз)
  - `ProgramDay` (день недели + список упражнений из каталога + предлагаемые сеты/повторения)
- [ ] Логика генерации:
  - [ ] Подбор упражнений с учётом `trainingEnvironment` (фильтр по equipment)
  - [ ] Подбор с учётом `limitations` (исключить движения, нагружающие проблемные зоны)
  - [ ] Базовая прогрессия: для новичков 3×8 на компаундах, для среднего 4×6–10 и т.д.
- [ ] `POST /api/program/generate` — после онбординга вызывает генератор, сохраняет активную программу
- [ ] `GET /api/program/current` — возвращает активную программу с днями и упражнениями
- [ ] `POST /api/program/regenerate` — пересоздать (например, поменялся профиль)
- [ ] Frontend: страница «План» показывает реальный план вместо моков

---

## Фаза 5. Логирование тренировки (P1)

Запуск тренировки → лог сетов с весом/повторениями/RIR → завершение.

- [ ] Prisma модели:
  - `WorkoutSession` (id, userId, programDayId, startedAt, completedAt, perceivedFatigue)
  - `SetLog` (id, sessionId, exerciseCatalogId, setNumber, weight, reps, rir, completedAt)
- [ ] Эндпоинты:
  - `POST /api/sessions` — создать сессию из ProgramDay (клонирует упражнения и предлагаемые сеты)
  - `GET /api/sessions/active` — текущая активная сессия
  - `POST /api/sessions/:id/sets` — добавить лог сета
  - `PATCH /api/sessions/:id` — завершить
- [ ] Frontend: переписать `Workout.tsx`:
  - [ ] Список упражнений из активной сессии
  - [ ] Карточка упражнения: предложенные значения + поля для фактических reps/weight + быстрый выбор RIR (0/1/2/3+/слишком легко)
  - [ ] Кнопка «Следующий сет» → автоматически переключает
  - [ ] Завершение → POST со sliderom perceivedFatigue
- [ ] Bot: отправлять напоминание о следующей тренировке через `bot/src/services/notifications.ts`

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
