# START HERE — Canonical Entry Point

## What this system is
Secure Renewals HR Portal: a full-stack HR self-service and compliance platform for UAE private-sector employers. It runs on FastAPI (Python) + React (Vite) with PostgreSQL and targets Azure App Service.

## Who this is for
- HR/Admin owners responsible for compliance, onboarding, and renewals
- Managers approving requests and viewing team status
- Engineers operating and extending the platform

## Deployment Options

### Option 1: Full Azure Deployment (Recommended)
**Azure App Service with PostgreSQL (OIDC-authenticated GitHub Actions).**

1. Prerequisites: Azure subscription, PostgreSQL instance, GitHub OIDC app registration, required secrets (`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `DATABASE_URL`, `AUTH_SECRET_KEY`).
2. Follow the canonical guide: [`docs/AZURE_DEPLOYMENT_REFERENCE_GUIDE.md`](docs/AZURE_DEPLOYMENT_REFERENCE_GUIDE.md).
3. Build and deploy via GitHub Actions workflow `deploy.yml` (main branch).

### Option 2: GitHub Pages (Frontend Only)
**Deploy frontend to GitHub Pages with backend hosted elsewhere.**

⚠️ **Important**: GitHub Pages can only host static files. The backend (API, database) must be deployed separately.

1. Deploy backend to Azure, Heroku, Railway, Render, or similar service
2. Follow the guide: [`docs/GITHUB_PAGES_DEPLOYMENT.md`](docs/GITHUB_PAGES_DEPLOYMENT.md)
3. Frontend deploys automatically via workflow `github-pages.yml`

## Essential documents (authoritative)
- Deployment (Azure): [`docs/AZURE_DEPLOYMENT_REFERENCE_GUIDE.md`](docs/AZURE_DEPLOYMENT_REFERENCE_GUIDE.md)
- Deployment (GitHub Pages): [`docs/GITHUB_PAGES_DEPLOYMENT.md`](docs/GITHUB_PAGES_DEPLOYMENT.md)
- Architecture: [`ARCHITECTURE_OVERVIEW.md`](ARCHITECTURE_OVERVIEW.md) *(foundation for responsibilities and boundaries)*
- Agents & guardrails: [`AGENT_GOVERNANCE.md`](AGENT_GOVERNANCE.md)
- Security baseline: [`SECURITY.md`](SECURITY.md)
- Contribution essentials: [`CONTRIBUTING.md`](CONTRIBUTING.md)

## Operating principles
- Single source of truth lives here; other legacy docs are informational only once deprecated.
- Keep auth, data, and infra secrets in environment/config—never in code.
- Follow UAE HR compliance rules when modifying HR, attendance, or payroll-adjacent logic (see `apps/hr-portal/**` rules).

## Next step
- **Full deployment**: go to [`docs/AZURE_DEPLOYMENT_REFERENCE_GUIDE.md`](docs/AZURE_DEPLOYMENT_REFERENCE_GUIDE.md)
- **Frontend only (GitHub Pages)**: go to [`docs/GITHUB_PAGES_DEPLOYMENT.md`](docs/GITHUB_PAGES_DEPLOYMENT.md)
- **Understand structure**: open [`ARCHITECTURE_OVERVIEW.md`](ARCHITECTURE_OVERVIEW.md)

