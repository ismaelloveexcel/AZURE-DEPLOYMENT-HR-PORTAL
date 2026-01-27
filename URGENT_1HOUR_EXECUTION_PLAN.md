# URGENT: 1-Hour Execution Plan
## Critical Features Finalization

**Created:** January 27, 2026  
**Deadline:** 1 hour from start  
**Goal:** Complete 4 critical HR features with immediate deployment readiness

---

## ⚡ Executive Summary

**Status Assessment:**
- ✅ **Recruitment:** 90% complete - needs final enhancements
- ✅ **Employee Database:** 85% complete - needs export/import refinement
- 🔴 **Leaver Planner:** 0% complete - NEW MODULE REQUIRED
- ⚠️ **Performance Appraisal:** 80% complete - needs completion workflow

**Approach:** Parallel execution by specialized agents across 6 time blocks (10 minutes each)

---

## 📋 Task Breakdown (60 Minutes)

### BLOCK 1-2: Minutes 0-20 (PARALLEL EXECUTION)

#### Task 1A: Recruitment Process Completion (10 min)
**Agent:** `portal-engineer` (full-stack implementation)  
**Status:** Backend exists, needs final touches  
**Deliverables:**
- ✅ Add bulk candidate operations (move stage, reject)
- ✅ Add recruitment metrics dashboard
- ✅ Add offer letter generation
- ✅ Add pipeline visualization support

**Files to modify:**
- `backend/app/routers/recruitment.py` - Add missing endpoints
- `backend/app/services/recruitment_service.py` - Add business logic
- `backend/app/schemas/recruitment.py` - Add schemas

**Acceptance:**
- Bulk operations work via API
- Metrics endpoint returns correct data
- All recruitment stages functional

---

#### Task 1B: Employee Database Enhancement (10 min)
**Agent:** `portal-engineer`  
**Status:** Core exists, needs bulk operations  
**Deliverables:**
- ✅ Enhanced CSV export with all fields
- ✅ Bulk update capability
- ✅ Employee search/filter endpoint
- ✅ Employee status management (active/inactive)

**Files to modify:**
- `backend/app/routers/employees.py` - Add bulk operations
- `backend/app/services/employees.py` - Enhanced export
- `backend/app/schemas/employee.py` - Add bulk schemas

**Acceptance:**
- Export includes all employee fields
- Bulk update works correctly
- Search endpoint functional

---

### BLOCK 3-4: Minutes 20-40 (PARALLEL EXECUTION)

#### Task 2A: Leaver Planner Module (NEW - 20 min)
**Agent:** `portal-engineer`  
**Status:** NEW MODULE - critical priority  
**Deliverables:**
- ✅ Leaver model (resignation date, notice period, last day, reason, exit interview status)
- ✅ Leaver router with CRUD operations
- ✅ Leaver service with business logic
- ✅ Integration with employee status
- ✅ Exit checklist tracking
- ✅ Clearance workflow

**Files to create:**
- `backend/app/models/leaver.py` - NEW
- `backend/app/routers/leavers.py` - NEW
- `backend/app/services/leaver_service.py` - NEW
- `backend/app/schemas/leaver.py` - NEW

**Files to modify:**
- `backend/app/main.py` - Register leaver router
- `backend/app/models/__init__.py` - Import leaver model

