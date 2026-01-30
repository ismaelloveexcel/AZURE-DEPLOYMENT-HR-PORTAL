# Deployment Guide for HR Portal

## Quick Reference

### Deployment Types

Understanding what type of deployment you're making helps set expectations:

| Type | Icon | Description | User Visible? | Browser Refresh? |
|------|------|-------------|---------------|------------------|
| **Frontend Feature** | 🎨 | New UI components integrated into App.tsx | ✅ YES | **Required** (Ctrl+Shift+R) |
| **Frontend Components** | 🧩 | Components added but not imported | ❌ NO | Not needed yet |
| **Backend Feature** | ⚙️ | New API endpoints/logic | ❌ NO | Not needed |
| **Infrastructure** | 🔧 | Workflow/config changes | ❌ NO | Not needed |
| **Documentation** | 📚 | Docs only | ❌ NO | Not needed |
| **Bug Fix** | 🐛 | Fixes existing issues | ⚠️ MAYBE | If UI affected |

---

## Making Components Visible

### Problem
PR #136 added components (Avatar, StatusBadge, LoginModal, DashboardCard) but they weren't visible because they weren't **integrated** into the app.

### Solution
Components must be:
1. ✅ Created in `frontend/src/components/`
2. ✅ Imported in `App.tsx`
3. ✅ Used/rendered in the JSX

### Example: Integrating Avatar Component

**Step 1: Import**
```typescript
// Add to App.tsx imports
import { Avatar } from './components/Avatar'
```

**Step 2: Use in JSX**
```typescript
// Before (old code):
<td className="px-6 py-4 text-sm text-primary-900">{emp.name}</td>

// After (with Avatar):
<td className="px-6 py-4">
  <div className="flex items-center gap-3">
    <Avatar name={emp.name} size="sm" />
    <span className="text-sm text-primary-900">{emp.name}</span>
  </div>
</td>
```

**Step 3: Build & Deploy**
```bash
cd frontend
npm run build
# Commit and push - deployment workflow handles the rest
```

---

## PR Checklist for Component Integration

When integrating new components, always:

- [ ] Import component at top of file
- [ ] Use component in JSX (not just import)
- [ ] Test build locally (`npm run build`)
- [ ] Update PR description with "Deployment Type: 🎨 Frontend Feature"
- [ ] Mark "Will users see changes? ✅ YES"
- [ ] List what users will see in PR description
- [ ] Add "Browser cache warning: YES"

---

## Deployment Workflow

### Automatic (on push to main)

1. **Frontend Build**
   - Installs dependencies
   - Builds Vite app
   - Copies `dist/` to `backend/static/`

2. **Backend Package**
   - Creates deployment zip with:
     - Python backend code
     - Frontend static files
     - Database migrations
     - Build info

3. **Azure Deploy**
   - Uploads zip to Azure App Service
   - Runs Oryx build (installs Python deps)
   - Executes database migrations
   - Restarts app

4. **Health Checks**
   - Verifies backend responds
   - Checks database connectivity
   - Validates version number

5. **Deployment Report**
   - Creates GitHub issue with:
     - Deployment type
     - Changed files
     - User impact
     - Verification steps

### Manual Trigger

```bash
# Trigger deployment via GitHub CLI
gh workflow run deploy.yml
```

Or via GitHub UI:
1. Go to Actions tab
2. Select "Deploy to Azure" workflow
3. Click "Run workflow"
4. Select branch (usually `main`)

---

## Verifying Deployment

### 1. Check Version Number

```bash
curl https://hrportal-backend-new.azurewebsites.net/api/health/ping
```

Expected response:
```json
{
  "status": "ok",
  "version": "147",  // Should match workflow run number
  "git_commit": "abc123..."
}
```

### 2. Browser Verification

**⚠️ IMPORTANT: Clear browser cache!**

```
Chrome/Edge (Windows): Ctrl + Shift + R
Chrome/Edge (Mac):     Cmd + Shift + R
Firefox (Windows):     Ctrl + Shift + R
Firefox (Mac):         Cmd + Shift + R
Safari:                Cmd + Option + R
```

**Why?** Browsers cache static files (CSS, JS) aggressively. Without a hard refresh, you'll see the old version even though new code is deployed.

### 3. Test Key Features

