# FitReward — Roadmap

Чек-лист задач по разработке после запуска MVP-стенда в проде (Vercel + Render + Neon).
Отмечай выполненные задачи как `[x]`.

---

## Этап 1. Безопасность (P0)

Закрыть критическую дыру: сейчас `/api/profile/:telegramId` принимает любой telegramId без проверки — любой пользователь может читать/менять чужой профиль, просто подставив ID в URL.

- [ ] Создать middleware `requireTelegramAuth` в `backend/src/middleware/`
  - [ ] Читает заголовок `X-Telegram-Init-Data` из запроса
  - [ ] Валидирует подпись через существующий `validateTelegramInitData`
  - [ ] Извлекает `user.id` из `initData` и кладёт в `req.telegramId`
  - [ ] При невалидной подписи — `401`
- [ ] Применить middleware к `/api/profile/*` (и далее ко всем приватным маршрутам)
- [ ] В роуте `profile.ts` сверять `req.params.telegramId` с `req.telegramId` — при несовпадении `403`
- [ ] На фронте: в `frontend/src/utils/api.ts` добавлять заголовок `X-Telegram-Init-Data` со значением `window.Telegram.WebApp.initData`
- [ ] Локально проверить: запрос без заголовка → 401, с чужим telegramId в URL → 403
- [ ] В проде проверить, что профиль продолжает работать в Telegram Mini App

---

## Этап 2. Workout CRUD (P1)

Заменить захардкоженные данные на странице «Тренировка» реальным CRUD.

### Backend
- [ ] В `backend/src/routes/workouts.ts` заменить заглушки на Prisma:
  - [ ] `GET /api/workouts` — список тренировок текущего пользователя (через middleware из Этапа 1)
  - [ ] `GET /api/workouts/:id` — одна тренировка с упражнениями
  - [ ] `POST /api/workouts` — создание тренировки + упражнений (Zod-валидация payload)
  - [ ] `PATCH /api/workouts/:id` — обновление (отметка `completedAt`, `notes`)
  - [ ] `DELETE /api/workouts/:id`
- [ ] Эндпоинты для упражнений внутри тренировки:
  - [ ] `PATCH /api/workouts/:workoutId/exercises/:exerciseId` — отметка `completed`, фактические sets/reps/weight

### Frontend
- [ ] Подключить `frontend/src/store/workoutStore.ts` или React Query для кеша
- [ ] Заменить моки в `frontend/src/pages/Workout.tsx` на данные из API
- [ ] Форма «Новая тренировка» (название, тип, длительность, добавление упражнений)
- [ ] Кнопка «Выполнено» в карточке упражнения шлёт PATCH
- [ ] Кнопка «Завершить тренировку» проставляет `completedAt`
- [ ] Главная страница `frontend/src/pages/Home.tsx` — заменить моки на реальные статистики «за неделю»

### Backend: статистика
- [ ] `GET /api/workouts/stats?range=week` — количество тренировок, суммарные минуты, текущая серия
- [ ] `calculateWorkoutStreak` в `progressCalculator.ts` — переписать на нормальную логику

---

## Этап 3. Progress tracking (P1)

Реальное отслеживание веса/замеров вместо моков.

### Backend
- [ ] `GET /api/progress` — все записи пользователя, отсортированы по дате
- [ ] `POST /api/progress` — новая запись (вес, % жира, замеры, заметки)
- [ ] `PATCH /api/progress/:id` / `DELETE /api/progress/:id`

### Frontend
- [ ] `frontend/src/pages/Progress.tsx` — реальный график веса по данным из API
- [ ] Форма «Добавить замер» (модалка или отдельная страница)
- [ ] Календарь тренировок — подсветка дней по реальным `completedAt` из workouts

---

## Этап 4. Bot в проде (P2)

Сейчас бот существует только в коде. Деплой как Background Worker на Render.

