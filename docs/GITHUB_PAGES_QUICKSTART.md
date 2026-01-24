# Quick Start: GitHub Pages Deployment

## 🚀 5-Minute Setup

### Step 1: Enable GitHub Pages
1. Go to **Settings** → **Pages**
2. Under **Source**, select: **GitHub Actions**
3. Click **Save**

### Step 2: Set Backend URL
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secret:
   - Name: `API_BASE_URL`
   - Value: `https://your-backend-url.com/api`

### Step 3: Deploy
- **Option A**: Push to `main` branch (auto-deploys)
- **Option B**: Go to **Actions** → **Deploy to GitHub Pages** → **Run workflow**

### Step 4: Access
Your app will be at:
```
https://[your-username].github.io/AZURE-DEPLOYMENT-HR-PORTAL/
```

## ⚠️ Important Notes

1. **Backend Required**: GitHub Pages only hosts the frontend. You must deploy the backend separately.

2. **Backend Options**:
   - Azure App Service (recommended)
   - Heroku
   - Railway
   - Render
   - DigitalOcean

3. **CORS Configuration**: Update backend to allow your GitHub Pages URL:
   ```bash
   ALLOWED_ORIGINS=https://[username].github.io
   ```

## 📚 Full Documentation
See [`docs/GITHUB_PAGES_DEPLOYMENT.md`](GITHUB_PAGES_DEPLOYMENT.md) for complete guide.

## 🔧 Troubleshooting

**Can't connect to backend?**
- Check `API_BASE_URL` secret is correct
- Verify backend CORS allows your GitHub Pages origin
- Check backend is running and accessible

**Build failed?**
- Check Actions tab for logs
- Test locally: `cd frontend && npm ci && npm run build`

**404 on page refresh?**
- This is normal for SPAs on GitHub Pages
- The app routing should handle this

## 🔄 Switching Between Deployments

**To GitHub Pages**: Use `.github/workflows/github-pages.yml`
**To Azure**: Use `.github/workflows/deploy.yml`

Both can coexist - just enable/disable as needed!
