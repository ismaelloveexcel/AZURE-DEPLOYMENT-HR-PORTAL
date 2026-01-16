# 🔧 IMMEDIATE DEPLOYMENT FIX - Step by Step

## 🚨 Problem Summary

Your GitHub Actions workflow is configured for OIDC authentication, but Azure AD doesn't have the federated credential configured yet. This causes the error:

```
Failed to fetch federated token from GitHub. 
Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable.
```

## ✅ Solution: Configure Azure Federated Credential

### Prerequisites
- Azure CLI installed (`az --version`)
- Access to Azure subscription with appropriate permissions

---

## 🎯 Quick Fix (5 Minutes)

Run these commands in your terminal:

### Step 1: Login to Azure
```bash
az login
```

### Step 2: Get Your Application ID

**Option A:** If you already have an Azure AD app named "GitHub Actions - HR Portal":
```bash
APP_ID=$(az ad app list --display-name "GitHub Actions - HR Portal" --query "[0].appId" -o tsv)
echo "Your APP_ID: $APP_ID"
```

**Option B:** If the app doesn't exist or you get nothing, create it:
```bash
# Create the app
az ad app create --display-name "GitHub Actions - HR Portal"

# The output will show the appId - save it!
# Then set it manually:
APP_ID="YOUR-APP-ID-FROM-OUTPUT"
```

### Step 3: Verify Service Principal Exists
```bash
# Create service principal if it doesn't exist
az ad sp create --id $APP_ID

# Grant contributor role to resource group
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
az role assignment create \
  --role Contributor \
  --assignee $APP_ID \
  --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/baynunah-hr-rg
```

### Step 4: Create Federated Credential (THE KEY STEP!)
```bash
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-actions-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL:ref:refs/heads/main",
    "description": "GitHub Actions deployment from main branch",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

**Expected output:**
```json
{
  "audiences": ["api://AzureADTokenExchange"],
  "description": "GitHub Actions deployment from main branch",
  "issuer": "https://token.actions.githubusercontent.com",
  "name": "github-actions-main",
  "subject": "repo:ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL:ref:refs/heads/main"
}
```

✅ If you see this output, the federated credential is configured!

### Step 5: Update GitHub Secrets

Get the values you need:
```bash
echo "=== Copy these to GitHub Secrets ==="
echo "AZURE_CLIENT_ID:        $APP_ID"
echo "AZURE_TENANT_ID:        $(az account show --query tenantId -o tsv)"
echo "AZURE_SUBSCRIPTION_ID:  $(az account show --query id -o tsv)"
```

Go to: https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/settings/secrets/actions

**Add or UPDATE these secrets:**
- `AZURE_CLIENT_ID` = The APP_ID value
- `AZURE_TENANT_ID` = The tenant ID value  
- `AZURE_SUBSCRIPTION_ID` = The subscription ID value

**IMPORTANT:** 
- Do NOT add `AZURE_CLIENT_SECRET` - it's not needed with OIDC!
- If `AZURE_CLIENT_SECRET` exists, you can leave it (it will be ignored)

### Step 6: Test the Deployment

**Option A: Manual trigger (recommended for testing)**
1. Go to: https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/actions/workflows/deploy.yml
2. Click "Run workflow" dropdown
3. Click "Run workflow" button
4. Watch the logs - you should see ✅ "Login to Azure" succeed

**Option B: Push to main**
```bash
# Make a small change
echo "# Deployment fix applied" >> README.md
git add README.md
git commit -m "Test OIDC deployment configuration"
git push origin main
```

---

## 🔍 Verification

After setup, verify the federated credential exists:
```bash
az ad app federated-credential list --id $APP_ID
```

You should see your credential listed.

---

## ❌ Troubleshooting

### Error: "Application with identifier 'xxx' was not found"
**Fix:** Your APP_ID is wrong. List all apps:
```bash
az ad app list --query "[].{name:displayName, appId:appId}" -o table
```
Find your app and use its appId.

### Error: "No matching federated identity record found"
**Fix:** The subject string must match exactly. Run Step 4 again.

### Error: "AuthorizationFailed"
**Fix:** The service principal needs Contributor role. Run:
```bash
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
az role assignment create \
  --role Contributor \
  --assignee $APP_ID \
  --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/baynunah-hr-rg
```

### Still failing after all steps?
Check that ALL three secrets exist in GitHub:
- AZURE_CLIENT_ID
- AZURE_TENANT_ID  
- AZURE_SUBSCRIPTION_ID
- DATABASE_URL
- AUTH_SECRET_KEY

---

## 📋 What PR #20 Does

PR #20 adds OIDC documentation and removes the `client-secret` validation check. The main branch ALREADY has OIDC configured in the workflow, so:

- ✅ You can merge PR #20 after Azure is configured
- ✅ Or close PR #20 - it's mainly documentation improvements

The CRITICAL step is configuring Azure federated credential (Step 4 above), not the PR.

---

## 🎉 Success Criteria

You'll know it's working when:
1. ✅ GitHub Actions workflow passes the "Login to Azure" step
2. ✅ Deployment completes successfully
3. ✅ App is accessible at: https://baynunah-hr-portal.azurewebsites.net

---

## 📚 More Information

- Full OIDC guide: `AZURE_OIDC_QUICK_SETUP.md`
- Detailed setup: `docs/AZURE_OIDC_SETUP.md`
- General deployment: `docs/GITHUB_DEPLOYMENT_SETUP.md`
