# Agent Workflow Examples

This document provides real-world examples of using the GitHub Copilot agents to accomplish common tasks in the Secure Renewals HR Portal.

## Example 1: Implementing an Onboarding Module

### Scenario
You need to implement a complete employee onboarding module with checklists, task assignment, and progress tracking.

### Using the Agents

#### Step 1: Planning with HR Assistant
**Open**: `.github/agents/hr-assistant.md`

**Ask**: 
```
"I need to implement an employee onboarding module for the HR portal. 
What features should it include and how should the workflow work?"
```

**Expected Guidance**:
- Feature list (automated checklists, task assignments, document collection)
- Workflow diagram (new hire → checklist creation → task assignment → progress tracking → completion)
- Automation opportunities (auto-create checklist on hire, email reminders, auto-assign tasks)
- Integration points with existing employee management

#### Step 2: Search for Existing Modules
**Continue with HR Assistant**

**Ask**:
```
"Search GitHub for open-source onboarding checklist modules 
that work with FastAPI and PostgreSQL"
```

**Expected Results**:
- Curated list of relevant repositories
- Evaluation based on:
  - Active maintenance
  - License compatibility
  - Code quality
  - Similar tech stack
  - Security considerations

#### Step 3: Database Design with Portal Engineer
**Open**: `.github/agents/portal-engineer.md`

**Ask**:
```
"Design the database schema for an onboarding module with:
- Onboarding checklists per department
- Individual tasks with owners and due dates
- Progress tracking
- Document collection

Provide SQLAlchemy models and Alembic migration."
```

**Expected Output**:
```python
# Models
class OnboardingChecklist(Base):
    __tablename__ = "onboarding_checklists"
    id = Column(Integer, primary_key=True)
    employee_id = Column(String(20), ForeignKey("employees.employee_id"))
    department = Column(String(100))
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    tasks = relationship("OnboardingTask", back_populates="checklist")

class OnboardingTask(Base):
    __tablename__ = "onboarding_tasks"
    id = Column(Integer, primary_key=True)
    checklist_id = Column(Integer, ForeignKey("onboarding_checklists.id"))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    owner = Column(String(20))
    due_date = Column(DateTime)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

# Migration file provided
```

#### Step 4: Implement Backend with Portal Engineer
**Continue with Portal Engineer**

**Ask**:
```
"Create the complete backend implementation:
1. Schemas for request/response
2. Repository for database operations
3. Service layer with business logic
4. Router with API endpoints

Follow the existing portal patterns."
```

**Expected Output**:
Complete code files following the established pattern:
- `backend/app/schemas/onboarding.py`
- `backend/app/repositories/onboarding.py`
- `backend/app/services/onboarding.py`
- `backend/app/routers/onboarding.py`

#### Step 5: Implement Frontend with Portal Engineer
**Continue with Portal Engineer**

**Ask**:
```
"Create React components for the onboarding module:
1. OnboardingDashboard - shows all active checklists
2. ChecklistView - displays tasks for a specific employee
3. TaskItem - individual task with complete/incomplete toggle
4. CreateChecklist - form to create new checklist

Use TypeScript and TailwindCSS consistent with existing components."
```

**Expected Output**:
- `frontend/src/types/onboarding.ts` - TypeScript interfaces
- `frontend/src/services/onboardingService.ts` - API client
- `frontend/src/components/Onboarding/OnboardingDashboard.tsx`
- `frontend/src/components/Onboarding/ChecklistView.tsx`
- `frontend/src/components/Onboarding/TaskItem.tsx`

#### Step 6: Quality Check with Code Quality Monitor
**Open**: `.github/agents/code-quality-monitor.md`

**Ask**:
```
"Scan the new onboarding module for:
- Security vulnerabilities
- Missing error handling
- Performance issues
- Accessibility concerns
Focus on files in backend/app/**/onboarding.py and frontend/src/components/Onboarding/"
```

**Expected Findings**:
- Security review of input validation
- Check for SQL injection risks
- Verify authorization on endpoints
- Performance analysis of queries
- Accessibility audit of components

#### Step 7: Fix Issues with Portal Engineer
**Switch back to Portal Engineer**

**Ask**:
```
"Fix the issues found in the quality check:
1. [List specific issues from quality monitor]
2. Add missing error handling
3. Optimize the checklist query
4. Add ARIA labels to task components"
```

### Result
Complete, production-ready onboarding module implemented following best practices, with security verified and performance optimized.

---

## Example 2: Optimizing Database Performance

### Scenario
Users report that the employee listing page is slow. You need to identify and fix performance issues.

### Using the Agents

#### Step 1: Identify Issues with Code Quality Monitor
**Open**: `.github/agents/code-quality-monitor.md`

