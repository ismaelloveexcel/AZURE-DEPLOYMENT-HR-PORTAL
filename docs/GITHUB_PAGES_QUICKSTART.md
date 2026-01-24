# Quick Start: Deploy Landing Page to GitHub Pages

## 🚀 2-Minute Setup

### Step 1: Enable GitHub Pages
1. Go to **Settings** → **Pages**
2. Under **Source**, select: **GitHub Actions**
3. Click **Save**

### Step 2: Deploy
- **Option A**: Push to `main` branch (auto-deploys landing page)
- **Option B**: Go to **Actions** → **Deploy Landing Page to GitHub Pages** → **Run workflow**

### Step 3: Access
Your landing page will be at:
```
https://[your-username].github.io/AZURE-DEPLOYMENT-HR-PORTAL/
```

## 📄 What Gets Deployed

**Only the static landing page** from `/landing` directory:
- Marketing/information page
- Features overview
- UAE compliance highlights
- Links to docs and GitHub

**Main HR application stays on Azure**

## ✏️ Edit the Landing Page

Files are in `/landing`:
- `landing/index.html` - Content
- `landing/styles.css` - Styling  
- `landing/assets/` - Images

Make changes, commit, push to `main` → auto-redeploys!

## 🌐 Custom Domain (Optional)

1. Go to **Settings** → **Pages**
2. Add custom domain (e.g., `info.yourcompany.com`)
3. Configure DNS as instructed

## 🔧 Troubleshooting

**404 error?**
- Wait 2-3 minutes for deployment
- Check Actions tab for workflow status
- Hard refresh browser (Ctrl+F5)

**Changes not showing?**
- Clear browser cache
- Verify workflow completed in Actions tab

## 📚 Full Documentation
See [`docs/GITHUB_PAGES_DEPLOYMENT.md`](GITHUB_PAGES_DEPLOYMENT.md) for complete guide.

## 💡 Key Points

✅ **Landing page** → GitHub Pages (free)  
✅ **Main application** → Azure (see `AZURE_DEPLOYMENT_REFERENCE_GUIDE.md`)  
✅ **Auto-deploys** when you modify `/landing` directory  
✅ **No backend needed** for landing page (it's just HTML/CSS)
