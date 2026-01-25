# 🚨 URGENT CLEANUP PLAN

> **Created:** 2026-01-25  
> **Priority:** URGENT  
> **Status:** In Progress

---

## Phase 1: Immediate Cleanup (FILES TO DELETE)

### Root Directory - Obsolete Documentation (Move to archive or delete)
These files are either deprecated, PR-specific, or duplicates of docs/ content:

| File | Reason | Action |
|------|--------|--------|
| `DEPLOYMENT_FIX_INSTRUCTIONS.md` | One-time fix doc, outdated | DELETE |
| `DEPLOYMENT_FIX_SUMMARY.md` | One-time fix doc, outdated | DELETE |
| `DEPLOYMENT_REVISION_TRACKING.md` | One-time tracking doc | DELETE |
| `PR20_GUIDANCE.md` | PR-specific, merged | DELETE |
| `PR_18_REVIEW.md` | PR-specific, deprecated | DELETE |
| `MERGED_PR_REVISION_AUDIT.md` | Audit doc, no longer needed | DELETE |
| `DEPLOYMENT_CONTINUATION_ANALYSIS.md` | Analysis doc, superseded | DELETE |
| `DEPLOYMENT_STATUS_SUMMARY.md` | Superseded by START_HERE.md | DELETE |
| `WHAT_IS_HAPPENING.md` | Temporary doc | DELETE |
| `REVIEW_SUMMARY.md` | One-time review | DELETE |
| `DASHBOARD_QUICKSTART.md` | Duplicate of docs content | DELETE |
| `EXECUTIVE_SUMMARY.md` | Superseded | DELETE |
| `VISUAL_GUIDE.md` | Superseded | DELETE |
| `INDEX.md` | Duplicate entry point | DELETE |
| `index.md` | Duplicate entry point | DELETE |
| `preview-landing.md` | Preview doc | DELETE |
| `AZURE_DEPLOYMENT_REVIEW.md` | Review doc | DELETE |
| `DEPLOYED_APP_REVIEW.md` | Review doc | DELETE |

### Root Directory - Images (Move to docs/images/)
| File | Action |
|------|--------|
| `IMG_2072.jpg` | MOVE to docs/images/ |
| `IMG_2095.jpg` | MOVE to docs/images/ |
| `IMG_2096.png` | MOVE to docs/images/ |
| `IMG_2097.png` | MOVE to docs/images/ |
| `IMG_2098.jpg` | MOVE to docs/images/ |
| `IMG_2099.jpg` | MOVE to docs/images/ |
| `IMG_2100.png` | MOVE to docs/images/ |
| `image.jpg` | MOVE to docs/images/ |
| `image.png` | MOVE to docs/images/ |
| `image_01.png` | MOVE to docs/images/ |
| `image_02.png` | MOVE to docs/images/ |
| `image_05.png` | MOVE to docs/images/ |

---

## Phase 2: Workflow Consolidation

### Current Workflows (29 total) - REDUCE TO ~15

**KEEP (Essential):**
- `ci.yml` - Core CI
- `deploy.yml` - Main deployment
- `technical-guardian-health.yml` - Health monitoring
- `technical-guardian-security.yml` - Security scanning
- `aesthetic-guardian-pr.yml` - UI/UX review
- `azure-debugger-monitor.yml` - Failure analysis
- `code-quality-monitor.yml` - Quality checks
- `azure-deployment-engineer.yml` - Infra validation
- `pr-quality-check.yml` - PR validation
- `post-deployment-health.yml` - Post-deploy checks

**CONSOLIDATE/DELETE:**
- `backend.yml` → merge into `deploy.yml`
- `backend-appservice.yml` → merge into `deploy.yml`
- `backend-appservice-oidc.yml` → merge into `deploy.yml`
- `frontend-deploy.yml` → merge into `deploy.yml`
- `frontend-pr-check.yml` → merge into `pr-quality-check.yml`
- `deploy-local.yml` → DELETE (local dev only)
- `addon-discovery.yml` → REVIEW for necessity
- `github-pages.yml` → DELETE if not using GH Pages
- `audit-log.yml` → REVIEW
- `ssl-renewal-check.yml` → REVIEW
- `backup-db.yml` → REVIEW
- `daily-recruitment-automation.yml` → REVIEW
- `user-experience.yml` → REVIEW
- `security-monitoring.yml` → merge into security scan
- `automated-maintenance.yml` → REVIEW

---

## Phase 3: PR Triage

| PR # | Title | Recommendation |
|------|-------|----------------|
| #107 | Agent inventory (current) | MERGE after cleanup |
| #82 | Attendance pass | REVIEW - valuable feature |
| #76 | Remove Google Fonts | MERGE - good security |
| #71 | UX/Recruitment/Compliance | REVIEW - large PR |
| #69 | Recruitment docs | CLOSE - superseded |
| #68 | Onboarding blueprint | REVIEW |
| #59 | [WIP] Deploy HR portal | CLOSE - stale WIP |
| #55 | Remove hardcoded secrets | MERGE - security |
| #51 | Azure deployment workflow | CLOSE - superseded |
| #48 | Deploy automation trigger | CLOSE - superseded |
| #42 | SWA workflow fix | CLOSE - superseded |
| #41 | OIDC fallback | CLOSE - superseded |
| #38 | Split hosting arch | CLOSE - superseded |
| #37 | Frontend build fix | CLOSE - superseded |

---

## Phase 4: Admin Settings System

Create `/frontend/src/components/AdminSettings.tsx`:
- Toggle-based configuration
- Feature flags management
- Field visibility controls
- Workflow customization
- Non-technical friendly UI

---

## Phase 5: Aesthetic Refresh

### Design System
- **Primary:** White (#FFFFFF)
- **Text:** Dark Blue (#1E3A5F)
- **Accent:** Green (#10B981) - icons only
- **Warning:** Yellow (#F59E0B)
- **Error:** Red (#EF4444)
- **Neutral:** Gray (#6B7280)

### Icon Style
- Outline/stroke only
- 1.5px stroke weight
- Green color (#10B981)
- From Heroicons/Lucide

---

## Execution Status

- [ ] Phase 1: File cleanup
- [ ] Phase 2: Workflow consolidation
- [ ] Phase 3: PR triage
- [ ] Phase 4: Admin settings
- [ ] Phase 5: Aesthetic refresh
