# Agent Integration Guide
## How to Use Your Personal Agents

This guide explains how to use the specialized agents created for the HR Portal, including the new **Aesthetic Guardian** and **Technical Guardian** agents.

---

## Available Agents

### 1. **HR Assistant** (`.github/agents/hr-assistant.md`)
**Purpose:** HR workflows, employee management, compliance, and portal system guidance

**Use when you need to:**
- Import bulk employee data
- Set up onboarding workflows
- Manage contract renewals
- Generate compliance reports
- Understand HR module features

**Example prompts:**
```
"@hr-assistant Help me import 50 employees from a CSV file"
"@hr-assistant How do I set up the probation tracking module?"
"@hr-assistant Generate a compliance report for visa expiries"
```

---

### 2. **Portal Engineer** (`.github/agents/portal-engineer.md`)
**Purpose:** Full-stack development, API implementation, database design, bug fixes

**Use when you need to:**
- Add new features (endpoints, components, modules)
- Fix technical bugs
- Design database schemas
- Optimize performance
- Troubleshoot deployment issues

**Example prompts:**
```
"@portal-engineer Add a leave management module with approval workflow"
"@portal-engineer Fix the slow employee search query"
"@portal-engineer Create a new API endpoint for attendance tracking"
```

---

### 3. **Azure Debugger** (`.github/agents/azure-debugger.md`)
**Purpose:** Azure deployment troubleshooting, CI/CD pipeline fixes

**Use when you need to:**
- Fix failed deployments
- Debug Azure App Service issues
- Resolve GitHub Actions workflow problems
- Troubleshoot database connection issues
- Fix authentication/OIDC problems

**Example prompts:**
```
"@azure-debugger Why is my deployment failing with error X?"
"@azure-debugger The app is deployed but returns 502 errors"
"@azure-debugger Database migrations are not running"
```

---

### 4. **Azure Deployment Engineer** (`.github/agents/azure-deployment-engineer.md`)
**Purpose:** End-to-end Azure setup, infrastructure as code, deployment automation

**Use when you need to:**
- Set up Azure infrastructure from scratch
- Configure CI/CD pipelines
- Implement deployment slots
- Set up monitoring and alerts
- Automate infrastructure management

**Example prompts:**
```
"@azure-deployment-engineer Set up a new production environment"
"@azure-deployment-engineer Implement blue-green deployment"
"@azure-deployment-engineer Configure Application Insights"
```

---

### 5. **Code Quality Monitor** (`.github/agents/code-quality-monitor.md`)
**Purpose:** Security scanning, code quality checks, vulnerability detection

**Use when you need to:**
- Scan for security vulnerabilities
- Check code quality metrics
- Find performance issues
- Detect code smells
- Review dependency security

**Example prompts:**
```
"@code-quality-monitor Scan the codebase for security issues"
"@code-quality-monitor Check if our dependencies have vulnerabilities"
"@code-quality-monitor Review the code quality of the new feature"
```

---

### 6. **Aesthetic Guardian** ⭐ NEW (`.github/agents/aesthetic-guardian.md`)
**Purpose:** UI/UX quality, visual consistency, accessibility, design improvements

**Use when you need to:**
- Review UI/UX design quality
- Ensure accessibility compliance
- Find visual inconsistencies
- Improve user experience
- Get design recommendations

**Example prompts:**
```
"@aesthetic-guardian Review the employee dashboard design"
"@aesthetic-guardian Check accessibility compliance for the login page"
"@aesthetic-guardian Suggest improvements for the employee list view"
"@aesthetic-guardian Find GitHub examples of modern HR dashboards"
```

**What it does automatically:**
- Monitors for color contrast issues
- Checks responsive design
- Detects missing loading states
- Ensures consistent typography
- Recommends modern design patterns from GitHub

---

### 7. **Technical Guardian** ⭐ NEW (`.github/agents/technical-guardian.md`)
**Purpose:** System health monitoring, proactive issue detection, automated fixes

**Use when you need to:**
- Monitor system health 24/7
- Detect performance issues
- Find and fix security vulnerabilities
- Optimize database queries
- Get technical recommendations

**Example prompts:**
```
"@technical-guardian Run a full system health check"
"@technical-guardian Analyze API performance metrics"
"@technical-guardian Check for database optimization opportunities"
"@technical-guardian Find and fix security vulnerabilities"
```

**What it does automatically:**
- Monitors health endpoints
- Detects slow queries
- Finds missing database indexes
- Identifies security vulnerabilities
- Creates GitHub issues for problems
- Auto-fixes code formatting and security issues

