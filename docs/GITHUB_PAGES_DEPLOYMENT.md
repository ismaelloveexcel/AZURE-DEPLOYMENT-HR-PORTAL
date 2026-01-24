# GitHub Pages Deployment Guide

This guide explains how to deploy the HR Portal frontend to GitHub Pages.

## ⚠️ Important Limitations

**GitHub Pages can ONLY host static files (HTML, CSS, JavaScript).** It cannot run:
- Python/FastAPI backend
- Database operations
- Server-side authentication
- API endpoints

Therefore, this deployment option deploys **ONLY the frontend** to GitHub Pages. The backend must be deployed separately.

## Prerequisites

1. **Backend Deployment**: Deploy the backend to a hosting service that supports Python/FastAPI:
   - Azure App Service (recommended, see `AZURE_DEPLOYMENT_REFERENCE_GUIDE.md`)
   - Heroku
   - Railway
   - Render
   - DigitalOcean App Platform
   - AWS Elastic Beanstalk
   
2. **Backend URL**: Note your backend API URL (e.g., `https://your-backend.azurewebsites.net/api`)

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 2. Configure Backend API URL

Add the backend API URL as a repository secret:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `API_BASE_URL`
4. Value: Your backend API URL (e.g., `https://your-backend.azurewebsites.net/api`)
5. Click **Add secret**

### 3. Deploy

The deployment happens automatically:

1. **Automatic**: Push to `main` branch triggers deployment
2. **Manual**: Go to **Actions** → **Deploy to GitHub Pages** → **Run workflow**

### 4. Access Your Application

After deployment completes:
- Frontend will be available at: `https://[username].github.io/AZURE-DEPLOYMENT-HR-PORTAL/`
- Replace `[username]` with your GitHub username or organization name

## Configuration Options

### Custom Domain

To use a custom domain instead of the default GitHub Pages URL:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `hr.yourcompany.com`)
3. Configure DNS records as instructed
4. Update `vite.config.ts`:
   ```typescript
   // Change base path for custom domain
   base: "/", // Instead of "/AZURE-DEPLOYMENT-HR-PORTAL/"
   ```

### Backend CORS Configuration

Ensure your backend allows requests from your GitHub Pages URL:

In `backend/.env` or Azure App Settings:
```bash
ALLOWED_ORIGINS=https://[username].github.io,https://your-custom-domain.com
```

## Deployment Workflow

The workflow (`.github/workflows/github-pages.yml`) performs these steps:

1. **Build**: 
   - Installs Node.js dependencies
   - Builds frontend with Vite
   - Configures API base URL
   - Sets correct base path for GitHub Pages

2. **Deploy**:
   - Uploads build artifacts
   - Deploys to GitHub Pages
   - Provides deployment URL

## Troubleshooting

### 404 Errors on Refresh

If you get 404 errors when refreshing pages, this is normal for SPAs on GitHub Pages. The workflow includes a `.nojekyll` file to help, but you may need to handle this in your app routing.

### API Connection Errors

If the frontend can't connect to the backend:

1. Verify `API_BASE_URL` secret is set correctly
2. Check backend CORS configuration allows your GitHub Pages origin
3. Ensure backend is running and accessible
4. Check browser console for specific error messages

### Assets Not Loading

If CSS/JS files return 404:

1. Verify `base` path in `vite.config.ts` matches your deployment
2. For custom domains, use `base: "/"`
3. For GitHub Pages URLs, use `base: "/AZURE-DEPLOYMENT-HR-PORTAL/"`

### Build Failures

If the workflow fails:

1. Check **Actions** tab for error logs
2. Verify `frontend/package.json` scripts are correct
3. Test build locally: `cd frontend && npm ci && npm run build`
4. Ensure all dependencies are properly listed in `package.json`

## Development vs Production

### Local Development
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5000 with backend proxy
```

### Production Build (Test Locally)
```bash
cd frontend
GITHUB_PAGES=true VITE_API_BASE_URL=https://your-backend.com/api npm run build
npm run preview
```

## Architecture

```
┌─────────────────────────────────────┐
│     GitHub Pages (Static Host)      │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Frontend (React + Vite)     │ │
│  │   - HTML, CSS, JavaScript     │ │
│  │   - Static assets             │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
                 │
                 │ HTTPS Requests
                 ▼
┌─────────────────────────────────────┐
│   Backend (Azure/Other Service)     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   FastAPI (Python)            │ │
│  │   - Authentication            │ │
│  │   - API endpoints             │ │
│  │   - Business logic            │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   PostgreSQL Database         │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Cost Comparison

| Service | GitHub Pages | Azure Alternative |
|---------|-------------|-------------------|
| **Frontend Hosting** | Free (100GB bandwidth/month) | ~$0-50/month |
| **Backend Hosting** | N/A (must use external service) | ~$13-200/month |
| **Database** | N/A (must use external service) | ~$5-100/month |
| **Total** | Free frontend + backend costs | All-in-one Azure cost |

## Switching Back to Azure

To revert to full Azure deployment:

1. Use the existing `.github/workflows/deploy.yml` workflow
2. Disable GitHub Pages in repository settings
3. Follow `docs/AZURE_DEPLOYMENT_REFERENCE_GUIDE.md`

## Security Considerations

1. **Never commit secrets**: API keys, database URLs, etc.
2. **Use repository secrets**: Store sensitive config in GitHub Secrets
3. **Enable HTTPS**: GitHub Pages enforces HTTPS automatically
4. **Configure CORS properly**: Restrict backend to known origins
5. **Keep dependencies updated**: Run `npm audit` regularly

## Next Steps

1. ✅ Enable GitHub Pages in repository settings
2. ✅ Set `API_BASE_URL` secret
3. ✅ Push to main branch or manually trigger workflow
4. ✅ Verify frontend deployment
5. ✅ Test backend connectivity
6. ✅ Configure custom domain (optional)

## Support

For issues specific to:
- **GitHub Pages deployment**: Check `.github/workflows/github-pages.yml`
- **Backend deployment**: See `docs/AZURE_DEPLOYMENT_REFERENCE_GUIDE.md`
- **Frontend build**: Check `frontend/vite.config.ts` and `frontend/package.json`
