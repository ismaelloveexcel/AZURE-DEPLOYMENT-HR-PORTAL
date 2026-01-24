# GitHub Pages - Landing Page Only

This guide explains how to deploy the **landing page** to GitHub Pages.

## What Gets Deployed

**Only the static landing page** from the `/landing` directory gets deployed to GitHub Pages. This includes:
- Marketing/information page about the HR Portal
- Features overview
- UAE compliance highlights
- Links to documentation and GitHub repository

**The main HR application** (frontend + backend) remains deployed on Azure.

## Quick Setup

### 1. Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

### 2. Deploy

The landing page deploys automatically:
- **Automatic**: Push changes to `/landing` directory on `main` branch
- **Manual**: Go to **Actions** → **Deploy Landing Page to GitHub Pages** → **Run workflow**

### 3. Access

Landing page will be at:
```
https://[username].github.io/AZURE-DEPLOYMENT-HR-PORTAL/
```

## What This Means

```
┌─────────────────────────────────────┐
│     GitHub Pages (Landing Only)     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Landing Page (HTML/CSS)     │ │
│  │   - Marketing content         │ │
│  │   - Features overview         │ │
│  │   - Links to docs             │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Azure (Full HR Application)       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Frontend (React)            │ │
│  │   Backend (FastAPI)           │ │
│  │   Database (PostgreSQL)       │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Editing the Landing Page

The landing page files are in `/landing`:
- `landing/index.html` - Main HTML content
- `landing/styles.css` - Styling
- `landing/assets/` - Images and logos

To make changes:
1. Edit files in `/landing` directory
2. Commit and push to `main` branch
3. Workflow automatically redeploys

## Custom Domain (Optional)

To use a custom domain for the landing page:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `hr.yourcompany.com`)
3. Configure DNS records as instructed
4. Landing page will be accessible at your custom domain

## Deployment Workflow

The workflow (`.github/workflows/github-pages.yml`) triggers on:
- Push to `main` branch that modifies `/landing` directory
- Manual workflow dispatch
- Changes to the workflow file itself

## Troubleshooting

### Landing Page Shows 404

1. Verify GitHub Pages is enabled in Settings
2. Check workflow ran successfully in Actions tab
3. Wait a few minutes for DNS propagation

### Changes Not Reflecting

1. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache
3. Check if workflow completed successfully

### Assets Not Loading

1. Verify all asset paths in HTML are relative
2. Check that images exist in `/landing/assets/`
3. Ensure `.nojekyll` file is present (workflow adds this automatically)

## Main Application

The landing page is separate from the main HR application:
- **Landing**: Information/marketing page on GitHub Pages
- **Application**: Full HR portal on Azure
- **Documentation**: See `docs/AZURE_DEPLOYMENT_REFERENCE_GUIDE.md` for deploying the full application

## Cost

- **GitHub Pages**: Free for public repositories
- **Main Application**: See Azure pricing (deployed separately)

## Support

For issues:
- Landing page: Check `.github/workflows/github-pages.yml`
- Main application: See `docs/AZURE_DEPLOYMENT_REFERENCE_GUIDE.md`
- General: Open issue on GitHub repository