**Ask**:
```
"Scan the employee listing functionality for performance issues.
Check backend/app/routers/employees.py and related service/repository files."
```

**Expected Findings**:
- N+1 query problem when loading employees with their renewals
- Missing database indexes on frequently queried columns
- Inefficient pagination implementation
- Unnecessary data being loaded

#### Step 2: Optimize Queries with Portal Engineer
**Open**: `.github/agents/portal-engineer.md`

**Ask**:
```
"Fix the N+1 query issue in the employee listing.
Current code loads renewals in a loop.
Provide optimized version using joins or eager loading."
```

**Expected Output**:
```python
# Before (N+1 problem)
async def list_employees(skip: int, limit: int):
    employees = await db.execute(
        select(Employee).offset(skip).limit(limit)
    )
    for emp in employees:
        renewals = await db.execute(
            select(Renewal).where(Renewal.employee_id == emp.id)
        )
        emp.renewals = renewals
    return employees

# After (Optimized)
async def list_employees(skip: int, limit: int):
    employees = await db.execute(
        select(Employee)
        .options(selectinload(Employee.renewals))
        .offset(skip)
        .limit(limit)
    )
    return employees.scalars().all()
```

#### Step 3: Add Database Indexes
**Continue with Portal Engineer**

**Ask**:
```
"Create a migration to add indexes on:
- employees.email
- employees.department
- renewals.employee_id
- renewals.end_date"
```

**Expected Output**:
```python
# Alembic migration
def upgrade():
    op.create_index('idx_employees_email', 'employees', ['email'])
    op.create_index('idx_employees_department', 'employees', ['department'])
    op.create_index('idx_renewals_employee_id', 'renewals', ['employee_id'])
    op.create_index('idx_renewals_end_date', 'renewals', ['end_date'])

def downgrade():
    op.drop_index('idx_employees_email', 'employees')
    op.drop_index('idx_employees_department', 'employees')
    op.drop_index('idx_renewals_employee_id', 'renewals')
    op.drop_index('idx_renewals_end_date', 'renewals')
```

#### Step 4: Verify Performance Improvement
**Switch to Code Quality Monitor**

**Ask**:
```
"Verify the performance improvements:
1. Check if indexes are being used
2. Measure query execution time
3. Confirm no new issues introduced"
```

### Result
Employee listing page now loads 10x faster, with proper indexes and optimized queries.

---

## Example 3: Adding Email Notifications

### Scenario
HR wants automated email notifications when contract renewals are due in 30 days.

### Using the Agents

#### Step 1: Plan with HR Assistant
**Open**: `.github/agents/hr-assistant.md`

**Ask**:
```
"I need to implement automated email notifications for contract renewals.
When should emails be sent and what should they contain?"
```

**Expected Guidance**:
- Send notifications at 30, 14, and 7 days before expiry
- Email should include: employee name, current contract end date, action required
- Send to HR manager and employee
- Track notification history to avoid duplicates
- Allow configurable notification schedule

#### Step 2: Implement with Portal Engineer
**Open**: `.github/agents/portal-engineer.md`

**Ask**:
```
"Implement email notification system:
1. Email service using SMTP
2. Background job to check expiring renewals daily
3. Track sent notifications to avoid duplicates
4. API endpoint to manually trigger notifications

Use FastAPI BackgroundTasks and create appropriate models."
```

**Expected Output**:
- `backend/app/services/email_service.py` - Email sending logic
- `backend/app/services/notification_service.py` - Notification logic
- `backend/app/models/notification.py` - Notification tracking
- `backend/app/jobs/renewal_reminders.py` - Scheduled job
- API endpoint to trigger manually for testing

#### Step 3: Security Review
**Open**: `.github/agents/code-quality-monitor.md`

**Ask**:
```
"Review the email notification implementation for:
- Sensitive data exposure in emails
- Email injection vulnerabilities
- Rate limiting for email sending
- Proper error handling"
```

**Expected Findings**:
- Ensure email addresses are validated
- Check for email header injection risks
- Verify rate limiting is in place
- Confirm sensitive data is not logged

### Result
Automated email notification system that proactively reminds HR about expiring contracts, reducing manual tracking effort.

---

## Example 4: Security Audit Before Deployment

### Scenario
Before deploying to production, you need a comprehensive security audit.

### Using the Agents

#### Step 1: Run Comprehensive Scan
**Open**: `.github/agents/code-quality-monitor.md`

**Ask**:
```
"Perform a comprehensive security audit covering:
1. Authentication and authorization
2. Input validation and sanitization
3. SQL injection vulnerabilities
4. XSS vulnerabilities
5. CSRF protection
6. Sensitive data exposure
7. Dependency vulnerabilities"
```

