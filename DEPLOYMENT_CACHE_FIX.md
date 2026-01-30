# Frontend Deployment Cache Fix

## Problem Summary

**Issue:** Frontend updates were not visible after deployment, even with hard browser refresh.

**Root Cause:** JavaScript and CSS files were excluded from version control via `.gitignore`, causing deployment to serve an outdated `index.html` that referenced non-existent asset files.

## Technical Details

### Before the Fix

```
.gitignore:
  backend/static/assets/*.js   ❌ Excluded
  backend/static/assets/*.css  ❌ Excluded

backend/static/index.html:
  <script src="/assets/index-DdbE2dLk.js">  ❌ File didn't exist

Result: Browser loaded index.html but got 404 for JS/CSS → Blank page
```

### After the Fix

```
.gitignore:
  # backend/static/assets/*.js   ✅ Commented out (now tracked)
  # backend/static/assets/*.css  ✅ Commented out (now tracked)

backend/static/index.html:
  <script src="/assets/index-BZjW1sN-.js">  ✅ File exists and is committed

backend/app/main.py:
  - Custom asset handler with intelligent caching
  - index.html: NEVER cached (always fresh)
  - Hashed assets: Cached 1 year (immutable)
  - Images: Cached 1 hour

Result: Users always get latest index.html → loads correct hashed assets
```

## Caching Strategy

### 1. Index.html (Entry Point)
```python
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
Expires: 0
```
**Why:** Index.html references the hashed assets. Must always be fresh to get latest asset URLs.

### 2. Hashed Assets (JS/CSS with content hash)
```python
Cache-Control: public, max-age=31536000, immutable
```
**Pattern:** `index-BZjW1sN-.js`, `vendor-DgUtky3n.js`
**Why:** Filename contains content hash. Different content = different hash = different URL. Safe to cache forever.

### 3. Non-hashed Assets (Images)
```python
Cache-Control: public, max-age=3600
```
**Why:** Short cache for images that might change without URL change.

## Deployment Flow

### GitHub Actions Workflow (.github/workflows/deploy.yml)

```bash
1. Checkout code
2. npm install && npm run build          # Fresh build with new hashes
3. cp -r frontend/dist backend/static    # Copy to backend
4. zip backend/ (includes static/)       # Package for Azure
5. Deploy to Azure App Service
```

**Key Point:** Even though we commit built assets to git, the CI/CD workflow rebuilds them fresh on each deployment to ensure they match the source code.

## Why Track Built Assets in Git?

### Decision: Track backend/static/assets/*.js and *.css

**Pros:**
1. ✅ Deployment package always has valid assets
2. ✅ Simpler deployment process (no build step dependencies on Azure)
3. ✅ Ability to quickly verify what's deployed
4. ✅ Rollback capability (git revert includes assets)
5. ✅ Matches Azure App Service deployment model

**Cons:**
1. ❌ Adds ~1MB binary files to git history
2. ❌ PR diffs include minified JS (can be ignored)

**Alternatives Considered:**
- Build assets on Azure during deployment ❌ (Requires Node.js on App Service)
- Use separate artifact storage ❌ (Adds complexity)
- CDN for static assets ❌ (Overkill for small app)

## How to Verify Deployment

### 1. Check Version
```bash
curl https://hrportal-backend-new.azurewebsites.net/api/health/ping
```
Look for `"version": "XXX"` matching the GitHub Actions run number.

### 2. Check Asset Hash
```bash
curl https://hrportal-backend-new.azurewebsites.net/ | grep "src="
```
Should show current hashes like `index-BZjW1sN-.js`

### 3. Verify Cache Headers
```bash
# index.html should have no-cache
curl -I https://hrportal-backend-new.azurewebsites.net/

# Assets should have long cache
curl -I https://hrportal-backend-new.azurewebsites.net/assets/index-BZjW1sN-.js
```

## Troubleshooting

### "Still seeing old UI after deployment"

**Solution:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check version: `curl WEBAPP_URL/api/health/ping`
3. Verify asset hash in index.html matches committed files
4. Check browser DevTools → Network tab → Disable cache

### "Assets return 404"

**Check:**
1. Files exist in `backend/static/assets/`
2. Filenames in `index.html` match actual files
3. `.gitignore` doesn't exclude the files
4. Deployment zip includes static directory

### "Deployment succeeded but frontend blank"

**Debug:**
1. Check browser console for errors
2. Verify index.html loads: `curl WEBAPP_URL/`
3. Verify assets load: `curl WEBAPP_URL/assets/index-HASH.js`
4. Check main.py serve_assets function has no errors

## Prevention

### For Future Developers

1. **Never manually edit backend/static/** - It's generated from frontend/dist
2. **Build frontend locally to test:** `cd frontend && npm run build`
3. **Copy to backend:** `rm -rf backend/static && cp -r frontend/dist backend/static`
4. **Commit together:** Changes to frontend/src/ should include updated backend/static/
5. **Trust CI/CD:** GitHub Actions rebuilds on each deployment for consistency

### Git Commit Workflow

```bash
# Make frontend changes
cd frontend/src/
# Edit components...

# Build locally to test
cd ..
npm run build

# Copy to backend
cd ..
rm -rf backend/static
cp -r frontend/dist backend/static

# Commit both source and build
git add frontend/src/ backend/static/
git commit -m "Feature: Add new component"
```

## Files Changed in This Fix

1. **`.gitignore`**
   - Commented out exclusions for backend/static/assets/*.js and *.css
   
2. **`backend/static/index.html`**
   - Updated asset references from old hashes to new hashes
   
3. **`backend/static/assets/`**
   - Added: `index-BZjW1sN-.js` (main app code)
   - Added: `index-Bp8RIYW3.css` (styles)
   - Added: `vendor-DgUtky3n.js` (React, etc)
   - Added: `admin-CFWOoK0x.js` (admin chunk)
   - Added: `recruitment-DO5PpnVx.js` (recruitment chunk)
   
4. **`backend/app/main.py`**
   - Replaced `StaticFiles` mount with custom asset handler
   - Added regex pattern detection for hashed filenames
   - Implemented differential caching strategy

## References

- GitHub Issue: Frontend not updating after deployment
- PR: #XXX (this PR)
- Vite Documentation: https://vitejs.dev/guide/build.html#browser-hashing
- Azure App Service: https://docs.microsoft.com/en-us/azure/app-service/
