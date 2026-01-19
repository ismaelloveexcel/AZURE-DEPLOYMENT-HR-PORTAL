# Simple Deployment Steps for HR Portal (Split Hosting)

This guide provides the essential steps for deploying the HR Portal using split hosting architecture:
- **Frontend** → Azure Static Web Apps (SWA)
- **Backend** → Azure App Service (Python 3.11)

## Overview

The HR Portal uses a split hosting architecture where the frontend (React SPA) and backend (FastAPI) are deployed separately to different Azure services. This provides better scalability, security, and follows Microsoft's recommended practices.

## Prerequisites

- Azure subscription
- GitHub repository with code
- Azure CLI installed (for OIDC setup)

---

## Quick Steps

### 1. Delete Old Resources (If Applicable)

If you have old monolith deployments:
- Delete resource group: **baynunah-hr-rg**
- Delete static web app: **insurance-renewal-portal**

### 2. Create App Service (Backend)

**In Azure Portal:**
1. Create → App Service
2. Name: `hrportal-backend-new`
3. Runtime: **Linux + Python 3.11**
4. Region: West Europe (or your preferred region)
5. Enable **Application Insights**: ON
6. Create

**Configure Settings:**
- Go to App Service → Configuration → Application Settings
- Add settings from [AZURE_APPSETTINGS.md](./AZURE_APPSETTINGS.md)
- Set **Startup Command** (from AZURE_APPSETTINGS.md)
- Click **Save**

### 3. Configure PostgreSQL Networking

**Choose ONE option:**

**Option A - Allow Azure Services (Easiest):**
- Go to PostgreSQL → Networking
- Check **"Allow public access from any Azure service"**
- Save

**Option B - Add Specific IPs:**
- Get App Service outbound IPs (Properties → Outbound IP addresses)
- Add each IP to PostgreSQL firewall rules

### 4. Create Static Web App (Frontend)

**In Azure Portal:**
1. Create → Static Web App
2. Name: `hrportal-frontend-new`
3. Hosting plan: Free
4. **Skip GitHub integration** (we use custom workflows)
5. Create
6. Go to Static Web App → Configuration → **Copy deployment token**

**Configure Settings:**
- Configuration → Application Settings
- Add: `VITE_API_BASE_URL = https://hrportal-backend-new.azurewebsites.net/api`
- Save

### 5. Set Up OIDC (GitHub ↔ Azure)

This allows GitHub Actions to deploy without storing secrets.

**Quick commands:**
```bash
az login

# Create app registration
APP_ID=$(az ad app create --display-name "GitHub-OIDC-HRPortal" --query appId -o tsv)
echo "Application (client) ID: $APP_ID"

# Create service principal
SP_OBJECT_ID=$(az ad sp create --id $APP_ID --query id -o tsv)
echo "Service Principal Object ID: $SP_OBJECT_ID"

# Assign Contributor role
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
az role assignment create \
  --role Contributor \
  --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/hrportal-rg \
  --assignee-object-id $SP_OBJECT_ID \
  --assignee-principal-type ServicePrincipal

# Add federated credential (replace ORG/REPO with your values)
TENANT_ID=$(az account show --query tenantId -o tsv)
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-main-branch",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:YOUR-ORG/AZURE-DEPLOYMENT-HR-PORTAL:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'

echo "AZURE_CLIENT_ID: $APP_ID"
echo "AZURE_TENANT_ID: $TENANT_ID"
echo "AZURE_SUBSCRIPTION_ID: $SUBSCRIPTION_ID"
```

Save these 3 values for GitHub secrets.

### 6. Configure GitHub Secrets

**Go to:** GitHub repository → Settings → Secrets and variables → Actions

**Add these secrets:**
1. `AZURE_CLIENT_ID` - From OIDC setup
2. `AZURE_TENANT_ID` - From OIDC setup
3. `AZURE_SUBSCRIPTION_ID` - From OIDC setup
4. `AZURE_STATIC_WEB_APPS_TOKEN` - From SWA deployment token (step 4)

Optional:
- `BACKEND_API_URL` - Only if different from default

### 7. Deploy

1. **Merge PR** with split hosting changes to `main` branch
2. **Watch workflows** in GitHub Actions:
   - ✅ Deploy Frontend to Azure Static Web Apps
   - ✅ Deploy Backend to Azure App Service via OIDC
3. **Verify both complete** (green checkmarks)

### 8. Verify Deployment

**Backend URLs:**
- Health: `https://hrportal-backend-new.azurewebsites.net/healthz`
- Readiness: `https://hrportal-backend-new.azurewebsites.net/readyz`
- API Docs: `https://hrportal-backend-new.azurewebsites.net/docs`

**Frontend URL:**
- App: `https://hrportal-frontend-new.azurestaticapps.net`

### 9. Enable Health Check (Backend)

**In Azure Portal:**
- App Service → Health check
- Enable: ON
- Path: `/readyz`
- Save

---

## Troubleshooting

### Backend returns 500 errors
- Check App Service logs: `az webapp log tail --name hrportal-backend-new --resource-group hrportal-rg`
- Verify database connection string
- Check Application Insights for errors

### Frontend shows blank page
- Check browser console for errors
- Verify `VITE_API_BASE_URL` is correct
- Check CORS in backend (`ALLOWED_ORIGINS`)

### GitHub workflow authentication fails
- Verify OIDC federated credential subject matches: `repo:ORG/REPO:ref:refs/heads/main`
- Check service principal has Contributor role
- Verify all 3 OIDC secrets are correct

---

## Manual Portal Steps Checklist

Use this checklist when performing the deployment:

- [ ] App Service created (hrportal-backend-new)
  - [ ] Runtime: Linux + Python 3.11
  - [ ] Application Insights enabled
  - [ ] App Settings configured (see AZURE_APPSETTINGS.md)
  - [ ] Startup Command set
- [ ] PostgreSQL networking configured (allow Azure services OR add IPs)
- [ ] Static Web App created (hrportal-frontend-new)
  - [ ] Deployment token copied
  - [ ] VITE_API_BASE_URL configured
- [ ] OIDC configured (Entra app + federated credential)
- [ ] GitHub secrets added (4 secrets)
- [ ] PR merged to main
- [ ] Workflows completed successfully
- [ ] Backend health endpoints responding
- [ ] Frontend loads successfully
- [ ] Health check enabled on App Service

---

## Required GitHub Secrets

| Secret Name | Source | Purpose |
|-------------|--------|---------|
| `AZURE_CLIENT_ID` | Entra App Registration | OIDC authentication |
| `AZURE_TENANT_ID` | Azure subscription | OIDC authentication |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription | OIDC authentication |
| `AZURE_STATIC_WEB_APPS_TOKEN` | Static Web App | Frontend deployment |

---

## URLs to Test

After deployment, test these URLs:

- **Frontend:** https://hrportal-frontend-new.azurestaticapps.net
- **Backend OpenAPI:** https://hrportal-backend-new.azurewebsites.net/docs
- **Health Check:** https://hrportal-backend-new.azurewebsites.net/healthz
