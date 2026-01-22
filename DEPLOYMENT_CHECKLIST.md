# Azure Deployment Readiness Checklist

**Project:** Baynunah HR Portal  
**Target:** Azure App Service  
**Status:** 🟢 Ready to Deploy

---

## Pre-Deployment Checklist

### ✅ Repository Files (All Complete)

- [x] Root-level `requirements.txt` exists
- [x] Root-level `app/main.py` exists
- [x] `backend/azure_startup.sh` exists and executable
- [x] `backend/static/index.html` exists (frontend built)
- [x] `.github/workflows/deploy.yml` exists
- [x] PostgreSQL database migrations ready

**Status:** ✅ ALL REQUIRED FILES PRESENT

---

### ✅ GitHub Secrets (Configured)

Configure these in: **Settings → Secrets and variables → Actions**

#### Required Secrets

- [x] **AZURE_CLIENT_ID**
  - Purpose: Azure OIDC authentication (client ID)
  - How: `az ad app list --display-name "GitHub Actions - HR Portal" --query "[0].appId" -o tsv`
  - Format: GUID
  - Time: 2 minutes

- [x] **AZURE_TENANT_ID**
  - Purpose: Azure OIDC authentication (tenant ID)
  - How: `az account show --query tenantId -o tsv`
  - Format: GUID
  - Time: 1 minute

- [x] **AZURE_SUBSCRIPTION_ID**
  - Purpose: Azure OIDC authentication (subscription ID)
  - How: `az account show --query id -o tsv`
  - Format: GUID
  - Time: 1 minute

- [x] **DATABASE_URL**
  - Purpose: PostgreSQL connection
  - Format: `postgresql+asyncpg://uutfqkhm:{password}@baynunahhrportal-server.postgres.database.azure.com:5432/hrportal?sslmode=require`
  - How: Get from Azure Portal or construct manually
  - Time: 3 minutes

- [x] **AUTH_SECRET_KEY**
  - Purpose: JWT token signing
  - How: Run `openssl rand -hex 32`
  - Format: 64-character hex string
  - Time: 1 minute

**Optional (Configured):**

- [x] **ALLOWED_ORIGINS**
  - Purpose: CORS allow-list (frontend URLs)
  - Format: Comma-separated URLs
  - Example: `https://baynunah-hr-portal.azurewebsites.net`

**Status:** ✅ All required secrets configured (deployment unblocked)

---

### ✅ Azure Resources (Ready)

Check these exist in Azure Portal:

- [x] **PostgreSQL Server:** `baynunahhrportal-server`
  - Admin: `uutfqkhm`
  - Password: May need reset
  - Database: `hrportal` (will be created by scripts)

- [x] **Resource Group:** `BaynunahHR`
  - Auto-creates if missing ✅

- [x] **App Service Plan:** `BaynunahHRPlan`
  - Auto-creates if missing ✅

- [x] **Web App:** `BaynunahHRPortal`
  - Auto-creates if missing ✅

- [x] **Virtual Network:** `BaynunahHRPortalVnet`
  - Configured in deployment scripts ✅

**Status:** ✅ Target resources present or provisioned automatically

---

## Deployment Execution Checklist

### Before Triggering Deployment

- [x] All required GitHub secrets configured
- [x] PostgreSQL password set via `POSTGRES_PASSWORD` secret
- [x] Reviewed deployment workflow in `.github/workflows/deploy.yml`
- [x] Confirmed resource group name: `BaynunahHR`
- [x] Confirmed app name: `BaynunahHRPortal`

### Trigger Deployment

Choose one method:

- [ ] **Method A:** Push to `main` branch (automatic)
- [ ] **Method B:** GitHub Actions → Deploy to Azure → Run workflow
- [ ] **Method C:** Run `scripts/deploy_automated.sh`

### Monitor Deployment

- [ ] Watch GitHub Actions logs
- [ ] Look for "✅ Deployment completed" message
- [ ] Check for any error messages
- [ ] Expected duration: 5-10 minutes

### Verify Deployment

- [ ] **Health endpoint responds:**
  ```bash
  curl https://baynunahhrportal.azurewebsites.net/api/health
  ```
  Expected: `{"status": "ok"}`

- [ ] **Database health check passes:**
  ```bash
  curl https://baynunahhrportal.azurewebsites.net/api/health/db
  ```
  Expected: `{"status": "healthy", "database": "connected"}`

- [ ] **Frontend loads:**
  Open: https://baynunahhrportal.azurewebsites.net

- [ ] **API docs accessible:**
  Open: https://baynunahhrportal.azurewebsites.net/docs

---

## Post-Deployment Checklist

### Immediate Verification (5 min)

- [ ] Can access login page
- [ ] API documentation loads
- [ ] Health check endpoint returns 200
- [ ] Database health check passes

### Functional Testing (15 min)

