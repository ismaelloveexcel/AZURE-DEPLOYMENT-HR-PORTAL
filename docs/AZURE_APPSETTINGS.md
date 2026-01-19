# Azure App Service Settings for HR Portal Backend

This document lists all the application settings required for the backend API running on Azure App Service.

## Required Settings

Configure these in Azure Portal → App Service → Configuration → Application Settings:

### Authentication & Security
```
AUTH_SECRET_KEY = <generate-with-python-secrets.token_urlsafe(32)>
PASSWORD_MIN_LENGTH = 8
SESSION_TIMEOUT_MINUTES = 480
```

### Database Connection
```
DATABASE_URL = postgresql+asyncpg://<user>:<password>@hrportal-db-new.postgres.database.azure.com:5432/<dbname>?sslmode=require
```
**Note:** Use `postgresql+asyncpg://` prefix for async connections. Ensure `sslmode=require` is included.

### CORS Configuration
```
ALLOWED_ORIGINS = https://hrportal-frontend-new.azurestaticapps.net,https://your-custom-domain.com
```

### Application Environment
```
APP_ENV = production
PYTHONUNBUFFERED = 1
```

### Build Configuration (Disable Oryx build)
```
SCM_DO_BUILD_DURING_DEPLOYMENT = false
ENABLE_ORYX_BUILD = false
WEBSITES_CONTAINER_START_TIME_LIMIT = 1800
```

### Optional - Application Insights
```
APPLICATIONINSIGHTS_CONNECTION_STRING = (auto-added when Application Insights is ON)
```

## Startup Command

Configure in Azure Portal → App Service → Configuration → General Settings → Startup Command:

```bash
sh -c "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"
```

This command:
1. Runs database migrations on startup
2. Starts the FastAPI application

## Static Web App Settings

Configure in Azure Portal → Static Web App → Configuration → Application Settings:

### Frontend API URL
```
VITE_API_BASE_URL = https://hrportal-backend-new.azurewebsites.net/api
```

This tells the frontend where to find the backend API.

## How to Generate AUTH_SECRET_KEY

```python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output and use it as AUTH_SECRET_KEY.

## Verification

After deployment, verify settings are working:

1. Health check: `https://hrportal-backend-new.azurewebsites.net/healthz`
2. Readiness: `https://hrportal-backend-new.azurewebsites.net/readyz`
3. API docs: `https://hrportal-backend-new.azurewebsites.net/docs`

