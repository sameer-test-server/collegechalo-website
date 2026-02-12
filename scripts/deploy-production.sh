#!/usr/bin/env bash
set -euo pipefail

# Runs on deployment host. Keeps deploy process deterministic and safe.
APP_DIR="${APP_DIR:-/home/ubuntu/collegechalo-website}"
APP_NAME="${APP_NAME:-collegechalo}"

cd "$APP_DIR"

echo "[deploy] Installing dependencies"
npm ci --no-audit --no-fund

echo "[deploy] Building production bundle"
npx next build --webpack

echo "[deploy] Restarting PM2 app: $APP_NAME"
npx pm2 restart "$APP_NAME" || npx pm2 start ecosystem.config.js --only "$APP_NAME"

echo "[deploy] Saving PM2 process list"
npx pm2 save

echo "[deploy] Health check"
curl -fsS -I http://127.0.0.1:3000 >/dev/null

echo "[deploy] Done"
