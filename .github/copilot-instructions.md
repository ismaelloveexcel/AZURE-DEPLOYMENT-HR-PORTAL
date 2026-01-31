# Copilot Coding Agent Instructions

## Core Mission
Support the UAE-focused Secure Renewals HR Portal; compliance accuracy beats feature count, and legal-sensitive flows must cite MOHRE sources in PRs.

## Architecture Snapshots
- Backend lives in [backend/app](backend/app) with FastAPI routers → services → repositories; never bypass services when touching persistence.
- Gate protected endpoints with require_role from [backend/app/core/security.py](backend/app/core/security.py) and sanitize inbound text with sanitize_text in Pydantic validators.
- Startup seeds and consistency fixes run from [backend/app/startup_migrations.py](backend/app/startup_migrations.py); keep new data migrations idempotent and AsyncSession-safe.
- [backend/app/main.py](backend/app/main.py) wires routers, SlowAPI rate limiting, and SPA static serving; add new modules there after defining router/service/repository layers.
- Database access is async via [backend/app/database.py](backend/app/database.py); rely on clean_database_url_for_asyncpg so postgres:// URLs become asyncpg-ready and SSL-aware.
- Background attendance jobs run through [backend/app/services/attendance_scheduler.py](backend/app/services/attendance_scheduler.py); stop/start hooks already called in app lifespan.

## Frontend Shape
- Modern UI entry point is [frontend/src/RouterApp.tsx](frontend/src/RouterApp.tsx); legacy screens still ride inside App fallback, so new sections should prefer dedicated pages under [frontend/src/pages](frontend/src/pages).
- Shared auth state is provided by [frontend/src/contexts/AuthContext.tsx](frontend/src/contexts/AuthContext.tsx); API calls go through [frontend/src/services/api.ts](frontend/src/services/api.ts) and must respect `VITE_API_BASE_URL`.
- Styling mixes Tailwind-style utility classes with scoped CSS; follow admin cards in [frontend/src/pages/AdminDashboard.tsx](frontend/src/pages/AdminDashboard.tsx) for layout patterns.

## Data & Compliance Patterns
- Employee compliance calculations live in [backend/app/services/employees.py](backend/app/services/employees.py); reuse its alert helpers when adding expiry-driven features.
- CSV ingestion (employees, passes) expects dual header formats; copy the branching logic in the same service instead of rolling custom parsers.
- Feature toggles and admin settings flow through [backend/app/routers/admin.py](backend/app/routers/admin.py) and the system_settings table; introduce new flags there for safe rollouts.

## Local Workflows
- Backend: `cd backend && uv sync && uv run alembic upgrade head && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`.
- Frontend: `cd frontend && npm install && npm run dev` for development, `npm run build` before packaging.
- Combined startup helpers live in [scripts/start-portal.sh](scripts/start-portal.sh) (Unix) and [scripts/start-portal-windows.bat](scripts/start-portal-windows.bat).
- Type safety gates mirror CI: `cd backend && uv run mypy app` and `cd frontend && npm run lint`; [.github/workflows/ci.yml](.github/workflows/ci.yml) runs the same checks.

## Deployment Notes
- Local zip deployments use [deploy_to_azure.sh](deploy_to_azure.sh); deploy.yml builds the frontend then copies assets into backend/static before publishing to Azure App Service.
- Runtime env vars follow [backend/.env.example](backend/.env.example); use sqlite URLs only for dev, production stays on PostgreSQL with SSL.
- Health and recovery endpoints live in [backend/app/routers/health.py](backend/app/routers/health.py); admins reset passwords via `/api/health/reset-admin-password` with the X-Admin-Secret header.

## Contribution Expectations
- Keep PRs narrow, document manual testing, and refresh docs under [docs](docs) when behavior shifts.
- Never commit secrets, avoid string-built SQL, and lean on repository helpers for database work.

## See Also: Extended Copilot Guidance

The detailed guidance that previously lived in this file has been split into focused documents. When making non-trivial changes, especially around security or architecture, review:

- **docs/architecture.md** — 3-layer backend pattern, async conventions, and feature module examples.
- **docs/security.md** — Input sanitization (`sanitize_text`), SQL injection prevention, JWT auth flow, and sensitive-data handling.
- **docs/troubleshooting.md** — Common login issues, async/sync pitfalls, database connectivity, and migration conflicts.
- **docs/AZURE_DEPLOYMENT_REFERENCE_GUIDE.md** — Deployment, CI/CD, and environment configuration details.

The `hr-portal-chief` agent file is expected to complement these repo-wide standards (not override them). If any guidance appears to conflict, prefer the patterns documented here and in the architecture/security docs, and update the agent file in a follow-up PR to keep them aligned.