- [ ] Login works (BAYN00008 / 16051988)
- [ ] Employee list loads
- [ ] Dashboard displays correctly
- [ ] Components render properly (if UI changes)
- [ ] No JavaScript errors in console (F12)

---

## Troubleshooting

### "I still see the old UI"

**Cause:** Browser cache  
**Solution:**
1. Hard refresh: Ctrl+Shift+R (see shortcuts above)
2. Clear all browser data for the site
3. Try incognito/private window
4. Check version number matches latest deployment

### "Components not showing after integration"

**Checklist:**
- [ ] Component imported in App.tsx?
- [ ] Component actually used in JSX (not just imported)?
- [ ] No TypeScript errors?
- [ ] Build succeeded without errors?
- [ ] Hard refresh browser after deployment?

**Debug:**
```bash
# Check if component is in built files
cd frontend/dist/assets
grep -l "Avatar\|StatusBadge\|LoginModal" *.js
# Should find component code in JS bundles
```

### "Deployment succeeded but app is down"

**Quick checks:**
1. Health endpoint: `curl https://hrportal-backend-new.azurewebsites.net/api/health/ping`
2. Azure portal: Check app service status
3. Application logs: Check for startup errors

**Reset admin if needed:**
```bash
curl -X POST https://hrportal-backend-new.azurewebsites.net/api/health/reset-admin-password \
  -H 'X-Admin-Secret: YOUR_AUTH_SECRET_KEY'
```

---

## Best Practices

### ✅ DO

- **Label PRs** with deployment type (🎨/🧩/⚙️/etc.)
- **Document user impact** explicitly in PR description
- **Test builds locally** before pushing
- **Check deployment report** after merge
- **Verify in production** after deployment
- **Communicate changes** to HR team if user-facing

### ❌ DON'T

- **Don't assume** components are visible just because they're in the repo
- **Don't skip** browser cache clearing when testing
- **Don't merge** without PR template completion
- **Don't forget** to check the deployment report issue
- **Don't deploy** without understanding the impact

---

## Component Integration Checklist

Use this when adding new components:

### Phase 1: Create Component
- [ ] Component created in `frontend/src/components/`
- [ ] TypeScript types defined
- [ ] Props interface documented
- [ ] Component tested in isolation

### Phase 2: Integration
- [ ] Import added to App.tsx
- [ ] Component used in JSX
- [ ] Props passed correctly
- [ ] Styling matches design system

### Phase 3: Verification
- [ ] Local build successful: `npm run build`
- [ ] No TypeScript errors
- [ ] No console errors when running
- [ ] Component renders as expected

### Phase 4: PR & Deploy
- [ ] PR template filled with deployment type
- [ ] "Will users see changes?" answered
- [ ] Browser refresh requirement noted
- [ ] Build succeeds in CI
- [ ] Deployment report reviewed after merge

### Phase 5: Post-Deploy
- [ ] Version number verified
- [ ] Browser cache cleared
- [ ] Component visible in production
- [ ] No errors in production console
- [ ] Deployment report issue closed

---

## Future Improvements

### Automated Deployment Reports

The deployment workflow now automatically:
- ✅ Detects deployment type from changed files
- ✅ Determines user impact (YES/NO/MAYBE)
- ✅ Lists what changed
- ✅ Provides verification steps
- ✅ Creates GitHub issue with report

### PR Template Enhancements

New template requires:
- ✅ Deployment type selection
- ✅ User impact documentation
- ✅ Browser refresh requirement
- ✅ Integration plan (if needed)

---

## Quick Commands

```bash
# Check current deployed version
curl https://hrportal-backend-new.azurewebsites.net/api/health/ping | jq .version

# View deployment workflow runs
gh run list --workflow=deploy.yml --limit 5

# View specific deployment logs
gh run view <run-id> --log

# Trigger manual deployment
gh workflow run deploy.yml

# Check app service logs (requires Azure CLI)
az webapp log tail --name hrportal-backend-new --resource-group baynunah-hr-portal-rg
```

---

## Contact & Support

**Questions about deployment?**
- Check deployment report issue created by workflow
- Review this guide
- Check GitHub Actions logs
- Create issue with `deployment` label

**Production issues?**
- Check health endpoint first
- Review application logs
- Contact tech support with:
  - Deployment number
  - Error messages
  - Steps to reproduce

---

**Last Updated:** January 30, 2026  
**Workflow Version:** Enhanced with auto-reports
**Template Version:** v2 with deployment types
