# College Chalo - About Project

## What This Project Is
College Chalo is a full-stack web platform that helps students discover colleges, compare options, and track admission workflows in one place.

It includes:
- Public website for college discovery and guidance.
- Student dashboard for saved colleges, applications, profile, and recommendations.
- API layer for colleges, auth, reviews, contact, preferences, notifications, and leads.
- MongoDB support with safe fallbacks where applicable.
- Production deployment support with PM2 and Nginx.

## Why This Project Is Used
This project is designed to reduce confusion during college selection and admissions.

It helps users:
- Search and filter colleges by ranking, location, fees, and placements.
- Compare shortlisted colleges quickly.
- Track application status in a structured flow.
- Get profile-based recommendations.
- Contact support team or submit lead details for callback.

It helps the team:
- Collect and manage user interest/leads.
- Run a stable production app with monitored process management.
- Maintain and troubleshoot quickly with documented commands.

## Core User Flows
1. Visitor lands on website and explores colleges.
2. Visitor registers/logs in.
3. User saves colleges and compares them.
4. User tracks applications and preferences.
5. User submits contact/lead form for support follow-up.

## Tech Stack
- Frontend: Next.js + React + TypeScript + Tailwind CSS
- Backend: Next.js API routes
- Database: MongoDB (with fallback behavior in selected modules)
- Auth: JWT + bcryptjs
- Process manager: PM2
- Reverse proxy: Nginx

## How To Run (Quick)
```bash
cd /Users/sameer/collegechalo-website
npm install
npm run dev
```

Open:
- Local: `http://localhost:3000`

## Production Run (PM2)
```bash
cd /Users/sameer/collegechalo-website
npx next build --webpack
npx pm2 start ecosystem.config.js --only collegechalo
npx pm2 status
```

## Basic Health Checks
```bash
curl -I http://localhost:3000
curl -I http://192.168.1.4:8080
```

## Maintenance Notes
- Main operational commands are documented in `commands.md`.
- Project phase/status tracking is in `PROJECT_PATH.md`.
- Environment values are in `.env.production` (do not expose publicly).

## Current Goal
Maintain a stable, student-friendly admissions platform that is easy to operate even for non-coders using the documented runbooks.

## Git + Jenkins Setup (Recommended For Your PC)
Your Mac (Intel dual-core) should not run heavy CI tasks continuously. Use Git for version control and Jenkins for server-side automation.

### 1) Git workflow
```bash
git checkout -b feature/your-change
git add .
git commit -m "your message"
git push origin feature/your-change
```

Merge to `main` only after review.

### 2) Jenkins pipeline included
This repository now has:
- `Jenkinsfile` (CI/CD pipeline)
- `scripts/deploy-production.sh` (build + PM2 restart + health check)

Pipeline stages:
1. Checkout
2. Install (`npm ci`)
3. Type-check (`npx tsc --noEmit`)
4. Unit tests (`npm test -- --runInBand`)
5. Build (`npx next build --webpack`)
6. Deploy on `main` branch

### 3) Jenkins job setup
1. Create a Pipeline job in Jenkins.
2. Connect your Git repository URL.
3. Set pipeline source: `Jenkinsfile` from SCM.
4. Add webhook (GitHub/Git provider) to trigger on push to `main`.
5. Set env variables in Jenkins host:
`MONGODB_URI`, `JWT_SECRET`, `PORT` if needed.

### 4) Server requirements
- Node.js and npm installed
- PM2 installed globally or available via `npx`
- Nginx configured as reverse proxy
- App path default in deploy script: `/home/ubuntu/collegechalo-website`

If server path is different, set:
```bash
export APP_DIR=/your/path
export APP_NAME=collegechalo
```