- [ ] **Login Test**
  - [ ] Can log in as admin (BAYN00008)
  - [ ] JWT token issued correctly
  - [ ] Session persists after refresh

- [ ] **Data Access Test**
  - [ ] Employee list loads
  - [ ] Can view employee details
  - [ ] Search functionality works

- [ ] **Compliance Features Test**
  - [ ] Visa expiry dates display
  - [ ] Emirates ID tracking visible
  - [ ] Contract dates calculate correctly

### Performance Check (5 min)

- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] No console errors in browser
- [ ] No 500 errors in logs

### Security Verification (5 min)

- [ ] HTTPS enforced (no HTTP access)
- [ ] API requires authentication
- [ ] Unauthorized requests return 401
- [ ] CORS configured correctly

---

## Troubleshooting Checklist

### If Deployment Fails

- [ ] Check GitHub Actions logs for errors
- [ ] Verify all required secrets are correctly configured
- [ ] Confirm PostgreSQL password is correct
- [ ] Check Azure Portal for resource status
- [ ] Review `az webapp log tail` output

### If Health Check Fails

- [ ] Wait 60 seconds (app may still be starting)
- [ ] Check application logs: `az webapp log tail --name BaynunahHRPortal --resource-group BaynunahHR`
- [ ] Verify database connection string
- [ ] Check if migrations ran successfully
- [ ] Restart app: `az webapp restart --name BaynunahHRPortal --resource-group BaynunahHR`

### If Login Fails

- [ ] Reset admin password using emergency endpoint:
  ```bash
  curl -X POST https://baynunahhrportal.azurewebsites.net/api/health/reset-admin-password \
    -H "X-Admin-Secret: YOUR_AUTH_SECRET_KEY"
  ```
- [ ] Try default credentials: BAYN00008 / 16051988
- [ ] Check browser console for errors
- [ ] Verify AUTH_SECRET_KEY is correctly set

### If Database Connection Fails

- [ ] Verify DATABASE_URL secret format
- [ ] Confirm PostgreSQL server is running
- [ ] Check firewall rules allow Azure services
- [ ] Verify VNet integration is configured
- [ ] Test connection string manually

---

## Rollback Checklist

### If Critical Issues Found

- [ ] Document the issue clearly
- [ ] Create GitHub issue with details
- [ ] Go to Actions → Find previous successful deployment
- [ ] Click "Re-run jobs" to rollback
- [ ] Wait for rollback to complete
- [ ] Verify previous version works
- [ ] Notify users of issue and resolution

---

## Documentation Checklist

### After Successful Deployment

- [ ] Update README with deployment date
- [ ] Document any configuration changes
- [ ] Note any manual steps performed
- [ ] Record production URLs
- [ ] Save admin credentials securely
- [ ] Share deployment summary with team

### Create Monitoring Plan

- [ ] Set up Azure Application Insights (optional)
- [ ] Configure alerts for errors
- [ ] Schedule regular health checks
- [ ] Plan for log retention
- [ ] Document escalation procedures

---

## Sign-Off

### Deployment Complete When:

- [x] All pre-deployment items checked
- [ ] Deployment executed successfully
- [ ] All post-deployment verifications passed
- [ ] No critical issues found
- [ ] Documentation updated
- [ ] Team notified

**Deployed by:** ___________________  
**Date:** ___________________  
**Deployment method:** ___________________  
**Issues encountered:** ___________________  
**Notes:** ___________________

---

## Quick Reference

### Key Commands

```bash
# View logs
az webapp log tail --name BaynunahHRPortal --resource-group BaynunahHR

# Restart app
az webapp restart --name BaynunahHRPortal --resource-group BaynunahHR

# SSH to app
az webapp ssh --name BaynunahHRPortal --resource-group BaynunahHR

# Check health
curl https://baynunahhrportal.azurewebsites.net/api/health

# Reset admin password
curl -X POST https://baynunahhrportal.azurewebsites.net/api/health/reset-admin-password \
  -H "X-Admin-Secret: YOUR_AUTH_SECRET_KEY"
```

### Key URLs

- App: https://baynunahhrportal.azurewebsites.net
- API Docs: https://baynunahhrportal.azurewebsites.net/docs
- Health: https://baynunahhrportal.azurewebsites.net/api/health
- DB Health: https://baynunahhrportal.azurewebsites.net/api/health/db

### Support Resources

- Main Report: `AZURE_DEPLOYMENT_REVIEW.md`
- Quick Summary: `DEPLOYMENT_STATUS_SUMMARY.md`
- Deployment Guide: `DEPLOYMENT_SIMPLE_GUIDE.md`
- Azure Reference: `docs/AZURE_DEPLOYMENT_REFERENCE_GUIDE.md`
- Emergency Guide: `docs/ROLLBACK_RECOVERY_GUIDE.md`

---

**Last Updated:** January 14, 2026  
**Version:** 1.0  
**Status:** 🟡 Ready for deployment after secret configuration