**Database migration:**
```sql
CREATE TABLE leavers (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) REFERENCES employees(employee_id),
    resignation_date DATE NOT NULL,
    notice_period_days INT DEFAULT 30,
    last_working_day DATE NOT NULL,
    reason VARCHAR(100),
    exit_interview_completed BOOLEAN DEFAULT FALSE,
    exit_interview_date DATE,
    clearance_status VARCHAR(20) DEFAULT 'pending',
    clearance_items JSONB,
    created_by VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Acceptance:**
- Can add leaver record for employee
- Notice period auto-calculated
- Exit checklist tracked
- Employee status updates to "leaving"

---

#### Task 2B: Performance Appraisal Completion (20 min)
**Agent:** `portal-engineer`  
**Status:** 80% done, needs completion  
**Deliverables:**
- ✅ Complete review submission workflow
- ✅ Add final rating calculation
- ✅ Add performance reports
- ✅ Add review reminders

**Files to modify:**
- `backend/app/routers/performance.py` - Complete endpoints
- `backend/app/services/performance_service.py` - Add calculations
- `backend/app/models/performance.py` - Verify all fields

**Acceptance:**
- Full cycle workflow functional
- Ratings calculate correctly
- Reports generate properly

---

### BLOCK 5: Minutes 40-50 (INTEGRATION & TESTING)

#### Task 3: Integration Testing (10 min)
**Agent:** `portal-engineer`  
**Deliverables:**
- ✅ Test all new endpoints via Swagger
- ✅ Verify data flows correctly
- ✅ Check database migrations
- ✅ Validate security (role checks)

**Testing checklist:**
- [ ] Recruitment bulk operations work
- [ ] Employee export includes all fields
- [ ] Leaver workflow functional end-to-end
- [ ] Performance cycle completes correctly

---

### BLOCK 6: Minutes 50-60 (DOCUMENTATION & DEPLOYMENT)

#### Task 4: Documentation & Deployment Prep (10 min)
**Agent:** `portal-engineer`  
**Deliverables:**
- ✅ Update API documentation
- ✅ Create migration script
- ✅ Update README with new features
- ✅ Commit and push changes

**Files to update:**
- `README.md` - Add new feature descriptions
- `backend/alembic/versions/` - New migration
- API docs auto-generated by FastAPI

---

## 🎯 Agent Assignment Matrix

| Time Block | Agent | Task | Priority |
|------------|-------|------|----------|
| 0-10 min | `portal-engineer` | Recruitment completion | HIGH |
| 0-10 min | `portal-engineer` | Employee DB enhancement | HIGH |
| 20-30 min | `portal-engineer` | Leaver module (NEW) | CRITICAL |
| 30-40 min | `portal-engineer` | Performance completion | HIGH |
| 40-50 min | `portal-engineer` | Integration testing | CRITICAL |
| 50-60 min | `portal-engineer` | Documentation & prep | MEDIUM |

**Note:** Using single agent (`portal-engineer`) for consistency and speed. Agent has full-stack capabilities.

---

## 📊 Feature Completion Checklist

### 1. Full Recruitment Process ✅ (90% → 100%)

**Current Status:**
- ✅ Job requisition management
- ✅ Candidate tracking
- ✅ Interview scheduling
- ✅ Resume parsing
- ✅ CV scoring
- ⚠️ Bulk operations (ADD)
- ⚠️ Offer generation (ADD)
- ⚠️ Metrics dashboard (ADD)

**To Complete:**
- [ ] Bulk stage updates
- [ ] Bulk rejection
- [ ] Offer letter template
- [ ] Recruitment metrics API

---

### 2. Full Employee Database ✅ (85% → 100%)

**Current Status:**
- ✅ Employee CRUD
- ✅ Profile management
- ✅ Compliance tracking
- ✅ Document management
- ✅ Bank details
- ⚠️ Enhanced export (IMPROVE)
- ⚠️ Bulk operations (ADD)
- ⚠️ Advanced search (ADD)

**To Complete:**
- [ ] Export with all fields (visa, contract, salary)
- [ ] Bulk update endpoint
- [ ] Advanced filter/search
- [ ] Employee status management

---

### 3. Leaver Planner 🔴 (0% → 100%) **NEW MODULE**

**Required Features:**
- [ ] Resignation recording
- [ ] Notice period calculation
- [ ] Last working day tracking
- [ ] Exit interview scheduling
- [ ] Clearance checklist
- [ ] Document handover tracking
- [ ] Equipment return tracking
- [ ] Final settlement calculation
- [ ] Leaver reports

**Data Model:**
```python
class Leaver:
    employee_id: FK -> Employee
    resignation_date: Date
    notice_period_days: Int (default 30)
    last_working_day: Date (auto-calc)
    reason: Enum(personal, better_offer, relocation, health, retirement, termination)
    exit_interview_completed: Bool
    exit_interview_date: Date
    exit_interview_notes: Text
    clearance_status: Enum(pending, in_progress, completed)
    clearance_items: JSON {
        "documents": {"status": "pending", "completed_by": null},
        "equipment": {"status": "pending", "completed_by": null},
        "access_cards": {"status": "pending", "completed_by": null},
        "keys": {"status": "pending", "completed_by": null}
    }
    final_settlement_status: Enum(pending, calculated, paid)
    rehire_eligible: Bool
    created_by: String
    created_at: Timestamp
