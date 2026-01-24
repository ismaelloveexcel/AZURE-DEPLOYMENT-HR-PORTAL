# Azure Static Web Apps Staging Environment Limit - Issue and Solutions

## Problem Summary

**Reference**: [GitHub Actions Run #21230691264](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/actions/runs/21230691264/job/61109749526#step:8:1)

**Error Message**:
```
The content server has rejected the request with: BadRequest
Reason: This Static Web App already has the maximum number of staging environments (System.Threading.Tasks.Task`1[System.Int32]). 
Please remove one and try again.
```

**Workflow**: `.github/workflows/deploy-frontend.yml`  
**Trigger**: Pull Request #71  
**Step**: Deploy to Azure Static Web Apps (Step 8)

## Root Cause Analysis

### What Happened?
Azure Static Web Apps automatically creates a **staging environment** for each Pull Request. This is a powerful feature that allows you to preview changes before merging. However, there are limits:

- **Free Tier**: Maximum of **3 staging environments**
- **Standard Tier**: Maximum of **10 staging environments**

When you have more open PRs than your plan allows, new PR deployments will fail with this error.

### Current Repository State
The repository has **three workflows** that deploy to Azure Static Web Apps:

1. **`deploy-frontend.yml`** (ACTIVE)
   - Triggers: Push to main, PRs on frontend changes
   - Creates staging environments for PRs
   - **This is the failing workflow**

2. **`frontend-deploy.yml`** (ACTIVE)
   - Similar configuration to deploy-frontend.yml
   - Also creates staging environments

3. **`azure-static-web-apps-proud-forest-051662503.yml`** (MANUAL-ONLY)
   - Only runs on workflow_dispatch
   - Uses different token: `AZURE_STATIC_WEB_APPS_API_TOKEN_PROUD_FOREST_051662503`

## Impact Assessment

### What's Affected?
- ✅ **Production Deployment**: NOT affected (runs on push to main)
- ❌ **PR Preview Deployments**: FAILING when staging limit is reached
- ⚠️ **Development Workflow**: Slowed down - developers can't preview changes

### Who's Affected?
- Developers creating PRs
- Reviewers who want to test changes before merge
- CI/CD pipeline automation

## Solutions (Choose One or Combine)

### Solution 1: Clean Up Old Staging Environments (IMMEDIATE FIX) ⭐ RECOMMENDED

**Action**: Manually delete unused staging environments through Azure Portal

**Steps**:
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Static Web App resource
3. In the left menu, click on **"Environments"**
4. Review the list of staging environments
5. Identify closed/merged PRs (e.g., `pr-23`, `pr-45`)
6. Click on each unused environment and select **"Delete"**
7. Keep only active PR environments

**When to Use**: 
- Immediate fix needed
- Quick resolution for current deployment failures
- No code changes required

**Advantages**:
- ✅ Immediate resolution
- ✅ No code changes needed
- ✅ Can be done right now

**Disadvantages**:
- ⚠️ Manual process
- ⚠️ Will need to repeat as more PRs accumulate

### Solution 2: Disable PR Deployments for Static Web Apps

**Action**: Modify workflow to only deploy to production (not staging)

**Implementation**:

Edit `.github/workflows/deploy-frontend.yml`:

```yaml
# Change from:
on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]

# To:
on:
  push:
    branches: [main]
  # Remove pull_request trigger
```

**When to Use**:
- You don't need PR preview deployments
- You prefer to test locally
- You want to avoid staging limits entirely

**Advantages**:
- ✅ Prevents future staging limit issues
- ✅ Reduces deployment costs
- ✅ Simpler workflow

**Disadvantages**:
- ❌ No automatic PR previews
- ❌ Can't share preview links with reviewers

### Solution 3: Use Conditional PR Deployment

**Action**: Only deploy specific PRs based on labels or conditions

**Implementation**:

Edit `.github/workflows/deploy-frontend.yml`:

```yaml
jobs:
  build_and_deploy:
    # Only deploy PRs with 'deploy-preview' label
    if: |
      github.event_name == 'push' || 
      (github.event_name == 'pull_request' && contains(github.event.pull_request.labels.*.name, 'deploy-preview'))
    runs-on: ubuntu-latest
    name: Build and Deploy Frontend
    # ... rest of the job
