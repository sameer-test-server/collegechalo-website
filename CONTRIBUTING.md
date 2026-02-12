# Contributing Guide

## Branch Strategy
- `main`: production-ready code only
- `feature/*`: all regular changes
- `hotfix/*`: urgent production fixes

## Local Workflow
1. Create a branch:
```bash
git checkout -b feature/short-description
```
2. Make changes and test:
```bash
npx tsc --noEmit
npm test -- --runInBand
```
3. Commit:
```bash
git add .
git commit -m "clear change summary"
```
4. Push:
```bash
git push origin feature/short-description
```
5. Open Pull Request to `main`.

## Merge Rules
- Do not push directly to `main`.
- Merge only after:
  - passing Jenkins pipeline
  - quick functional check on live/staging URL

## Deployment Rule
- Jenkins auto-deploy runs only for `main`.
- Keep feature branches for review/testing.

## Emergency Hotfix
1. Create:
```bash
git checkout -b hotfix/issue-name
```
2. Fix and test quickly.
3. Merge to `main`.
4. Confirm Jenkins deploy and health checks.
