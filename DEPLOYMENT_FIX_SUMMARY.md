# Deployment Fix Summary

## Issue
All GitHub Actions deployments failing with OIDC authentication error.

## Root Cause
- GitHub workflow configured for OIDC authentication ✅
- Azure AD federated credential NOT configured ❌

## Deployment/Login Causes (Observed)
- Missing or mismatched OIDC federated credential → Azure login step fails.
- Incorrect or missing `DATABASE_URL` / `AUTH_SECRET_KEY` → app boots but login fails or admin reset endpoint breaks.
- `ALLOWED_ORIGINS` missing the frontend URL → browser blocks auth calls with CORS errors.

## Accelerators (Fast Checks)
- Confirm GitHub secrets: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `DATABASE_URL`, `AUTH_SECRET_KEY` (and optional `ALLOWED_ORIGINS`).
- Verify app settings match secrets: `az webapp config appsettings list --name baynunah-hr-portal --resource-group baynunah-hr-rg`.
- Hit health endpoints before troubleshooting login: `/api/health/ping` and `/api/health/db`.

## Solution
Configure Azure federated credential by running ONE Azure CLI command.

## Quick Fix (Copy-Paste This)

```bash
# Login to Azure
az login

# Get app ID (or create app if needed)
APP_ID=$(az ad app list --display-name "GitHub Actions - HR Portal" --query "[0].appId" -o tsv)

# If APP_ID is empty, create the app:
if [ -z "$APP_ID" ]; then
  az ad app create --display-name "GitHub Actions - HR Portal"
  APP_ID=$(az ad app list --display-name "GitHub Actions - HR Portal" --query "[0].appId" -o tsv)
fi

echo "Using APP_ID: $APP_ID"

# Create service principal (if not exists)
az ad sp create --id $APP_ID 2>/dev/null || echo "Service principal already exists"

# Grant permissions
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
az role assignment create \
  --role Contributor \
  --assignee $APP_ID \
  --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/baynunah-hr-rg \
  2>/dev/null || echo "Role assignment already exists"

# THE KEY FIX: Create federated credential
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-actions-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL:ref:refs/heads/main",
    "description": "GitHub Actions deployment from main branch",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# Verify
echo ""
echo "=== Federated credentials configured: ==="
az ad app federated-credential list --id $APP_ID

echo ""
echo "=== Update GitHub secrets with these values: ==="
echo "AZURE_CLIENT_ID:        $APP_ID"
echo "AZURE_TENANT_ID:        $(az account show --query tenantId -o tsv)"
echo "AZURE_SUBSCRIPTION_ID:  $(az account show --query id -o tsv)"
echo ""
echo "Go to: https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/settings/secrets/actions"
```

## After Running the Commands

1. Verify GitHub secrets are set:
   - AZURE_CLIENT_ID
   - AZURE_TENANT_ID
   - AZURE_SUBSCRIPTION_ID
   - DATABASE_URL
   - AUTH_SECRET_KEY

2. Test deployment:
   - Go to: https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/actions/workflows/deploy.yml
   - Click "Run workflow"
   - Watch for ✅ "Login to Azure" step to succeed

3. About PR #20:
   - It's just documentation
   - Can be merged after fix OR closed (optional)
   - Main branch already has OIDC configured

## Success Indicators
- ✅ Azure login step passes in GitHub Actions
- ✅ Deployment completes successfully
- ✅ App accessible at https://baynunah-hr-portal.azurewebsites.net

## If Still Failing
Check:
1. APP_ID matches AZURE_CLIENT_ID secret
2. Federated credential subject matches exactly (case-sensitive)
3. All 5 GitHub secrets exist
4. Resource group name is "baynunah-hr-rg" (or adjust in commands)

## Files Created
- `WHAT_IS_HAPPENING.md` - Explanation of the issue
- `DEPLOYMENT_FIX_INSTRUCTIONS.md` - Detailed step-by-step
- This file - Quick reference

## Why It Was Confusing
- Workflow was already converted to OIDC in earlier PR
- Azure side was never configured to match
- Token "expiration" is normal (short-lived by design)
- Real issue: Azure doesn't issue tokens without federated credential