```

---

### 4. Performance Appraisal ⚠️ (80% → 100%)

**Current Status:**
- ✅ Performance cycle management
- ✅ Self-assessment
- ✅ Manager review
- ✅ Bulk review creation
- ⚠️ Final rating logic (COMPLETE)
- ⚠️ Report generation (ADD)
- ⚠️ Reminder system (ADD)

**To Complete:**
- [ ] Overall rating calculation formula
- [ ] Performance report endpoint
- [ ] Reminder notifications
- [ ] Review history export

---

## 🚀 Execution Commands

### Start Execution

```bash
# Block 1-2: Recruitment + Employee DB (Parallel)
# Use portal-engineer agent for both

# Task 1A: Recruitment
copilot agent portal-engineer "Complete recruitment module: 
1. Add bulk operations (move stage, reject candidates)
2. Add recruitment metrics endpoint
3. Add offer letter generation support
4. Test all endpoints via Swagger
Files: backend/app/routers/recruitment.py, services/recruitment_service.py"

# Task 1B: Employee Database (can run parallel)
copilot agent portal-engineer "Enhance employee database:
1. Add enhanced CSV export with all fields
2. Add bulk update endpoint
3. Add advanced search/filter
4. Test with sample data
Files: backend/app/routers/employees.py, services/employees.py"

# Block 3-4: Leaver Module (NEW) + Performance
# Critical: Leaver module is completely new

# Task 2A: Leaver Module (20 min - NEW)
copilot agent portal-engineer "CREATE NEW leaver module from scratch:
1. Create model: backend/app/models/leaver.py
2. Create router: backend/app/routers/leavers.py
3. Create service: backend/app/services/leaver_service.py
4. Create schemas: backend/app/schemas/leaver.py
5. Register in main.py
6. Create migration
7. Test full workflow
Include: resignation tracking, notice period calc, exit checklist, clearance workflow"

# Task 2B: Performance (can run parallel)
copilot agent portal-engineer "Complete performance appraisal:
1. Add rating calculation logic
2. Add performance reports
3. Add reminder system
4. Test review cycles
Files: backend/app/routers/performance.py, services/performance_service.py"

# Block 5: Integration Testing
copilot agent portal-engineer "Integration testing:
1. Test all new endpoints
2. Verify workflows
3. Check security
4. Document any issues"