---

## How Agents Work Together

### Example Workflow 1: Adding a New Feature

**Step 1:** Planning with HR Assistant
```
"@hr-assistant I want to add employee performance reviews. 
What features should I include?"
```
→ HR Assistant provides requirements and workflow design

**Step 2:** Implementation with Portal Engineer
```
"@portal-engineer Implement the performance review module 
based on the requirements from @hr-assistant"
```
→ Portal Engineer creates backend APIs and frontend components

**Step 3:** Design Review with Aesthetic Guardian
```
"@aesthetic-guardian Review the performance review UI 
and suggest improvements"
```
→ Aesthetic Guardian ensures design quality and consistency

**Step 4:** Quality Check with Technical Guardian
```
"@technical-guardian Scan the new performance review code 
for issues"
```
→ Technical Guardian checks security, performance, and code quality

**Step 5:** Code Review with Code Quality Monitor
```
"@code-quality-monitor Review the performance review pull request"
```
→ Code Quality Monitor ensures best practices

**Step 6:** Deployment with Azure Deployment Engineer
```
"@azure-deployment-engineer Deploy the performance review feature 
to production"
```
→ Azure Deployment Engineer handles the deployment

---

### Example Workflow 2: Fixing a Performance Issue

**Step 1:** Detection by Technical Guardian
```
Technical Guardian automatically detects:
"⚠️ API endpoint /api/employees taking 3.2 seconds"
```

**Step 2:** Investigation
```
"@technical-guardian Analyze why /api/employees is slow"
```
→ Identifies N+1 query problem and missing database index

**Step 3:** Fix Implementation
```
"@portal-engineer Fix the slow employee query based on 
@technical-guardian's analysis"
```
→ Portal Engineer implements the fix

**Step 4:** Verification
```
"@technical-guardian Verify the performance improvement"
```
→ Confirms query now takes <100ms

---

### Example Workflow 3: UI/UX Improvement

**Step 1:** Aesthetic Guardian Weekly Audit
```
Aesthetic Guardian automatically identifies:
"📋 Employee dashboard has inconsistent spacing and missing 
empty states"
```

**Step 2:** Get Recommendations
```
"@aesthetic-guardian Show me modern examples of employee 
dashboards from GitHub"
```
→ Provides links to 3-5 high-quality examples with analysis

**Step 3:** Implementation
```
"@portal-engineer Implement the dashboard improvements 
suggested by @aesthetic-guardian"
```

**Step 4:** Accessibility Check
```
"@aesthetic-guardian Verify the updated dashboard meets 
WCAG 2.1 AA standards"
```

---

## Agent Activation Methods

### 1. Direct Mention in Issues/PRs
```markdown
@aesthetic-guardian please review this PR for design quality
```

### 2. GitHub Actions Workflows
Agents can be triggered automatically:
```yaml
- name: Run Technical Guardian
  uses: ./.github/agents/technical-guardian.md
```

### 3. VS Code Integration
Use GitHub Copilot Chat:
```
"Using the aesthetic-guardian agent, review this component"
```

### 4. Command Line (GitHub CLI)
```bash
gh issue create \
  --title "Review dashboard design" \
  --body "@aesthetic-guardian please review the employee dashboard" \
  --assignee aesthetic-guardian
```

---

## Best Practices

### 1. **Choose the Right Agent**
- UI/design issues → **Aesthetic Guardian**
- Technical/performance issues → **Technical Guardian**
- New features → **Portal Engineer** + **HR Assistant**
- Deployment problems → **Azure Debugger**
- Infrastructure setup → **Azure Deployment Engineer**
- Security/quality → **Code Quality Monitor**

### 2. **Provide Context**
Good prompt:
```
"@portal-engineer Add a leave management module with:
- Multiple leave types (annual, sick, emergency)
- Approval workflow (employee → manager → HR)
- Leave balance tracking
- Calendar view"
```

Bad prompt:
```
"@portal-engineer add leaves"
```

### 3. **Use Agents in Sequence**
For complex tasks, use agents in order:
1. Planning → **HR Assistant**
2. Implementation → **Portal Engineer**
3. Design review → **Aesthetic Guardian**
4. Technical review → **Technical Guardian**
5. Deployment → **Azure Deployment Engineer**

### 4. **Let Agents Collaborate**
Agents can reference each other:
```
"@portal-engineer implement the feature designed by @hr-assistant 
following the design guidelines from @aesthetic-guardian"
```

