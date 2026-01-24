# Landing Page

This directory contains the static landing page for the Baynunah HR Portal that deploys to GitHub Pages.

## Contents

- `index.html` - Main landing page with hero section, features, compliance info, and CTA
- `styles.css` - Complete styling with responsive design
- `assets/` - Images and logos

## What This Is

A **static marketing/information page** that:
- Showcases the HR Portal features
- Highlights UAE compliance capabilities
- Provides links to documentation and GitHub repo
- Serves as a public-facing entry point

## What This Is NOT

- NOT the main HR application (that's in `/frontend` and `/backend`)
- NOT connected to the database
- NOT handling authentication or user data
- Just static HTML/CSS/JS for information purposes

## Deployment

Automatically deploys to GitHub Pages when:
- Changes pushed to this directory on `main` branch
- Workflow `.github/workflows/github-pages.yml` is manually triggered

Accessible at: `https://[username].github.io/AZURE-DEPLOYMENT-HR-PORTAL/`

## Local Preview

Simply open `index.html` in a browser:
```bash
# macOS
open landing/index.html

# Linux
xdg-open landing/index.html

# Windows
start landing/index.html
```

Or use a simple HTTP server:
```bash
cd landing
python3 -m http.server 8080
# Visit http://localhost:8080
```

## Editing

1. Edit `index.html` for content changes
2. Edit `styles.css` for styling changes
3. Add images to `assets/` directory
4. Commit and push to `main` branch
5. Landing page auto-deploys via GitHub Actions

## Design

- **Responsive**: Mobile-first design with breakpoints
- **Modern**: Gradient backgrounds, glassmorphism effects
- **Professional**: Clean typography, proper spacing
- **Fast**: No external dependencies except Google Fonts

## Links in the Page

All links point to:
- GitHub repository and documentation
- Official UAE government resources (MOHRE, UAE Labour Law)
- No hardcoded links to specific deployed instances

## Customization

To customize for your deployment:
1. Update links in `index.html` to your repository
2. Replace logos in `assets/` with your branding
3. Modify color scheme in `styles.css` CSS variables
4. Add your contact information in footer

## Technical Details

- Pure HTML/CSS/JavaScript (no build step required)
- No external dependencies except fonts
- Optimized for GitHub Pages
- Includes `.nojekyll` file (added by workflow)
- All assets are relative paths

## See Also

- Full deployment guide: `/docs/GITHUB_PAGES_DEPLOYMENT.md`
- Quick start: `/docs/GITHUB_PAGES_QUICKSTART.md`
- Main application: `/frontend` and `/backend`
