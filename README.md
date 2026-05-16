# FitReward

FitReward is a Telegram Mini App that acts as a **smart fitness coach**: it runs a
5-step onboarding, recommends a training structure (Full-body / Upper-Lower / PPL /
Split), generates a weekly program, logs workouts set-by-set with adaptive weight
progression, tracks body metrics, and nudges the user on training days via a bot.

## Stack

- **Frontend** — React 18 + TypeScript + Vite + Tailwind + Zustand. Runs inside Telegram via `@twa-dev/sdk`.
- **Backend** — Node.js + Express + TypeScript + Prisma + PostgreSQL.
- **Bot** — Telegraf in webhook mode (Express server).

## Monorepo layout

npm workspaces — `frontend`, `backend`, `bot`. Install once from the root.

```
frontend/   Mini App (Vercel)
backend/    REST API + Prisma (Render)
bot/        Telegram bot, webhook mode (Render)
render.yaml Blueprint for both Render services
```

## Local development

1. Install dependencies from the repo root:
   ```
   npm install
   ```
2. Create `.env` files in each workspace (see **Environment variables** below).
3. Apply database migrations:
   ```
   cd backend && npx prisma migrate deploy
   ```
4. Start the apps (separate terminals):
   ```
   npm run dev:backend
   npm run dev:frontend
   npm run dev:bot
   ```

To open the Mini App outside Telegram during development, set `ALLOW_DEV_AUTH=true`
in `backend/.env` — this bypasses Telegram `initData` HMAC validation. **Never set
it in production.**

Type-check / build everything: `npm run build:all`.

## Environment variables

**frontend/.env**

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend base URL. Baked at build time — changing it needs a rebuild. |

**backend/.env**

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (Neon pooled string works). |
| `TELEGRAM_BOT_TOKEN` | Used to validate Telegram `initData`. |
| `CORS_ORIGIN` | Allowed frontend origin. |
| `INTERNAL_API_SECRET` | Shared secret guarding `/internal` routes — must match the bot. |
| `ALLOW_DEV_AUTH` | `true` only for local dev; disables the auth bypass in production. |
| `PORT` | Optional; server port. |

**bot/.env**

| Variable | Purpose |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather. |
| `WEBAPP_URL` | Mini App URL (the frontend). |
| `BACKEND_URL` | Backend base URL the bot calls. |
| `INTERNAL_API_SECRET` | Same value as the backend. |
| `PUBLIC_URL` | The bot's own public URL; used to self-register the Telegram webhook. |
| `PORT` | Optional; server port. |

`.env` files are git-ignored.

## Deployment

- **Frontend → Vercel.** Auto-deploys from `main`. Set `VITE_API_URL` in project env vars
  (a value change requires a redeploy without build cache, since Vite inlines `VITE_*`).
- **Backend + Bot → Render.** Both services are described in [render.yaml](render.yaml)
  as a Blueprint; fill in the `sync: false` secrets in the Render dashboard. The backend
  start command runs `prisma migrate deploy` before booting.
- **Database → Neon** PostgreSQL.
- **Bot extras:** in @BotFather set the Menu Button to `WEBAPP_URL` and register the
  `/today`, `/streak`, `/profile` commands. Training-day reminders are driven by an
  hourly external cron (e.g. cron-job.org) hitting `POST {bot}/tasks/reminders` with an
  `X-Internal-Secret` header.

## Roadmap

Development is tracked phase-by-phase in [ROADMAP.md](ROADMAP.md).
