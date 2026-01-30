<!--This template standardizes research-driven PRs and UAE compliance notes for Baynunah HR ESS.-->

## 1) Executive Summary
- **Problem / Goal:**
- **Scope of this PR:**
- **Outcome (what changes for users/HR):**

---

## 📦 Deployment Type & User Impact

**Select ONE deployment type:**
- [ ] 🎨 **Frontend Feature** - New UI components/pages integrated and visible to users
- [ ] 🧩 **Frontend Components** - New components added but NOT yet integrated (invisible)
- [ ] ⚙️ **Backend Feature** - New API endpoints/logic (no UI changes)
- [ ] 🔧 **Infrastructure** - Deployment/config changes only
- [ ] 📚 **Documentation** - Documentation updates only
- [ ] 🐛 **Bug Fix** - Fixes existing functionality

**Will users see changes?**
- [ ] ✅ **YES** - Users WILL see visual/functional changes (requires browser refresh)
- [ ] ⚠️ **MAYBE** - Changes added but need integration PR to be visible
- [ ] ❌ **NO** - Backend/infrastructure only, no visible changes

**If YES, describe what users will see:**
- 
- 
- 

**Integration plan (if MAYBE selected):**
- [ ] Follow-up PR planned: #___
- [ ] Integration steps documented in: _____

---

## 2) Research Shortlist (Top 3–5)
For each candidate:
- **Repo:**
  - **Stars / Last update:**
  - **License:**
  - **Tech stack:**
  - **Strengths / Gaps:**
  - **Adaptation effort** (data model, UI, tests, deployment):
  - **Link(s):**

> **Provenance:** List all repositories reviewed and any code vendored/integrated with links and license.

---

## 3) Decision & Rationale
- **Chosen path:** (Reuse/Adapt option X **or** Build from scratch)
- **Why:** (trade-offs, maintainability, license, performance, risk)
- **Rollback plan:** (how to revert if needed)

---

## 4) Implementation Notes
- **Data model changes:**
- **Key components / APIs:**
- **Theming:** (palette, typography, spacing, accessibility checks)
- **Tests:** (coverage focus, scenarios)
- **Docs updated:** (README/PLAN.md/USER_GUIDE links)

---

## 5) UAE Compliance Summary (if applicable to labour-law areas)
- **Topic(s):** (e.g., working hours, overtime, weekly rest, leave, WPS, EOS)
- **Relevant articles (numbers) & official links:**
  - Decree‑Law 33/2021: [MOHRE PDF]
  - Executive Regulations — Cabinet Resolution 1/2022: [Official PDF]
  - Working hours & Overtime guide (official): [UAE Portal], [MOHRE Guide]
- **Assumptions / edge cases:**
- **Impact on data/UX:** (e.g., overtime caps, night-shift exception, Ramadan hours)

> _Disclaimer: Informational only; not legal advice._

---

## 6) QA & Verification
- [ ] Builds/CI green
- [ ] Unit/integration tests added or updated
- [ ] Accessibility checks (contrast, focus order, keyboard nav)
- [ ] Security review (secrets, permission scopes)
- [ ] Performance sanity (largest screens, low-end device)
- [ ] Frontend build tested locally (if applicable)
- [ ] Manual verification completed (if UI changes)

---

## 7) Deployment
- **Migrations:**
- **Feature flags / config:**
- **Monitoring / telemetry:**
- **Post-deploy checks:**
- **Browser cache warning:** (Require Ctrl+Shift+R after deployment? YES/NO)
