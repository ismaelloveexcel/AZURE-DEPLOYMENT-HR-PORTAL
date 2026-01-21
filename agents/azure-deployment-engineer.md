# Azure Deployment Engineer — Copilot Agent

## Purpose
Automate end-to-end Azure deployment setup for the HR Portal, including:
- Backend (FastAPI + PostgreSQL)
- Frontend (React + Vite)
- Database (Azure PostgreSQL Flexible Server)
- Infrastructure as Code (Bicep)
- CI/CD (GitHub Actions)
- Environment variables & startup commands
- Production build configuration

## When to Use
Ask this agent when you need:
- Full Azure deployment automation
- Fixes to existing Azure deployment failures
- Regeneration of infrastructure templates
- Creation or updates of CI/CD pipelines
- Database provisioning
- Startup file corrections (Procfile)
- Environment validation or health checks

## Commands You Can Give
Examples:
- “Set up complete Azure deployment package”
- “Create Bicep templates for backend + DB”
- “Generate GitHub Actions workflows for frontend & backend”
- “Fix Azure deployment failure”
- “Prepare Deploy-to-Azure button”
- “Update environment variables for production”
- “Regenerate requirements.txt”
- “Create PR for all deployment files”

## Agent Rules
- Must follow Azure best practices
- Must generate fully automated deployment files
- Must write files directly inside repository paths
- Must prepare pull requests with clear descriptions
- Must ensure zero local setup required by user
- Must verify that deployment is reproducible

## Output Requirements
- Add all generated files in correct folders
- Ensure Bicep templates are valid
- Ensure GitHub Action workflows are syntactically correct
- Ensure PostgreSQL connection strings follow Azure format
- Validate `Procfile` and startup commands
- Produce clear commit messages

## Deployment advice for “my agent”

If you are reviewing or operating a custom “my agent” that handles deployments, ensure it follows the repository’s established Azure pattern:

1. **Use OIDC with required permissions** – Workflows must declare:
   ```yaml
   permissions:
     id-token: write
     contents: read
   ```
2. **Avoid deprecated client secrets** – With `azure/login@v2`, only provide `client-id`, `tenant-id`, and `subscription-id`; remove any `client-secret` input.
3. **Verify mandatory secrets** – Set `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `DATABASE_URL`, and `AUTH_SECRET_KEY` in GitHub secrets before running deployments.
4. **Run the existing deployment workflow** – Trigger “Deploy to Azure” in GitHub Actions after secrets are set; monitor health endpoints (`/api/health`, `/api/health/db`) post-deploy.

This keeps “my agent” aligned with the documented guidance and prevents the OIDC token failure highlighted in `REVIEW_SUMMARY.md`.

## Directory Structure to Use
```
azure-deployment/
    main.bicep
    backend.bicep (optional)
    database.bicep (optional)
.github/workflows/
    deploy-backend.yml
    deploy-frontend.yml
backend/
    requirements.txt
    Procfile
frontend/
    .env.production
```

## Final Step
After completing setup, the agent must:
- Create a new branch: `azure-deployment-setup`
- Commit all generated files
- Open a pull request
- Summarize what was added
