# College Chalo

College Chalo is a full-stack platform for college discovery, comparison, and admissions tracking.

## Features
- Public college browsing and filtering
- Student dashboard with saved colleges and applications
- Smart recommendations based on profile/preferences
- Reviews and contact/lead APIs
- Admin pages for analytics and college management

## Tech Stack
- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Next.js API routes
- MongoDB (with static fallback data)
- PM2 + Nginx for deployment
- Docker + Docker Compose (local container deployment)
- Jenkins pipeline (`Jenkinsfile`) for CI/CD

## Quick Start
```bash
cd /Users/sameer/collegechalo-website
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build
```bash
npm run build -- --webpack
npm run start:prod
```

## Docker Run
```bash
cd /Users/sameer/collegechalo-website
docker compose up --build -d
docker ps
```

Endpoints:
- App: `http://localhost:3000`
- Nginx proxy: `http://localhost:80`

## Environment
Create environment values from `.env.example`.

Common keys:
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (optional, default app port behavior applies)

For Docker Compose, create `.env` in project root with at least:
```env
MONGODB_URI=...
JWT_SECRET=...
```

## Scripts
```bash
npm run dev
npm run build
npm run start
npm run start:prod
npm run type-check
npm run test
```

## Deployment / Operations
- Full runbook: `commands.md`
- Daily quick commands: `QUICK_START.md`
- Project roadmap + status: `PROJECT_PATH.md`

## CI/CD
This repo includes:
- `Jenkinsfile`
- `scripts/deploy-production.sh`

Current CI/CD status:
- Jenkins pipeline file is ready.
- Docker image and compose flow are working locally.
- Next step is starting Jenkins service and connecting GitHub webhook.

## License
Private project (no public license file currently).
