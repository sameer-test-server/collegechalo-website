# College Chalo Quick Start

## 0) Daily start after PC reboot (simple)
1) Open **Docker Desktop** and wait until it says “Running”.
2) Open Terminal and run:
```bash
cd /Users/sameer/collegechalo-website
docker compose up -d app nginx jenkins
```
3) Start webhook relay (so Jenkins auto-triggers on GitHub push):
```bash
cd /Users/sameer/collegechalo-website
npx pm2 start "npx smee-client --url https://smee.io/6FhEuRlsPNdFKuO --target http://127.0.0.1:18081/hook" --name jenkins-smee
npx pm2 start scripts/jenkins-webhook-relay.cjs --name jenkins-webhook-relay
npx pm2 save
```
4) Check that everything is running:
```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
npx pm2 status
```
5) Open the website:
- Main site: `http://127.0.0.1`
- Jenkins: `http://127.0.0.1:18080`

## 1) Start local dev
```bash
cd /Users/sameer/collegechalo-website
npm install
npm run dev
```

Open: `http://localhost:3000`

## 2) Build + run production locally
```bash
cd /Users/sameer/collegechalo-website
npm run build -- --webpack
npm run start:prod
```

## 3) PM2 daily commands
Start app (if missing):
```bash
cd /Users/sameer/collegechalo-website
npx pm2 start npm --name collegechalo -- start
```

Reload after changes:
```bash
npx pm2 reload collegechalo
```

Status + logs:
```bash
npx pm2 status
npx pm2 logs collegechalo --lines 120
```

## 4) Deploy latest changes (fast)
```bash
cd /Users/sameer/collegechalo-website
git pull
npm install
npm run build -- --webpack
npx pm2 reload collegechalo
npx pm2 status
```

## 5) If UI changes are not visible
```bash
cd /Users/sameer/collegechalo-website
npm run build -- --webpack
npx pm2 reload collegechalo
```

Then hard refresh browser (`Cmd+Shift+R`).

## 6) If PM2 says app not found
```bash
cd /Users/sameer/collegechalo-website
npx pm2 start npm --name collegechalo -- start
npx pm2 status
```

## 7) If site is down (quick recovery)
```bash
cd /Users/sameer/collegechalo-website
npx pm2 status
npm run build -- --webpack
npx pm2 restart collegechalo
npx pm2 logs collegechalo --lines 120
```

## 8) One-time PM2 persistence
```bash
npx pm2 save
```

## 9) Jenkins webhook auto-trigger quick check
```bash
npx pm2 status
npx pm2 logs jenkins-smee --lines 30 --nostream
npx pm2 logs jenkins-webhook-relay --lines 30 --nostream
curl -g -sS -u 'sameer:<API_TOKEN>' \
  "http://localhost:18080/job/collegechalo-ci/api/json?tree=lastBuild[number,building,result,url],lastCompletedBuild[number,result,url],inQueue"
```

---
For full troubleshooting and server operations, use `commands.md`.
