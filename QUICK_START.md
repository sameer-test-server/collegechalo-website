# College Chalo Quick Start

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

---
For full troubleshooting and server operations, use `commands.md`.
