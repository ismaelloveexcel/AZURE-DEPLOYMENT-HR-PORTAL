# Merged PR revision verification (2026-01-18)

Verified that all closed/merged pull requests have their requested revisions applied in `main`:

- [x] **PR #30 – OIDC CI/CD + health probes**  
  - `backend/app/health.py` and `app/main.py` expose `/healthz` and `/readyz`.  
  - `staticwebapp.config.json` includes expanded SPA fallbacks/security headers.  
  - OIDC workflow `backend-appservice-oidc.yml` deploys hrportal-backend-new and copies SWA config to `frontend/dist/`.  
  - Deployment docs updated (`docs/AZURE_APPSETTINGS.md`, `docs/DEPLOY_STEPS_SIMPLE.md`).

- [x] **PR #29 – Preflight hardening for App Service + SWA**  
  - Backend workflow uses Python 3.11, installs deps before `azure/webapps-deploy`, targets `hrportal-backend-new`.  
  - Frontend workflow uses Node 18 with `npm ci`, builds to `frontend/dist`, copies SWA config, and deploys with Static Web Apps action.  
  - Determinism artifacts present: `.python-version`, `.nvmrc`, `frontend/package-lock.json`.

- [x] **PR #28 – azd stack + CI/CD scaffolding**  
  - `azure.yaml` defines backend/front services with Alembic postdeploy hook; `infra/main.bicep`/`resources.bicep` provision App Service, PostgreSQL, SWA, App Insights.  
  - Workflows `backend-appservice.yml` and `frontend-staticwebapp.yml` exist; deployment docs (`docs/DEPLOY_WITH_AZD.md`, `docs/AZURE_APPSETTINGS.md`) present.

- [x] **PR #27 – CI workflow fixes + SWA config**  
  - `ci.yml` actions pinned to supported versions; SPA routing/security headers live in `staticwebapp.config.json`.  
  - `deploy-frontend.yml` present for SWA previews; first-time deployment doc exists (`docs/AZURE_FIRST_TIME_DEPLOYMENT.md`).

- [x] **PRs #25–#26 – OIDC/auth deployment guidance**  
  - `deploy.yml` uses OIDC permissions (no client secret) and secret validation aligns with documented Entra setup.  
  - Automation and troubleshooting scripts/docs present (`scripts/deploy_automated.sh`, `START_HERE.md`, `AZURE_OIDC_QUICK_SETUP.md`, `WHAT_IS_HAPPENING.md`).

- [x] **Earlier PRs (#1–#21)**  
  - Repository cleanup, security fixes, Copilot instructions, and ZIP/Azure deployment guides remain in place (`requirements.txt`, `app/main.py`, `.github/copilot-instructions.md`, `docs/AZURE_ZIP_DEPLOYMENT_GUIDE.md`, etc.).

No outstanding revision requests remain after this audit.
