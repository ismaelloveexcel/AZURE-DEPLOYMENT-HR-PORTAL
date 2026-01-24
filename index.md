# HR Portal Control Room (GitHub Pages Landing)

> This is the canonical GitHub Pages landing page. Ensure GitHub Pages is enabled (Settings → Pages → Deploy from branch: `main`, folder `/`).

Plain-language dashboard for a solo HR operator. Use this page to see what changed, what failed, and what to do next—without touching code.

---

## 🟢 60-Second Checkup (Start Here)

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

## 🧰 Power Maintenance Panel (No-Code Actions)

| Action | What it does | Click here | When to use |
| --- | --- | --- | --- |
| Redeploy app | Rebuilds frontend + backend and redeploys to Azure | [Deploy to Azure workflow](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/actions/workflows/deploy.yml) → **Run workflow** | App is outdated or unhealthy |
| Run health scan | Pings the live app and reports reachability | [Post-Deployment Health Check](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/actions/workflows/post-deployment-health.yml) → **Run workflow** | Suspect downtime; after redeploy |
| Quick app open | Opens production site | Replace `<app-name>` and open: `https://<app-name>.azurewebsites.net` | Confirm site loads |
| Backend health JSON | Confirms DB + admin exist | `https://<app-name>.azurewebsites.net/api/health/db` | Validate database connectivity |
| Reset admin password | Uses built-in endpoint (needs AUTH_SECRET_KEY) | `POST https://<app-name>.azurewebsites.net/api/health/reset-admin-password` with header `X-Admin-Secret: <AUTH_SECRET_KEY>` | Admin login broken |

> **Security warning:** The `AUTH_SECRET_KEY` for **Reset admin password** is highly sensitive. Only authorized admins should use it. Never store or share it in repo, Pages, issues, or logs. Keep it only in secure secret stores (GitHub Secrets / Azure App Settings).
| File a ticket | Opens pre-filled bug report | [New bug report](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/issues/new?template=bug_report.md) | When unsure or blocked |

**How to run a workflow:** Click the link → “Run workflow” → keep defaults → “Run workflow”. No code required.

---

## 🤖 Agent Shortcuts (1 Click)

| Task | Agent | Open |
| --- | --- | --- |
| Plan/build a feature | Portal Engineer | [Portal Engineer guide](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/blob/main/.github/agents/portal-engineer.md) |
| HR/domain guidance | HR Assistant | [HR Assistant guide](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/blob/main/.github/agents/hr-assistant.md) |
| Security/quality scan | Code Quality Monitor | [Code Quality Monitor guide](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/blob/main/.github/agents/code-quality-monitor.md) |
| Fix broken deploy | Azure Deployment Specialist | [Azure Deployment Specialist guide](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/blob/main/.github/agents/azure-deployment-specialist.md) |
| Investigate Azure issues | Azure Debugger | [Azure Debugger guide](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/blob/main/.github/agents/azure-debugger.md) |

Read the guide you open, then copy/paste your request there—it tells you exactly what to ask.

---

## 💡 Improve the App (No-Code Requests)

| Goal | What happens | Click here |
| --- | --- | --- |
| Request a new feature | Opens feature request form (plain questions) | [New feature request](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/issues/new?template=feature_request.md) |
| Ask AI to plan & build | Portal Engineer agent drafts the change | Open `.github/agents/portal-engineer.md` and paste: “Plan and implement <your idea> end-to-end.” |
| Security/quality scan on a branch | Code Quality Monitor reviews for risks | Open `.github/agents/code-quality-monitor.md` and paste: “Scan branch <branch-name> for security/performance.” |
| Deployment help for new change | Azure Deployment Specialist guides deployment | Open `.github/agents/azure-deployment-specialist.md` and paste your branch + goal. |

After a request: track it in [Open issues](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/issues) or [Open PRs](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/pulls). Green Actions + merged PR = live.

---

## 👀 Understand What Changed

| Need | One-click link | How to read it |
| --- | --- | --- |
| Recent code changes | [Commits on main](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/commits/main) | The top entry is the newest. |
| All open work | [All PRs (open)](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/pulls?q=is%3Apr+is%3Aopen) | Title says what changed; labels show status. |
| Branches | [Branches](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/branches) | Focus on `main` (production) and `feature/*` (work in progress). |
| Documentation | [Docs folder](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/tree/main/docs) | HR-friendly guides for deployment, fixes, and FAQs. |

---

## 🚦 If Something Failed (Actions shows ❌)

1) Open the failed run → click the first red job name.  
2) Read the first error message.  
3) Match to the quick fixes:
   - **Deploy failure** → Run the 3-step script in [ULTRA_SIMPLE_SETUP.md](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/blob/main/ULTRA_SIMPLE_SETUP.md).  
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

- For deployment conflicts & workflow impacts: [Deployment Workflow Guide](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/blob/main/docs/DEPLOYMENT_WORKFLOW_GUIDE.md)  
- For the simplest copy/paste fix: [ULTRA_SIMPLE_SETUP.md](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/blob/main/ULTRA_SIMPLE_SETUP.md)  
- For FAQ and HR usage: [HR User Guide](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/blob/main/docs/HR_USER_GUIDE.md) and [HR Portal FAQ](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/blob/main/docs/HR_PORTAL_FAQ.md)

If you only remember one thing: **Green Actions + merged PR = production is current.**
