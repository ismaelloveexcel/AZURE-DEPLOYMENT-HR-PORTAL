# Secure Renewals

Internal application for securely managing employee contract renewals and onboarding checks. The project is split into a FastAPI backend and a Vite + TypeScript + Tailwind frontend to keep responsibilities isolated and deployment-ready.

## Project Structure
- `backend/` – FastAPI service exposing renewal APIs and OpenAPI docs.
- `frontend/` – Vite + React client that consumes the API via a typed service layer.
- `.gitignore` – Repository hygiene rules.

## Tech Stack
- **Backend:** Python 3.11+, FastAPI, Uvicorn, Pydantic Settings, SQLAlchemy (async), Alembic
- **Frontend:** Vite, React, TypeScript, TailwindCSS

## Backend Setup
1. Navigate to `backend/`.
2. Create an `.env` file (see `.env.example`). Ensure `DATABASE_URL` points to your PostgreSQL instance (asyncpg driver).
3. Install dependencies with `uv sync` (or `pip install -r` from a generated requirements list if preferred).
4. Apply migrations: `uv run alembic upgrade head` (from the `backend` directory).
5. Run the API: `uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

The API serves OpenAPI docs at `http://localhost:8000/docs`.

## Frontend Setup
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Create a `.env` file with `VITE_API_BASE_URL=http://localhost:8000/api`.
4. Start the dev server: `npm run dev` (defaults to `http://localhost:5173`).
5. Provide a role context (e.g., `admin`, `hr`, or `viewer`) in the UI header input so requests include the `X-Role` header expected by the API.

## Deployment Notes
- Configure HTTPS termination at your ingress or proxy layer.
- Set `ALLOWED_ORIGINS` in the backend `.env` to the deployed frontend URL (comma-separated for multiples).
- Run `uv run alembic upgrade head` after configuring your database credentials before starting the API in new environments.
- Run backend and frontend as separate services or containers; no Replit-specific files remain.
- Update `backend/uv.lock` via `uv lock` in a networked environment before production deployment.

## Authorization & Roles

- **Out of scope for this phase:** Authentication and identity are handled by upstream systems. This project does not issue, validate, or store tokens, and no login endpoints exist.
- **Role context:** An external caller injects role information. For local testing, supply one of `admin`, `hr`, or `viewer` via the `X-Role` header (exposed in the UI input).
- **Permissions:** `admin` can list and create; `hr` can create and list; `viewer` can list.

## Database & Audit
- PostgreSQL persistence using SQLAlchemy 2.0 async engine.
- Alembic migrations manage schema changes.
- Audit logging captures renewal creation/updates with snapshots for traceability.
