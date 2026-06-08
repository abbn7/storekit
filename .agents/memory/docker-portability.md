---
name: Docker Portability — standalone deployment
description: Files created to make the project deployable independently of Replit
---

## Files Created
- `Dockerfile` — multi-stage build (frontend → API → runner)
- `docker-compose.yml` — app + postgres services, uploads volume
- `.env.example` — full template with all env vars documented
- `setup.sh` — interactive setup script (generates SESSION_SECRET, prompts for password)
- `DEPLOY.md` — updated with Docker, Railway, Render, Vercel sections (in Arabic)

## Production static serving
`app.ts` checks `FRONTEND_DIST` env var → if set and exists, Express serves built frontend + SPA fallback.
Docker build copies `artifacts/storekit/dist/public` → `/app/public` and sets `FRONTEND_DIST=/app/public`.

**Why:** Single container serves both API (/api/*) and frontend (/*) — no nginx needed.