---

## Monitoring Agent Activities

### 1. **Automatic Reports**

**Technical Guardian** (Daily at 9 AM):
```
📊 Daily System Health Report
- API Response Time: 150ms (avg)
- Error Rate: 0.02%
- Database Query Performance: 3 slow queries detected
- Security: No vulnerabilities found
- Recommendations: Add index on employees.department
```

**Aesthetic Guardian** (Weekly on Monday):
```
🎨 Weekly Design Audit
- Accessibility Score: 92/100
- Design Consistency: 3 issues found
- Performance Score: 95/100
- Recommendations:
  1. Fix color contrast on login button
  2. Add loading states to employee list
  3. Improve empty state design
```

### 2. **GitHub Issues**
Agents automatically create issues:
```
Issue #123 (created by Technical Guardian)
🔧 Slow Query Detected: get_employees_by_department

Severity: Medium
Query Time: 3.2s → Should be <200ms
Recommended Fix: Add index on department column
```

### 3. **Pull Requests**
Agents can create auto-fix PRs:
```
PR #124 (created by Technical Guardian)
🤖 Auto-fix: Add database index for performance

Changes:
- Added migration for employees.department index
- Query performance improved: 3.2s → 50ms
```

---

## Customizing Agents

### Modify Agent Behavior

Edit the agent markdown files to customize:

```markdown
# In .github/agents/aesthetic-guardian.md

## Customization: Company Branding

Primary Colors:
- Brand Blue: #0066CC (change this to your brand color)
- Success Green: #10B981
- Error Red: #EF4444

Typography:
- Headings: Montserrat (change to your preferred font)
- Body: Inter
```

### Add New Rules

```markdown
# In .github/agents/technical-guardian.md

## Custom Rules

### Performance Targets
- API endpoints must respond in <200ms (was <500ms)
- Database queries must complete in <50ms (was <100ms)
```

---

## Troubleshooting

### Agent Not Responding?
1. Check if agent file exists in `.github/agents/`
2. Verify GitHub Actions have necessary permissions
3. Check if mention format is correct (`@agent-name`)

### Agent Gave Wrong Advice?
1. Provide more context in your prompt
2. Reference specific files/lines of code
3. Ask agent to explain its reasoning
4. Use a different agent if needed

### Agent Created Too Many Issues?
Adjust sensitivity in agent configuration:
```markdown
## Issue Creation Rules
- Only create issues for severity: HIGH or CRITICAL
- Group similar issues together
- Limit: Max 5 issues per day
```

---

## Quick Reference Card

| Task | Agent | Command |
|------|-------|---------|
| Import employees | HR Assistant | `@hr-assistant import employees from CSV` |
| Add new feature | Portal Engineer | `@portal-engineer add [feature]` |
| Fix deployment | Azure Debugger | `@azure-debugger fix deployment error` |
| Review design | Aesthetic Guardian | `@aesthetic-guardian review [component]` |
| Check security | Technical Guardian | `@technical-guardian security scan` |
| Optimize performance | Technical Guardian | `@technical-guardian optimize [endpoint]` |
| Deploy to Azure | Azure Deployment Engineer | `@azure-deployment-engineer deploy` |
| Code review | Code Quality Monitor | `@code-quality-monitor review PR` |

---

## Getting Started

### Quick Start Guide

**Step 1:** Try each agent with a simple task
```bash
# Create test issues
gh issue create --title "Test Aesthetic Guardian" \
  --body "@aesthetic-guardian review the login page"

gh issue create --title "Test Technical Guardian" \
  --body "@technical-guardian run health check"
```

**Step 2:** Review agent responses
- Check issue comments for responses
- Review any auto-created PRs
- Read the recommendations

**Step 3:** Use agents in your workflow
- Mention agents in PR descriptions
- Create issues for agent tasks
- Reference agents in code reviews

---

## Support

### Need Help?
1. **Check agent documentation** in `.github/agents/`
2. **Review examples** in this guide
3. **Ask an agent** for help:
   ```
   "@hr-assistant How do I use agents effectively?"
   ```

### Found a Bug?
Report issues with agent behavior:
```
Title: Agent Bug: Technical Guardian not detecting slow queries
Body: 
@technical-guardian is not detecting the slow query in 
/api/employees. The query takes 5 seconds but no issue was created.

Expected: Issue should be auto-created
Actual: No issue created
```

---

**Last Updated:** January 20, 2026  
**Version:** 1.0  
**Maintained by:** Azure System Engineer

