# FitReward

FitReward is a Telegram Mini App fitness tracker with workout planning, progress tracking, and rewards.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind + Zustand
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL
- Bot: Telegraf + TypeScript

## Quick start
1. Install dependencies in root: `npm install`
2. Copy env examples:
   - `frontend/.env.example -> frontend/.env`
   - `backend/.env.example -> backend/.env`
   - `bot/.env.example -> bot/.env`
3. Setup database and run migration from `backend`:
   - `npx prisma migrate dev`
4. Run apps:
   - Frontend: `npm run dev:frontend`
   - Backend: `npm run dev:backend`
   - Bot: `npm run dev:bot`

## MVP V1 included in scaffold
- Telegram auth API contract
- Workout CRUD endpoints (basic)
- Progress endpoints (basic)
- Achievement engine skeleton
- Telegram bot `/start` and reminder/achievement notifications
# FitReward
