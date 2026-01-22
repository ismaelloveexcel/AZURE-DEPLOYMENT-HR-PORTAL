# Quick Fix Guide: Azure Static Web Apps Staging Environment Limit

## The Error You're Seeing

```
This Static Web App already has the maximum number of staging environments. 
Please remove one and try again.
```

## What This Means

- Azure Static Web Apps creates a staging environment for **each Pull Request**
- Free tier allows **3 staging environments maximum**
- You currently have 3+ open PRs, hitting the limit

## Immediate Fix (5 minutes) ⚡

### Option A: Delete Old Staging Environments (Azure Portal)

1. Go to [Azure Portal](https://portal.azure.com)
2. Find your Static Web App: `baynunah-hr-portal` or similar
3. Click **"Environments"** in the left sidebar
4. You'll see a list like:
   ```
   - Production (default)
   - pr-65 (from PR #65)
   - pr-68 (from PR #68)
   - pr-71 (from PR #71)
   ```
5. For each **closed or merged PR**, click the environment → **Delete**
6. Keep only environments for **active PRs**
7. Re-run the failed workflow

### Option B: Delete Via Azure CLI

```bash
# Login to Azure
az login

# List all environments
az staticwebapp environment list \
  --name baynunah-hr-portal \
  --resource-group <your-resource-group> \
  --output table

# Delete specific environment (e.g., for closed PR #65)
az staticwebapp environment delete \
  --name baynunah-hr-portal \
  --resource-group <your-resource-group> \
  --environment-name pr-65 \
  --yes
```

### Option C: Use the New Cleanup Workflow

1. Go to **Actions** tab in GitHub
2. Select **"Cleanup Staging Environments"** workflow
3. Click **"Run workflow"**
4. Enter the environment name (e.g., `pr-65`)
5. Click **"Run workflow"** button

## Long-term Solutions (Choose One)

### Solution 1: Automatic Cleanup (RECOMMENDED) ✅

**What**: Automatically delete staging environments when PRs close

**How**: Already implemented in `.github/workflows/cleanup-staging-environments.yml`

**Benefits**:
- Automatic - no manual work
- Keeps environments fresh
- Prevents future limit issues

**Status**: ✅ Workflow file created in this PR

### Solution 2: Disable PR Previews

**What**: Only deploy to production, skip PR staging environments

**How**: Edit `.github/workflows/deploy-frontend.yml`:
```yaml
on:
  push:
    branches: [main]
  # Remove the pull_request section
```

**Benefits**:
- Never hit staging limits
- Simpler workflow

**Trade-offs**:
- No automatic PR preview links
- Must test locally

### Solution 3: Selective PR Deployment

**What**: Only deploy PRs with a specific label (e.g., `deploy-preview`)

**How**: Edit `.github/workflows/deploy-frontend.yml`:
```yaml
jobs:
  build_and_deploy:
    if: |
      github.event_name == 'push' || 
      (github.event_name == 'pull_request' && 
       contains(github.event.pull_request.labels.*.name, 'deploy-preview'))
```

**Benefits**:
- Control which PRs get previews
- Stay within limits

**Trade-offs**:
- Must remember to label PRs

### Solution 4: Upgrade Azure Tier

**What**: Upgrade from Free to Standard tier

**Cost**: ~$9/month

**Benefits**:
- 10 staging environments (instead of 3)
- Better performance
- More features

## Prevention Tips

1. **Close old PRs**: Don't let PRs sit open for weeks
2. **Clean up after merge**: Delete staging environments immediately
3. **Monitor usage**: Check Azure Portal periodically
4. **Use labels**: Consider selective deployment for high-volume periods

## Checking Current Status

### How many staging environments do I have?

**Azure Portal**:
1. Go to your Static Web App
2. Click "Environments"
3. Count non-production environments

**Azure CLI**:
```bash
az staticwebapp environment list \
  --name baynunah-hr-portal \
  --resource-group <resource-group> \
  --query "length([?name!='default'])"
```

## FAQ

**Q: Will deleting a staging environment affect my PR?**  
A: No, it only removes the preview deployment. Your code changes are safe.

**Q: Can I re-create a staging environment after deleting it?**  
A: Yes, just re-run the deployment workflow for that PR.

**Q: What happens to the production deployment?**  
A: Nothing. Production is separate and unaffected by staging limits.

**Q: How do I know which environment belongs to which PR?**  
A: Environment names are usually `pr-{number}`. Check the PR number.

## Next Steps

1. ✅ **Right now**: Delete old staging environments (Option A, B, or C above)
2. ✅ **Today**: Re-run failed workflow
3. ✅ **This week**: Review automatic cleanup workflow
4. ⏳ **Consider**: Upgrade tier if hitting limits frequently

## Get Help

- [Full solution guide](./AZURE_STATIC_WEB_APPS_STAGING_LIMIT_SOLUTION.md)
- [Azure Static Web Apps docs](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Open an issue](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/issues/new)

---

**Created**: 2026-01-22  
**Issue Reference**: [Actions Run #21230691264](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/actions/runs/21230691264/job/61109749526#step:8:1)
