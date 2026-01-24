# HR Portal Control Room (GitHub Pages Landing)

Plain-language dashboard for a solo HR operator. Use this page to see what changed, what failed, and what to do next—without touching code.

---

## 🟢 60‑Second Checkup (Start Here)

1) **Are workflows OK?** → [Actions](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/actions?query=branch%3Amain)  
   - Green ✅ = no action needed.  
   - Red ❌ = click the latest failed run → read the first red job name → see “If something failed” below.

2) **Any pending reviews?** → [Open Pull Requests](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/pulls)  
   - “Ready to merge” label? ✅ ask to merge.  
   - “Changes requested”? ❗ Ask the owner to apply fixes.

3) **What was deployed last?** → [Deploy to Azure workflow runs](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/actions/workflows/deploy.yml)  
   - Latest run “success” ✅ means production is current.  
   - “Failed” ❌ follow the “If something failed” steps.

---

## 📡 Live App Status & Access

- **Latest production deploy:** [Deploy to Azure (recent runs)](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/actions/workflows/deploy.yml)  
  - Green ✅ = app deployed. Red ❌ = redeploy using the **Re-run** button or ask to fix the failing step.
- **Automatic health check:** [Post-Deployment Health Check](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/actions/workflows/post-deployment-health.yml)  
  - Run manually if the app feels down; it will report reachability.
- **Direct app check:** Open your production URL (default pattern: `https://<app-name>.azurewebsites.net`).  
  - Backend health: add `/api/health/db` to the URL to confirm database + admin account.  
  - Frontend: open the base URL; if blank or 500, trigger the deploy workflow above.

If all three fail (deploy red, health red, site unreachable): rerun **Deploy to Azure**, then rerun **Post-Deployment Health Check**. If still failing, create an issue and paste the error from the health check log.

---

## 👀 Understand What Changed

| Need | One-click link | How to read it |
| --- | --- | --- |
| Recent code changes | [Commits on main](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/commits/main) | The top entry is the newest. |
| All open work | [All PRs (open)](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/pulls?q=is%3Apr+is%3Aopen) | Title says what changed; labels show status. |
| Branches | [Branches](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/branches) | Focus on `main` (production) and `feature/*` (work in progress). |
| Documentation | [Docs folder](docs/) | HR-friendly guides for deployment, fixes, and FAQs. |

---

## 🚦 If Something Failed (Actions shows ❌)

1) Open the failed run → click the first red job name.  
2) Read the first error message.  
3) Match to the quick fixes:
   - **Deploy failure** → Run the 3-step script in [ULTRA_SIMPLE_SETUP.md](ULTRA_SIMPLE_SETUP.md).  
   - **Backend build/test error** → Share the log with whoever opened the PR.  
   - **Frontend build error** → Same: share the log with the PR owner.  
4) If stuck, paste the error into a new issue using **Bug report** template.

---

## 📋 Routine HR Ops Checklist

- ✅ Check Actions once per day (green = good).  
- ✅ Merge PRs only when Actions are green.  
- ✅ Keep branches tidy: delete merged branches from the PR page.  
- ✅ For deployments: use **Deploy to Azure** workflow only (others are optional/manual).  
- ✅ Store secrets in **GitHub Settings → Secrets and variables → Actions** (never in code).

---

## 🤖 AI Agents (Use These Prompts)

| Agent | When to use | Example prompt to paste |
| --- | --- | --- |
| Portal Engineer | Need a feature or bugfix | “Add a landing page section for HR status with no backend changes.” |
| Azure Deployment Specialist | Deploying or fixing Azure login/deploy issues | “Fix deploy.yml login failure; use OIDC and show secrets to set.” |
| Azure Debugger | A workflow run failed | “Investigate the latest failed Deploy to Azure run and tell me the fix.” |
| Code Quality Monitor | Quick security/quality scan | “Scan the current PR for security or performance risks.” |
| HR Assistant | HR process or UAE compliance questions | “Explain visa expiry reminders required by UAE law, cite articles.” |

Find agent guides in `.github/agents/`.

---

## 🧭 Need More Detail?

- For deployment conflicts & workflow impacts: [Deployment Workflow Guide](docs/DEPLOYMENT_WORKFLOW_GUIDE.md)  
- For the simplest copy/paste fix: [ULTRA_SIMPLE_SETUP.md](ULTRA_SIMPLE_SETUP.md)  
- For FAQ and HR usage: [HR User Guide](docs/HR_USER_GUIDE.md) and [HR Portal FAQ](docs/HR_PORTAL_FAQ.md)

If you only remember one thing: **Green Actions + merged PR = production is current.**
