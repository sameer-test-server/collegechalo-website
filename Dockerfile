# syntax=docker/dockerfile:1

############################
# 1) Dependencies stage
############################
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies using lockfile for reproducible builds
COPY package*.json ./
RUN npm ci --no-audit --no-fund

############################
# 2) Build stage
############################
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

# Reuse node_modules from deps for faster builds
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Webpack build is more stable for this project than Turbopack in CI
RUN npm run build -- --webpack

############################
# 3) Runtime stage
############################
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Run as non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Only copy runtime artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

USER nextjs
EXPOSE 3000

# PM2 runtime is recommended for containers (keeps process in foreground)
CMD ["./node_modules/.bin/pm2-runtime", "start", "npm", "--name", "collegechalo", "--", "start"]

