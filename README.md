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
- `scripts/jenkins-webhook-relay.cjs`

Jenkins status (current):
- Jenkins is running in Docker on `http://localhost:18080` (or `http://<your-lan-ip>:18080`).
- Pipeline job `collegechalo-ci` is configured from `main` using `Jenkinsfile`.
- Required Jenkins credentials are configured:
  - `mongodb-uri`
  - `jwt-secret`
- GitHub webhook auto-trigger is verified (GitHub -> Smee -> local relay -> Jenkins).
- Latest verified pipeline run completed successfully (build `#10`: build + deploy + health check).

Deployment URLs (current local setup):
- App (direct): `http://localhost:3000`
- Nginx reverse proxy: `http://localhost:80`
- Jenkins UI: `http://localhost:18080/login`

Jenkins troubleshooting (quick):
```bash
# containers and ports
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

# verify endpoints
curl -I http://localhost:18080/login
curl -I http://localhost:3000
curl -I http://localhost:80

# verify webhook relays
npx pm2 status
npx pm2 logs jenkins-smee --lines 40 --nostream
npx pm2 logs jenkins-webhook-relay --lines 40 --nostream

# view Jenkins logs
docker logs --tail 200 jenkins
```

## License
Private project (no public license file currently).
