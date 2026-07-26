---
name: Railway Deployment
description: How the project is configured for Railway; GitHub repo location; required env vars and volumes
---

## GitHub Repo
- URL: https://github.com/abdelhamednada631-del/storekit
- Branch: main
- Remote name: origin

## Railway Config
- `railway.toml` at repo root — builder: dockerfile, healthcheck: /api/healthz
- `Dockerfile` — 4-stage: deps → frontend-builder → api-builder → runner
- Frontend built to `/app/public/`, served as static files by Express
- API server on port 8080

## Required Environment Variables in Railway
- DATABASE_URL — auto-injected from Railway PostgreSQL plugin (do NOT set manually)
- SESSION_SECRET — random 64+ char string
- ADMIN_PASSWORD — admin dashboard password
- NODE_ENV — production
- PORT — 8080
- FRONTEND_DIST — /app/public
- UPLOAD_DIR — /app/uploads
- VITE_CLERK_PUBLISHABLE_KEY — from clerk.com
- CLERK_SECRET_KEY — from clerk.com

## Critical: Volumes for Image Persistence
Must add Railway Volume mounted at /app/uploads — otherwise uploaded images are lost on redeploy.

**Why:** Docker containers are ephemeral; Railway volumes persist across deployments.
**How to apply:** In Railway service → Volumes → Add Volume → Mount: /app/uploads
