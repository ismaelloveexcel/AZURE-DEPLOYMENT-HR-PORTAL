# 🚀 One-Click Deployment Guide

> **URGENT DEPLOYMENT** - Get your HR Portal running in under 5 minutes!

## Option 1: GitHub Codespaces (RECOMMENDED - Microsoft Infrastructure)

**Why Codespaces?**
- ✅ Runs on **Microsoft infrastructure** (github.dev domain)
- ✅ **Private URLs** - Users cannot tell it's not Microsoft
- ✅ **No setup required** - Everything installs automatically
- ✅ **Free tier** - 60 hours/month included
- ✅ **One-click start**

### Quick Start (2 Minutes)

1. **Click the green "Code" button** on the repository
2. **Click "Codespaces" tab**
3. **Click "Create codespace on main"**
4. **Wait 2-3 minutes** for automatic setup
5. **Done!** Your private HR Portal is running

### Access Your Portal

After setup completes:
1. Click the **PORTS** tab at the bottom of VS Code
2. Click the **globe icon** next to port **5000**
3. Your private URL opens (format: `xxxx-5000.app.github.dev`)

**This URL is PRIVATE** - only you can access it while logged into GitHub.

### Share Access (Optional)

To share with colleagues:
1. In PORTS tab, right-click port 5000
2. Select **Port Visibility** → **Private to Organization**
3. Share the URL with authorized team members

---

## Option 2: Local Desktop (Maximum Privacy)

Run entirely on your laptop - no internet exposure.

### Windows
```batch
scripts\one-click-deploy-windows.bat
```

### macOS/Linux
```bash
chmod +x scripts/one-click-deploy.sh
./scripts/one-click-deploy.sh
```

Access at: http://localhost:5000

---

## Default Login Credentials

| Employee ID | Role | Password |
|-------------|------|----------|
| BAYN00008 | Admin | Date of birth (DDMMYYYY) |

**First login**: Use your date of birth as password, then create a new secure password.

---

## Troubleshooting

### Codespaces won't start?
- Try creating a new Codespace
- Check your GitHub free hours (Settings → Billing)

### Can't access the portal?
- Ensure you're logged into GitHub
- Check PORTS tab for the correct URL
- Try refreshing the page

### Backend not responding?
```bash
# In Codespaces terminal:
cat /tmp/backend.log
```

### Frontend not loading?
```bash
# In Codespaces terminal:
cat /tmp/frontend.log
```

---

## URL Privacy

Your Codespaces URL:
- Uses `github.dev` domain (Microsoft-owned)
- Is **private by default** - only visible to you
- Can be made visible to your organization only
- Never includes words like "replit", "heroku", "vercel"

Example URL: `https://orange-adventure-abc123-5000.app.github.dev`

---

## Support

Need help? Check:
- [HR User Guide](docs/HR_USER_GUIDE.md)
- [Deployment Options](docs/GITHUB_DEPLOYMENT_OPTIONS.md)
- [Troubleshooting](docs/HR_USER_GUIDE.md#troubleshooting)