**Expected Report**:
- List of all security issues by severity
- Specific file and line numbers
- Fix recommendations for each issue
- Risk assessment

#### Step 2: Run Proactive Scan Script
**Execute**:
```bash
python scripts/proactive_scan.py --full
```

**Review Output**:
- Critical issues (must fix before deployment)
- High priority issues (should fix soon)
- Medium/Low issues (plan for future sprints)

#### Step 3: Fix Critical Issues
**Open**: `.github/agents/portal-engineer.md`

**Ask**:
```
"Fix these critical security issues:
[Paste specific issues from scan report]

Provide the corrected code following security best practices."
```

#### Step 4: Verify Fixes
**Open**: `.github/agents/code-quality-monitor.md`

**Ask**:
```
"Verify all critical security issues are resolved.
Re-scan the files that were modified."
```

### Result
Production-ready codebase with all critical security issues resolved and documented remediation for remaining issues.

---

## Example 5: Finding and Integrating an HR Module

### Scenario
You need a probation tracking feature but don't want to build from scratch.

### Using the Agents

#### Step 1: Search with HR Assistant
**Open**: `.github/agents/hr-assistant.md`

**Ask**:
```
"Search GitHub for probation tracking modules that could integrate 
with our FastAPI/PostgreSQL stack. I need:
- Probation period management
- Review scheduling
- Decision tracking (pass/extend/fail)
- Reminder notifications"
```

**Expected Results**:
- List of relevant repositories
- Evaluation of each option
- Compatibility analysis
- Integration effort estimate

#### Step 2: Evaluate Module Quality
**Open**: `.github/agents/code-quality-monitor.md`

**Ask**:
```
"Review this module from GitHub [URL] for:
- Code quality
- Security vulnerabilities
- Dependencies health
- License compatibility
- Documentation quality"
```

#### Step 3: Plan Integration
**Open**: `.github/agents/portal-engineer.md`

**Ask**:
```
"Create an integration plan for this probation module:
1. Map their models to our database schema
2. Identify required migrations
3. Plan API endpoint integration
4. Identify frontend changes needed
5. Provide step-by-step integration guide"
```

#### Step 4: Implement Integration
**Continue with Portal Engineer**

Follow the integration plan, asking for specific code as needed.

### Result
Successfully integrated third-party module, saving weeks of development time while maintaining code quality and security standards.

---

## Tips for Effective Agent Usage

### 1. Be Specific
❌ "Help me with the database"
✅ "Design a database schema for employee probation tracking with review checkpoints"

### 2. Provide Context
Include relevant information:
- What you're trying to accomplish
- Constraints or requirements
- Current code patterns to follow
- Error messages if debugging

### 3. Iterate
Don't expect perfect results on first try:
1. Ask initial question
2. Review response
3. Ask follow-up questions for clarification
4. Request specific improvements

### 4. Use Multiple Agents
Complex tasks benefit from multiple perspectives:
- HR Assistant for requirements
- Portal Engineer for implementation
- Code Quality Monitor for verification

### 5. Save Successful Prompts
When you find prompts that work well:
- Document them
- Share with team
- Add to this examples document

---

## Common Patterns

### Pattern: Feature Implementation
1. **Plan** (HR Assistant) - Understand requirements
2. **Design** (Portal Engineer) - Create technical design
3. **Implement** (Portal Engineer) - Write code
4. **Verify** (Code Quality Monitor) - Check quality/security
5. **Iterate** - Fix issues and repeat steps 3-4

### Pattern: Bug Fix
1. **Diagnose** (Code Quality Monitor) - Identify root cause
2. **Fix** (Portal Engineer) - Implement solution
3. **Verify** (Code Quality Monitor) - Confirm fix works
4. **Test** - Ensure no regressions

### Pattern: Performance Optimization
1. **Identify** (Code Quality Monitor) - Find bottlenecks
2. **Optimize** (Portal Engineer) - Improve performance
3. **Measure** (Code Quality Monitor) - Verify improvements
4. **Document** - Record what was done and why

---

## Measuring Success

Track these metrics to measure agent effectiveness:

- **Time Saved**: Hours saved on research and implementation
- **Code Quality**: Reduction in bugs and issues
- **Security**: Fewer vulnerabilities in production
- **Velocity**: Faster feature delivery
- **Learning**: Team knowledge improvement

---

## Next Steps

1. Try these examples with your own scenarios
2. Document your own successful workflows
3. Share learnings with the team
4. Continuously improve agent prompts and documentation
5. Add new examples as you discover effective patterns

---

**Remember**: Agents are tools to augment your skills, not replace your judgment. Always review and understand the code they suggest before implementing it.
