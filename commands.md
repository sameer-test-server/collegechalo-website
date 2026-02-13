# College Chalo Runbook (start, deploy, troubleshoot)

## 1) Local setup (first time)
```bash
cd /Users/sameer/collegechalo-website
node -v
npm -v
npm install
```

If dependency install fails:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 2) Start locally (development)
```bash
cd /Users/sameer/collegechalo-website
npm run dev
```

Check site:
```bash
curl -I http://localhost:3000
```

## 3) Start locally (production mode)
```bash
cd /Users/sameer/collegechalo-website
npm run build -- --webpack
npm run start:prod
```

## 3.1) Start with Docker (recommended for deployment-like local testing)
Prepare env file first:
```bash
cd /Users/sameer/collegechalo-website
cat > .env <<'EOF'
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EOF
```

Build and run:
```bash
docker compose up --build -d
docker ps
```

Health checks:
```bash
curl -I http://localhost:3000
curl -I http://localhost:80
```

Stop containers:
```bash
docker compose down
```

## 4) PM2 start/restart/reload (same machine)
Start app if missing:
```bash
cd /Users/sameer/collegechalo-website
npx pm2 start npm --name collegechalo -- start
```

Reload app after code/build update:
```bash
npx pm2 reload collegechalo
```

Restart app (harder reset than reload):
```bash
npx pm2 restart collegechalo
```

Check status/logs:
```bash
npx pm2 status
npx pm2 logs collegechalo --lines 120
```

Persist PM2 list:
```bash
npx pm2 save
```

## 5) Standard deploy flow (recommended every change)
```bash
cd /Users/sameer/collegechalo-website
git pull
npm install
npm run build -- --webpack
npx pm2 reload collegechalo
npx pm2 status
```

Optional quality checks before build:
```bash
npm run type-check
npm test -- --runInBand
```

## 6) Mongo/DB helper commands
Migrate endpoint:
```bash
curl -sS -X POST http://localhost:3000/api/migrate
```

Data scripts:
```bash
npm run seed-mongo
npm run import-localstorage
npm run create-indexes
```

## 7) Nginx commands (Ubuntu server only)
Check config:
```bash
sudo nginx -t
```

Reload/restart:
```bash
sudo systemctl reload nginx
sudo systemctl restart nginx
sudo systemctl status nginx
```

Logs:
```bash
sudo tail -n 200 /var/log/nginx/collegechalo-error.log
sudo tail -n 200 /var/log/nginx/collegechalo-access.log
```

## 8) Issue -> Fix quick guide
App UI changed in code but website not updated:
```bash
cd /Users/sameer/collegechalo-website
npm run build -- --webpack
npx pm2 reload collegechalo
```

PM2 says app not found:
```bash
cd /Users/sameer/collegechalo-website
npx pm2 start npm --name collegechalo -- start
npx pm2 status
```

PM2 app stuck in `stopping` or keeps restarting:
```bash
npx pm2 logs collegechalo --lines 200
npx pm2 restart collegechalo
```

`localhost:3000` not reachable:
```bash
npx pm2 status
npx pm2 logs collegechalo --lines 120
```

If still down:
```bash
cd /Users/sameer/collegechalo-website
npm run build -- --webpack
npx pm2 restart collegechalo
```

Build fails with Turbopack error:
```bash
npm run build -- --webpack
```

Type-check fails due to missing `.next/types/*`:
```bash
cd /Users/sameer/collegechalo-website
npm run build -- --webpack
npm run type-check
```

MongoDB connection errors (`ECONNREFUSED` / auth / DNS):
- Verify `MONGODB_URI` in env file.
- Check Atlas IP whitelist.
- URL-encode special chars in password.

Nginx `502 Bad Gateway`:
```bash
npx pm2 status
curl -I http://127.0.0.1:3000
sudo nginx -t
sudo systemctl restart nginx
```

## 9) Emergency recovery (copy-paste)
```bash
cd /Users/sameer/collegechalo-website
git pull
npm install
npm run build -- --webpack
npx pm2 start npm --name collegechalo -- start
npx pm2 reload collegechalo
npx pm2 status
```