```

**When to Use**:
- You want PR previews but need to manage them carefully
- You have many PRs but only some need preview environments
- You want granular control

**Advantages**:
- ✅ Flexible - deploy only when needed
- ✅ Stays within staging limits
- ✅ Still enables PR previews for important changes

**Disadvantages**:
- ⚠️ Requires manual labeling
- ⚠️ Developers need to remember to add labels

### Solution 4: Automate Cleanup of Closed PR Environments

**Action**: Add a workflow to automatically clean up staging environments from closed PRs

**Implementation**:

Create `.github/workflows/cleanup-staging-environments.yml`:

```yaml
name: Cleanup Closed PR Staging Environments

on:
  pull_request:
    types: [closed]
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Close Staging Environment
        if: github.event_name == 'pull_request'
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

**When to Use**:
- You want PR previews but need automatic cleanup
- You want to minimize manual intervention
- You want to maintain development velocity

**Advantages**:
- ✅ Automatic cleanup
- ✅ Keeps staging environments fresh
- ✅ No manual intervention needed

**Disadvantages**:
- ⚠️ Requires additional workflow
- ⚠️ Cleanup happens after PR closes

### Solution 5: Upgrade Azure Static Web Apps Tier

**Action**: Upgrade from Free to Standard tier

**Cost**: ~$9/month per app  
**Staging Environments**: Increases from 3 to 10

**When to Use**:
- You have budget for it
- You need more staging environments
- You want the most reliable solution

**Advantages**:
- ✅ More capacity (10 staging environments)
- ✅ Better performance
- ✅ Additional features

**Disadvantages**:
- ❌ Monthly cost
- ⚠️ Might still hit limits with many PRs

## Recommended Approach 🎯

**For Immediate Fix**: **Solution 1** (Clean up old environments manually)

**For Long-term Solution**: **Combine Solutions**:
1. **Solution 1**: Clean up immediately
2. **Solution 4**: Add automatic cleanup workflow
3. **Solution 3**: Consider conditional deployment for high-volume PR periods

## Implementation Priority

### Priority 1: Immediate (Do Now) ⚡
- [ ] Execute Solution 1: Manually delete old staging environments
- [ ] Re-run the failed workflow for PR #71
- [ ] Verify deployment succeeds

### Priority 2: Short-term (This Week) 📅
- [ ] Implement Solution 4: Add cleanup workflow
- [ ] Test the cleanup workflow
- [ ] Document the new workflow in README

### Priority 3: Long-term (Consider) 🔮
- [ ] Evaluate if Solution 3 (conditional deployment) is needed
- [ ] Consider Solution 5 (upgrade tier) if hitting limits frequently
- [ ] Monitor staging environment usage

## How to Check Current Staging Environments

### Via Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Static Web App
3. Click **"Environments"** in left menu
4. See list of all staging environments

### Via Azure CLI
```bash
# List all environments
az staticwebapp environment list \
  --name <your-static-web-app-name> \
  --resource-group <your-resource-group>

# Delete a specific environment
az staticwebapp environment delete \
  --name <your-static-web-app-name> \
  --resource-group <your-resource-group> \
  --environment-name <environment-name>
```

## Best Practices Moving Forward

1. **Regular Cleanup**: Delete staging environments when PRs are closed/merged
2. **Label Strategy**: Use labels to control which PRs get preview deployments
3. **Monitor Usage**: Keep an eye on staging environment count
4. **Close Stale PRs**: Don't let PRs sit open indefinitely
5. **Documentation**: Keep team informed about staging limits

## Related Files

- `.github/workflows/deploy-frontend.yml` - The failing workflow
- `.github/workflows/frontend-deploy.yml` - Similar deployment workflow
- `.github/workflows/azure-static-web-apps-proud-forest-051662503.yml` - Manual-only workflow
- `staticwebapp.config.json` - Static Web App configuration

## Additional Resources

- [Azure Static Web Apps Pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/static/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Managing Environments](https://docs.microsoft.com/en-us/azure/static-web-apps/review-publish-pull-requests)
- [GitHub Actions for Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/github-actions-workflow)

## Summary

**Problem**: Too many staging environments (limit: 3 on free tier)  
**Quick Fix**: Delete old staging environments manually  
**Long-term Fix**: Add automatic cleanup workflow  
**Alternative**: Disable PR deployments or use conditional deployment

Choose the solution that best fits your team's workflow and budget.
