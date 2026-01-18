# Azure App Settings Reference

Use these values after provisioning to configure the new stack. Do **not** commit secrets.

## Backend (App Service: `hrportal-backend-new`)

Set the following App Service configuration values:

| Setting | Value |
| --- | --- |
| `AUTH_SECRET_KEY` | Strong random secret (e.g., `python -c "import secrets;print(secrets.token_urlsafe(32))"`). |
| `PASSWORD_MIN_LENGTH` | `8` (or higher if your policy requires). |
| `SESSION_TIMEOUT_MINUTES` | `480` (8 hours). |
| `DATABASE_URL` | `postgresql://<user>:<password>@hrportal-db-new.postgres.database.azure.com:5432/postgres?sslmode=require` (update username/password if you change the defaults). |

Application Insights connection strings are injected automatically by `infra/main.bicep`.

Configure via:

```bash
azd env set AUTH_SECRET_KEY <secret>
azd env set PASSWORD_MIN_LENGTH 8
azd env set SESSION_TIMEOUT_MINUTES 480
azd env set DATABASE_URL "postgresql://<user>:<password>@hrportal-db-new.postgres.database.azure.com:5432/postgres?sslmode=require"
azd deploy
```

Or set them in the Azure Portal under **App Service > Configuration > Application settings**.

## Frontend (Static Web App: `hrportal-frontend-new`)

Set the build-time environment variable for API calls:

| Setting | Value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://hrportal-backend-new.azurewebsites.net/api` |

Configure via Azure Portal (**Static Web App > Configuration**) or pass it into the GitHub Actions workflow as an environment variable.