# Block 6: Documentation
copilot agent portal-engineer "Final documentation:
1. Update README
2. Create migration
3. Commit changes
4. Prepare deployment"
```

---

## ⚠️ Risk Mitigation

### High-Risk Items

1. **Leaver Module Creation** (NEW)
   - Risk: Most complex, completely new
   - Mitigation: Use existing patterns from other modules
   - Fallback: Minimal MVP (just resignation tracking + last day)

2. **Database Migrations**
   - Risk: Migration could fail
   - Mitigation: Test migration in dev first
   - Fallback: Manual migration script

3. **Time Constraint**
   - Risk: 60 minutes is tight for 4 features
   - Mitigation: Prioritize critical path items
   - Fallback: Complete leaver + recruitment first, others can follow

### Priority Order (if time runs out)

1. **MUST HAVE:** Leaver module (new, critical business need)
2. **MUST HAVE:** Recruitment completion (close to done)
3. **SHOULD HAVE:** Performance completion (mostly done)
4. **NICE TO HAVE:** Employee DB enhancements (working already)

---

## ✅ Success Criteria

### Minimum Viable Completion (MVP)

**By 60 minutes:**
- [ ] Leaver module functional (add, view, update, exit checklist)
- [ ] Recruitment bulk operations working
- [ ] Performance cycle completes end-to-end
- [ ] Employee export includes all fields
- [ ] All endpoints secured with role checks
- [ ] Database migrations created
- [ ] Code committed to branch

### Stretch Goals (if time permits)

- [ ] Frontend components for leaver workflow
- [ ] Email notifications for leavers
- [ ] Dashboard widgets for pending leavers
- [ ] Performance report PDFs
- [ ] Recruitment pipeline visualization

---

## 📈 Progress Tracking

### 10-Minute Checkpoints

| Time | Checkpoint | Status | Notes |
|------|------------|--------|-------|
| T+10 | Recruitment endpoints done | ⏳ | |
| T+10 | Employee export enhanced | ⏳ | |
| T+30 | Leaver model created | ⏳ | |
| T+30 | Leaver router functional | ⏳ | |
| T+40 | Performance completed | ⏳ | |
| T+50 | All tests passing | ⏳ | |
| T+60 | Code committed | ⏳ | |

---

## 🔧 Technical Implementation Notes

### Leaver Module - Quick Implementation Pattern

**Step 1: Model** (5 min)
```python
# backend/app/models/leaver.py
from sqlalchemy import Column, Integer, String, Date, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta

class Leaver(Base):
    __tablename__ = "leavers"
    
    id = Column(Integer, primary_key=True)
    employee_id = Column(String(20), ForeignKey("employees.employee_id"))
    resignation_date = Column(Date, nullable=False)
    notice_period_days = Column(Integer, default=30)
    last_working_day = Column(Date, nullable=False)
    reason = Column(String(100))
    exit_interview_completed = Column(Boolean, default=False)
    clearance_status = Column(String(20), default="pending")
    clearance_items = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="leaver_record")
```

**Step 2: Router** (5 min)
```python
# backend/app/routers/leavers.py
from fastapi import APIRouter, Depends
from app.core.security import require_role

router = APIRouter(prefix="/leavers", tags=["leavers"])

@router.post("/", response_model=LeaverResponse)
async def create_leaver(data: LeaverCreate, ...):
    return await leaver_service.create_leaver(session, data)

@router.get("/", response_model=List[LeaverResponse])
async def list_leavers(...):
    return await leaver_service.list_leavers(session)
```

**Step 3: Service** (5 min)
```python
# backend/app/services/leaver_service.py
from datetime import timedelta

class LeaverService:
    async def create_leaver(self, db, data):
        # Auto-calculate last working day
        last_day = data.resignation_date + timedelta(days=data.notice_period_days)
        leaver = Leaver(**data.dict(), last_working_day=last_day)
        db.add(leaver)
        await db.commit()
        return leaver
```

**Step 4: Migration** (5 min)
```bash
cd backend
uv run alembic revision --autogenerate -m "add_leaver_module"
uv run alembic upgrade head
```

---

## 📝 Post-Execution Checklist

After 60 minutes:
- [ ] All code committed to branch
- [ ] PR created with summary
- [ ] Migrations ready to run
- [ ] API docs updated
- [ ] Security review passed (role checks)
- [ ] Basic smoke tests passed
- [ ] Deployment instructions ready

---

## 🎯 Immediate Next Steps (START NOW)

1. **Minute 0:** Kick off portal-engineer for recruitment + employee DB
2. **Minute 20:** Start leaver module creation (highest priority)
3. **Minute 40:** Begin integration testing
4. **Minute 50:** Documentation and commit
5. **Minute 60:** DONE - Review and deploy

---

**Status:** Ready to execute  
**Priority:** URGENT  
**Timeline:** 60 minutes from now  
**Agent:** portal-engineer (primary executor)