## 10) Rollback if latest deploy is broken
```bash
cd /Users/sameer/collegechalo-website
git log --oneline -n 10
git checkout <LAST_WORKING_COMMIT_HASH>
npm install
npm run build -- --webpack
npx pm2 reload collegechalo
```

Return to main later:
```bash
git checkout main
```

## 11) Useful project scripts
```bash
npm run dev
npm run build
npm run start
npm run start:prod
npm run type-check
npm run lint
npm run test:e2e
npm run seed-mongo
npm run import-localstorage
npm run create-indexes
```

## 12) Security basics
- Keep `.env` and `.env.production` private.
- Use strong `JWT_SECRET` (32+ chars).
- Rotate DB credentials if exposed.

Generate secure secret:
```bash
openssl rand -hex 32
```

## 13) Internal Notes (Owner-Only)
This section was moved from README so public docs stay clean.

### Project intent
- Student-friendly platform to discover colleges, compare options, and manage admission workflows.
- Keep operations simple enough to maintain with runbooks.

### Core user flow
1. Visitor explores colleges.
2. User registers/logs in.
3. User saves colleges and compares options.
4. User tracks applications and preferences.
5. User submits contact/lead requests.

### Team/ops focus
- Keep PM2 + Nginx stable in production.
- Maintain API/database reliability.
- Use this file for fast troubleshooting and deploy recovery.

### Git workflow (owner)
```bash
git checkout -b feature/<change-name>
git add .
git commit -m "your message"
git push origin feature/<change-name>
```

Merge to `main` after validation.

### Jenkins notes (owner)
- Pipeline source: `Jenkinsfile`
- Deploy script: `scripts/deploy-production.sh`
- Typical stages:
1. Checkout
2. Install (`npm ci`)
3. Type-check (`npm run type-check`)
4. Tests (`npm test -- --runInBand`)
5. Build (`npm run build -- --webpack`)
6. Deploy on `main`

### Jenkins current setup (owner)
- Jenkins container name: `jenkins`
- Jenkins URL: `http://localhost:18080/login`
- Job name: `collegechalo-ci`
- Required credentials in Jenkins:
  - `mongodb-uri`
  - `jwt-secret`
- App containers:
  - `collegechalo-app` (port `3000`)
  - `collegechalo-nginx` (port `80`)

### Jenkins quick bootstrap (containerized)
Run Jenkins in Docker:
```bash
docker run -d \
  --name jenkins \
  -p 18080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

Get initial admin password:
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Open:
```text
http://localhost:18080
```

After login:
1. Install suggested plugins.
2. Add credentials (`mongodb-uri`, `jwt-secret`).
3. Create Pipeline job from repo `main` using `Jenkinsfile`.
4. Add GitHub webhook to trigger builds on push.

### Jenkins health checks (owner)
```bash
# check runtime
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

# check endpoints
curl -I http://localhost:18080/login
curl -I http://localhost:3000
curl -I http://localhost:80

# inspect recent Jenkins logs
docker logs --tail 200 jenkins

# inspect recent pipeline console logs
curl -sS -u 'sameer:<API_TOKEN>' \
  'http://localhost:18080/job/collegechalo-ci/lastBuild/consoleText' | tail -n 200
```

### Jenkins known-fix checklist (owner)
If pipeline fails during deploy/health:
1. Ensure Jenkins credentials are non-empty (`mongodb-uri`, `jwt-secret`).
2. Ensure deploy container joins nginx network: `collegechalo-website_collegechalo-net`.
3. Ensure health check runs inside deployed container (`docker exec ... wget ...`).
4. Re-run pipeline and confirm:
   - `Deploy Container`
   - `Health Check`
   - `Health check passed`
   - `Finished: SUCCESS`

### Server assumptions
- Node.js + npm installed
- PM2 available (`npx pm2 ...`)
- Nginx reverse proxy configured
- Production app path often used: `/home/ubuntu/collegechalo-website`
