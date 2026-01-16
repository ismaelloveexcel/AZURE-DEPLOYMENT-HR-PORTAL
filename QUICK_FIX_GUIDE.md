# Quick Fix Guide for Azure Deployment

**Last Updated:** January 16, 2026  
**Issue:** Azure deployment failing (17/17 recent deployments failed)  
**Fix Time:** ~5 minutes  

---

## The Problem

```
❌ Failed to fetch federated token from GitHub.
   Please make sure to give write permissions to id-token in the workflow.
```

## The Solution

### Fix 1: Add OIDC Permission (30 seconds)

**File:** `.github/workflows/deploy.yml`

**Add these lines after the `on:` section:**

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:           # ← ADD THESE 2 LINES
  id-token: write      # ← ADD THIS
  contents: read       # ← ADD THIS

jobs:
  build-and-deploy:
    # ... rest of file stays the same
```

### Fix 2: Remove Deprecated Parameter (10 seconds)

**Same file:** `.github/workflows/deploy.yml`

**Find this section (~line 130):**

```yaml
- name: Login to Azure
  uses: azure/login@v2
  with:
    client-id: ${{ secrets.AZURE_CLIENT_ID }}
    tenant-id: ${{ secrets.AZURE_TENANT_ID }}
    subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
    client-secret: ${{ secrets.AZURE_CLIENT_SECRET }}  # ← DELETE THIS LINE
```

**Delete the `client-secret` line entirely.**

---

## Azure Configuration Required

### Set Up Federated Identity in Azure Portal

1. **Navigate to:**
   - Azure Portal → Azure Active Directory → App registrations
   - Select your app (service principal used for GitHub Actions)
   - Go to: **Certificates & secrets** → **Federated credentials**

2. **Click "Add credential"**

3. **Fill in:**
   - **Scenario:** GitHub Actions deploying Azure resources
   - **Organization:** `ismaelloveexcel`
   - **Repository:** `AZURE-DEPLOYMENT-HR-PORTAL`
   - **Entity type:** Branch
   - **Branch name:** `main`
   - **Credential name:** `github-actions-main`

4. **Click "Add"**

### OR Use Azure CLI

```bash
# Get your app object ID
APP_ID=$(az ad sp list --display-name "github-actions-baynunah-hr" --query "[0].appId" -o tsv)

# Create federated credential
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-actions-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

---

## Verify GitHub Secrets

**Go to:** Repository → Settings → Secrets and variables → Actions

**Confirm these secrets exist:**

| Secret Name | Required |
|-------------|----------|
| `AZURE_CLIENT_ID` | ✅ Yes |
| `AZURE_TENANT_ID` | ✅ Yes |
| `AZURE_SUBSCRIPTION_ID` | ✅ Yes |
| `DATABASE_URL` | ✅ Yes |
| `AUTH_SECRET_KEY` | ✅ Yes |

**NOTE:** `AZURE_CLIENT_SECRET` is **NOT** needed with federated identity.

---

## Test the Fix

1. **Commit and push the changes:**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Fix: Azure deployment OIDC authentication"
   git push origin main
   ```

2. **OR trigger manually:**
   - Go to: **Actions** → **Deploy to Azure**
   - Click **"Run workflow"**
   - Select branch: `main`
   - Click **"Run workflow"**

3. **Monitor progress:**
   - Watch for "Login to Azure" step
   - Should see: ✅ "Azure CLI Login successful"

4. **Verify deployment:**
   - Visit: https://baynunah-hr-portal.azurewebsites.net/api/health
   - Expected: `{"status": "healthy"}`

---

## If It Still Fails

### Check 1: Verify Federated Credential
```bash
az ad app federated-credential list --id <APP_ID>
```

Should see a credential with:
- issuer: `https://token.actions.githubusercontent.com`
- subject: `repo:ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL:ref:refs/heads/main`

### Check 2: Verify Secrets
```bash
# In repository settings, verify each secret has a value
# Secrets will show as "Updated X days ago" if configured
```

### Check 3: Check Service Principal Permissions
```bash
az role assignment list --assignee <CLIENT_ID> --resource-group baynunah-hr-rg
```

Should have "Contributor" role.

---

## Expected Timeline

- **Fix application:** 5 minutes
- **Azure credential setup:** 2-5 minutes (if not done)
- **First deployment:** 3-5 minutes
- **Total:** ~15 minutes maximum

---

## Questions?

See full analysis: `PR_18_REVIEW.md`

## Related Documentation

- Azure Login Action: https://github.com/Azure/login#readme
- GitHub OIDC: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure
- Repository deployment docs: `DEPLOYMENT_STATUS_SUMMARY.md`
