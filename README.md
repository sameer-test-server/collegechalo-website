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

## Environment
Create environment values from `.env.example`.

Common keys:
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (optional, default app port behavior applies)

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

## CI/CD
This repo includes:
- `Jenkinsfile`
- `scripts/deploy-production.sh`

## License
Private project (no public license file currently).