- [ ] Добавить в `render.yaml` второй сервис типа `worker` для `bot/`
- [ ] Env vars для бота: `TELEGRAM_BOT_TOKEN`, `WEBAPP_URL=https://fitreward-frontend.vercel.app`, `API_URL=https://fitreward-backend.onrender.com`
- [ ] У @BotFather через `/setmenubutton` указать Mini App URL — чтобы у бота появилась кнопка «Open App» в меню
- [ ] Команда `/start` уже работает — проверить в Telegram
- [ ] Реализовать `/profile`, `/workout` команды бота (или решить, что они не нужны и достаточно Mini App)

---

## Этап 5. Achievements engine (P2)

Заменить заглушку реальной логикой.

### Backend
- [ ] Сидер достижений: один раз заполнить таблицу `Achievement` начальным набором (первая тренировка, неделя в режиме, 10 тренировок, и т.д.)
- [ ] `services/achievementEngine.ts` — реальная проверка условий:
  - [ ] `WORKOUT_COUNT` — счётчик завершённых тренировок
  - [ ] `CONSISTENCY` — серия дней подряд
  - [ ] `STRENGTH_PR` — превышение прошлого максимума в упражнении
  - [ ] `WEIGHT_MILESTONE` — изменение веса на X кг
- [ ] Триггер проверки достижений после `PATCH /api/workouts/:id` с `completedAt` и после `POST /api/progress`
- [ ] При unlock — создавать `UserAchievement`, опционально слать уведомление через бота

### Frontend
- [ ] Список ачивок на странице Профиль — реальные данные из `GET /api/achievements/:userId`
- [ ] Кнопка «Забрать награду» меняет `claimed=true`

### Bot
- [ ] При unlock — `sendAchievementNotification` (уже реализована, нужен вызов)

---

## Этап 6. AI-планы тренировок (P3)

Подключить LLM для генерации планов под цели пользователя.

- [ ] Выбрать провайдера: Claude API (`@anthropic-ai/sdk`) или OpenAI
- [ ] Env var на Render: `ANTHROPIC_API_KEY` (или `OPENAI_API_KEY`)
- [ ] `services/aiPlanGenerator.ts` — реальный вызов LLM с промптом, который принимает: уровень, цели, доступное время, дни в неделю
- [ ] Парсинг ответа в JSON со списком упражнений, sets/reps
- [ ] Кеширование (одинаковые входы → не дёргать LLM каждый раз)
- [ ] Сохранение сгенерированных планов в БД (новая модель `Plan`?)
- [ ] Frontend: страница «Планы» — кнопка «Создать ИИ-план», форма параметров, отображение результата

---

## Этап 7. Напоминания (P3)

Push в Telegram, если пользователь пропустил тренировку.

- [ ] В боте — cron-планировщик (`node-cron` или Render Cron Job)
- [ ] Логика: для каждого пользователя с активным планом — если в назначенный день не отметил тренировку, отправить `sendWorkoutReminder`
- [ ] На фронте — настройки уведомлений в Профиле (сейчас они показываются как декорация)

---

## Этап 8. Платежи и Telegram Stars (P3)

В `bot/src/index.ts` уже стоят хендлеры `pre_checkout_query` и `successful_payment`, но без бизнес-логики.

- [ ] Решить, за что брать Stars: премиум-планы? Снятие лимита на ИИ-генерации? Косметика?
- [ ] Создать инвойс через `bot.telegram.sendInvoice`
- [ ] При `successful_payment` — апдейтить `User.isPremium` или начислять «звёзды» в БД
- [ ] Frontend: бейдж «Premium», блокировка/разблокировка функций по `isPremium`

---

## Этап 9. Polish и DX (P3)

Мелочи, которые лучше сделать когда основное работает.

- [ ] Очистить неиспользуемые stores `frontend/src/store/{auth,progress}Store.ts` или начать ими пользоваться
- [ ] Заменить заглушки `useWorkout.ts`/`useProgress.ts` или удалить
- [ ] Loading skeletons на всех страницах вместо моментального flash
- [ ] Обработка ошибок API через единый toast/alert
- [ ] Тёмная тема уже есть — проверить на iOS Telegram (бывают разницы в safe-area)
- [ ] Добавить `@twa-dev/sdk` haptic feedback на кнопках действий
- [ ] README — реальные инструкции по деплою (а не просто scaffold-описание)
