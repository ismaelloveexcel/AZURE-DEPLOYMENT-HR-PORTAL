# HR Portal Enhancement - New Separate App Blueprint

**Version**: 1.0  
**Date**: January 31, 2026  
**Purpose**: Complete implementation blueprint for new enhanced HR portal  
**Target Audience**: Copilot agent creating the new repository  

---

## 🎯 EXECUTIVE SUMMARY

This blueprint provides complete specifications for building an enhanced HR portal as a **separate application** that incorporates advanced compliance, operational, and governance features not included in the Phase 1 base implementation.

### Key Differentiators
1. **UAE Labour Law Compliance** (Document retention, probation tracking, termination rules)
2. **Operational Excellence** (SLA tracking, manager visibility, attachment handling)
3. **Employee Experience** (Contextual help, dynamic ETAs, knowledge base)
4. **Governance & Audit** (Delegation matrix, one-click exports, legal hold)

### Success Metrics
- **Zero** missed compliance deadlines
- **50%+** reduction in status inquiries
- **<15 minutes** to generate audit reports
- **100%** audit trail completeness

---

## 📋 PROJECT OVERVIEW

### What This App Does

This separate application extends the Phase 1 base HR portal with advanced features required for:
- **Legal compliance** in UAE private sector
- **Operational efficiency** for solo HR teams  
- **Risk management** for sensitive requests
- **Governance** and audit readiness

### What Makes It Different

Unlike the base portal (Phase 1), this app includes:
- Document retention & legal hold (7-10 year retention per UAE law)
- Grievance classification with restricted visibility
- Probation milestone tracking (Article 44/45 compliance)
- SLA tracking with auto-escalation
- Manager visibility layer (reduce HR email load)
- Attachment handling with virus scanning
- Medical insurance lifecycle tracking
- Knowledge base integration
- Delegation of authority matrix
- One-click audit exports

### Architecture Philosophy

**Foundation**: Build on Phase 1 patterns
- Same 3-layer architecture (Router → Service → Repository)
- Same tech stack (FastAPI + React + PostgreSQL)
- Same authentication (JWT tokens)
- **But with enhanced data models and business logic**

---

## 1. TECHNOLOGY STACK

### Backend
- **Framework**: FastAPI 0.109+
- **Database**: PostgreSQL 15+ with asyncpg
- **ORM**: SQLAlchemy 2.0 (async)
- **Migrations**: Alembic
- **Validation**: Pydantic V2
- **Authentication**: JWT (shared with base portal)
- **Task Queue**: Celery + Redis (for async operations)
- **File Storage**: Azure Blob Storage (attachments)

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript 5+
- **Build Tool**: Vite
- **Styling**: TailwindCSS 3+
- **State Management**: React Query (TanStack Query)
- **Router**: React Router v7
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts (for dashboards)

### Infrastructure
- **Cloud**: Azure App Service
- **Database**: Azure Database for PostgreSQL
- **Storage**: Azure Blob Storage
- **Notifications**: Twilio WhatsApp API
- **Monitoring**: Azure Application Insights
- **CI/CD**: GitHub Actions

### Development Tools
- **Python Package Manager**: uv
- **Node Package Manager**: npm
- **Code Quality**: Ruff (Python), ESLint + Prettier (TypeScript)
- **Testing**: pytest (backend), Vitest + Testing Library (frontend)

---

## 2. DATABASE SCHEMA

### Philosophy
- **Extend Phase 1 tables** (don't recreate from scratch)
- **Add new specialized tables** for advanced features
- **Maintain backward compatibility** with base portal

### 2.1 Enhanced Requests Table

```sql
-- Start with Phase 1 base table, then add enhancements

-- Phase 1 base fields (already exist)
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(20) UNIQUE NOT NULL,
    employee_id VARCHAR(20) REFERENCES employees(employee_id),
    request_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'submitted',
    submitted_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    estimated_completion_days INTEGER DEFAULT 3,
    hr_notes TEXT,
    public_notes TEXT,
    metadata JSONB,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ADD enhancements via ALTER TABLE
ALTER TABLE requests ADD COLUMN retention_period_years INTEGER DEFAULT 7;
ALTER TABLE requests ADD COLUMN legal_hold BOOLEAN DEFAULT false;
ALTER TABLE requests ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE requests ADD COLUMN deleted_by VARCHAR(20) NULL;
ALTER TABLE requests ADD COLUMN risk_classification VARCHAR(20) DEFAULT 'low';
ALTER TABLE requests ADD COLUMN is_sensitive BOOLEAN DEFAULT false;
ALTER TABLE requests ADD COLUMN restricted_to_roles TEXT[];
ALTER TABLE requests ADD COLUMN is_overdue BOOLEAN DEFAULT false;
ALTER TABLE requests ADD COLUMN overdue_severity VARCHAR(20) DEFAULT 'on_time';
ALTER TABLE requests ADD COLUMN requires_manager_ack BOOLEAN DEFAULT false;
ALTER TABLE requests ADD COLUMN manager_acknowledged BOOLEAN DEFAULT false;
ALTER TABLE requests ADD COLUMN manager_id VARCHAR(20) REFERENCES employees(employee_id);

-- Indexes
CREATE INDEX idx_requests_deleted_at ON requests(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_requests_legal_hold ON requests(legal_hold) WHERE legal_hold = true;
CREATE INDEX idx_requests_risk ON requests(risk_classification, is_sensitive);
CREATE INDEX idx_requests_overdue ON requests(is_overdue) WHERE is_overdue = true;
```

### 2.2 New Specialist Tables

```sql
-- Sensitive request configuration
CREATE TABLE sensitive_request_types (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(50) UNIQUE NOT NULL,
    auto_risk_level VARCHAR(20) DEFAULT 'high',
    restricted_to_roles TEXT[] DEFAULT ARRAY['admin', 'hr_manager'],
    requires_acknowledgement BOOLEAN DEFAULT true,
    retention_period_years INTEGER DEFAULT 10
);

-- SLA configuration per request type
CREATE TABLE request_sla_config (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(50) UNIQUE NOT NULL,
    target_days INTEGER NOT NULL DEFAULT 3,
    escalation_days INTEGER NOT NULL DEFAULT 5,
    critical_days INTEGER NOT NULL DEFAULT 7,
    business_days_only BOOLEAN DEFAULT true
);

-- Probation milestone tracking
CREATE TABLE probation_milestones (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) REFERENCES employees(employee_id),
    milestone_type VARCHAR(20) NOT NULL,
    due_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    completed_by VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Request attachments (Azure Blob Storage)
CREATE TABLE request_attachments (
    id SERIAL PRIMARY KEY,
    request_reference VARCHAR(20) REFERENCES requests(reference),
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    storage_path TEXT NOT NULL,
    uploaded_by VARCHAR(20) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    virus_scan_status VARCHAR(20) DEFAULT 'pending',
    retention_until DATE,
    is_deleted BOOLEAN DEFAULT false
);

-- Compliance calendar enhancements
CREATE TABLE compliance_calendar_events (
    id SERIAL PRIMARY KEY,
    event_date DATE NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    employee_id VARCHAR(20) REFERENCES employees(employee_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    actioned_at TIMESTAMP,
    actioned_by VARCHAR(20),
    recurring BOOLEAN DEFAULT false,
    recurrence_rule VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Manager acknowledgements
CREATE TABLE manager_acknowledgements (
    id SERIAL PRIMARY KEY,
    request_reference VARCHAR(20) REFERENCES requests(reference),
    manager_id VARCHAR(20) REFERENCES employees(employee_id),
    acknowledged_at TIMESTAMP DEFAULT NOW(),
    comment TEXT
);

-- Approval rules (delegation matrix)
CREATE TABLE approval_rules (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(50) NOT NULL,
    approval_level INTEGER NOT NULL,
    approver_role VARCHAR(50) NOT NULL,
    approver_department VARCHAR(100),
    approval_required BOOLEAN DEFAULT true,
    can_delegate BOOLEAN DEFAULT false,
    timeout_days INTEGER DEFAULT 3
);

-- Knowledge base
CREATE TABLE knowledge_base_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    article_type VARCHAR(50),
    related_request_types TEXT[],
    tags TEXT[],
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Data privacy acknowledgements
CREATE TABLE data_privacy_acknowledgements (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) REFERENCES employees(employee_id),
    acknowledgement_type VARCHAR(50) NOT NULL,
    acknowledgement_text TEXT NOT NULL,
    acknowledged_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    version VARCHAR(10)
);
```

---

## 3. CORE FEATURES IMPLEMENTATION

### 3.1 Legal Hold System

**Purpose**: Prevent deletion of legally important requests per UAE audit requirements.

**Service**: `LegalHoldService`

```python
# backend/app/services/legal_hold.py
class LegalHoldService:
    async def enable_legal_hold(
        self, 
        db: AsyncSession, 
        reference: str, 
        reason: str,
        enabled_by: str
    ) -> Request:
        """Enable legal hold - prevents deletion"""
        request = await request_repo.get_by_reference(db, reference)
        if not request:
            raise HTTPException(404, "Request not found")
        
        request.legal_hold = True
        request.legal_hold_reason = reason
        request.legal_hold_enabled_by = enabled_by
        request.legal_hold_enabled_at = datetime.utcnow()
        
        await db.commit()
        await audit_service.log_action(
            "enable_legal_hold", 
            reference, 
            enabled_by
        )
        return request
    
    async def soft_delete_request(
        self,
        db: AsyncSession,
        reference: str,
        deleted_by: str
    ):
        """Soft delete (blocks if legal_hold = true)"""
        request = await request_repo.get_by_reference(db, reference)
        
        if request.legal_hold:
            raise HTTPException(
                403, 
                "Cannot delete - request under legal hold"
            )
        
        request.deleted_at = datetime.utcnow()
        request.deleted_by = deleted_by
        await db.commit()
```

**API Endpoints**:
```python
# backend/app/routers/legal_hold.py
@router.post("/{reference}")
async def enable_legal_hold(
    reference: str,
    data: LegalHoldRequest,
    db: AsyncSession = Depends(get_session),
    role: str = Depends(require_role(["admin"]))
):
    return await legal_hold_service.enable_legal_hold(
        db, reference, data.reason, data.enabled_by
    )
```

**Frontend Component**:
```typescript
// frontend/src/components/LegalHoldToggle.tsx
export function LegalHoldToggle({ request }: Props) {
  const [showModal, setShowModal] = useState(false);
  
  const enableLegalHold = async (reason: string) => {
    await api.post(`/legal-hold/${request.reference}`, { reason });
    toast.success("Legal hold enabled");
  };
  
  if (request.legal_hold) {
    return <Badge variant="warning">🔒 Legal Hold</Badge>;
  }
  
  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Enable Legal Hold
      </Button>
      {showModal && (
        <LegalHoldModal onConfirm={enableLegalHold} />
      )}
    </>
  );
}
```

---

### 3.2 Grievance Classification

**Purpose**: Auto-classify sensitive requests and restrict visibility.

**Service**: `GrievanceClassificationService`

```python
# backend/app/services/grievance_classification.py
class GrievanceClassificationService:
    SENSITIVE_TYPES = {
        "harassment_complaint": "high",
        "wage_complaint": "high",
        "disciplinary_dispute": "high",
        "termination_dispute": "high",
        "discrimination_complaint": "high"
    }
    
    async def classify_request(
        self,
        db: AsyncSession,
        request: Request
    ) -> dict:
        """Auto-classify request on creation"""
        
        # Check if type is sensitive
        if request.request_type in self.SENSITIVE_TYPES:
            request.risk_classification = self.SENSITIVE_TYPES[request.request_type]
            request.is_sensitive = True
            request.restricted_to_roles = ["admin", "hr_manager"]
            request.retention_period_years = 10  # Higher retention
            
            await db.commit()
            
            return {
                "classified": True,
                "risk_level": request.risk_classification,
                "restricted": True
            }
        
        return {"classified": False}
    
    async def check_access(
        self,
        request: Request,
        user_role: str
    ) -> bool:
        """Check if user can access sensitive request"""
        if not request.is_sensitive:
            return True
        
        return user_role in request.restricted_to_roles
```

**Router Integration**:
```python
# In request creation endpoint
async def create_request(...):
    request = await request_service.create_request(...)
    
    # Auto-classify
    await grievance_service.classify_request(db, request)
    
    return request
```

---

### 3.3 SLA Tracking System

**Purpose**: Monitor request processing time and escalate overdue requests.

**Service**: `SLAService`

```python
# backend/app/services/sla.py
class SLAService:
    async def calculate_sla_status(
        self,
        request: Request,
        sla_config: SLAConfig
    ) -> dict:
        """Calculate days_open and overdue status"""
        
        now = datetime.utcnow()
        submitted = request.submitted_at
        
        # Calculate business days only
        days_open = calculate_business_days(submitted, now)
        
        severity = "on_time"
        if days_open >= sla_config.critical_days:
            severity = "critical"
        elif days_open >= sla_config.escalation_days:
            severity = "overdue"
        elif days_open >= sla_config.target_days:
            severity = "approaching"
        
        is_overdue = days_open > sla_config.target_days
        
        return {
            "days_open": days_open,
            "severity": severity,
            "is_overdue": is_overdue,
            "target_days": sla_config.target_days
        }
    
    async def get_dashboard_metrics(
        self,
        db: AsyncSession
    ) -> dict:
        """Get SLA summary for HR dashboard"""
        
        all_pending = await request_repo.list_pending(db)
        
        summary = {
            "on_time": 0,
            "approaching": 0,
            "overdue": 0,
            "critical": 0
        }
        
        for request in all_pending:
            sla = await self.calculate_sla_status(request, ...)
            summary[sla["severity"]] += 1
        
        return summary
```

**Frontend Dashboard**:
```typescript
// frontend/src/components/SLADashboard.tsx
export function SLADashboard() {
  const { data } = useQuery(['sla-metrics'], () => 
    api.get('/api/sla/dashboard')
  );
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricCard 
        label="Critical (>7 days)" 
        value={data.critical} 
        variant="danger" 
      />
      <MetricCard 
        label="Overdue (5-7 days)" 
        value={data.overdue} 
        variant="warning" 
      />
      <MetricCard 
        label="Approaching (3-5 days)" 
        value={data.approaching} 
        variant="info" 
      />
      <MetricCard 
        label="On Time (<3 days)" 
        value={data.on_time} 
        variant="success" 
      />
    </div>
  );
}
```

---

## 4. IMPLEMENTATION PHASES

### Phase 2.5: Enhanced Compliance (Weeks 1-2)

**Goals**: Legal hold, grievance classification, probation tracking, data privacy

**Tasks**:
1. Database migrations for new fields/tables
2. Legal hold service + API + UI
3. Grievance classification service (auto-classify on creation)
4. Probation milestone tracker
5. Data privacy acknowledgement banner
6. Unit tests (80%+ coverage)

**Deliverables**:
- Legal hold toggle in request detail page
- Sensitive request badge (red + lock icon)
- Probation milestone calendar view
- Data privacy banner on first login

**Exit Criteria**:
- Admin can enable legal hold
- High-risk requests auto-classified
- Probation milestones generated for all employees

---

### Phase 3.5: Operational Excellence (Weeks 3-4)

**Goals**: SLA tracking, manager visibility, attachment handling

**Tasks**:
1. SLA config table + service
2. SLA dashboard component
3. Manager visibility service + UI
4. Attachment upload + Azure Blob Storage integration
5. Virus scanning placeholder
6. Integration tests

**Deliverables**:
- SLA dashboard with red/amber/green indicators
- Manager team requests view (read-only)
- Attachment upload with validation
- Azure Blob Storage connection

**Exit Criteria**:
- SLA dashboard shows accurate metrics
- Managers can view team requests
- Attachments uploaded to Azure successfully

---

### Phase 4.5: Advanced Calendar (Week 5)

**Goals**: Medical insurance, Emirates ID/Labour Card sync, public holidays

**Tasks**:
1. Compliance calendar enhancements
2. Insurance lifecycle tracker
3. Document dependency mapper
4. Public holiday management

**Deliverables**:
- Insurance expiry calendar events
- EID/visa dependency warnings
- Public holiday calendar

**Exit Criteria**:
- Calendar shows insurance expiry alerts
- EID/visa dependencies mapped

---

### Phase 5.5: Experience & Governance (Weeks 6-7)

**Goals**: "What's next" visibility, KB integration, delegation matrix, exports

**Tasks**:
1. Dynamic ETA calculator
2. KB article management + search
3. Approval rules engine
4. Export service (CSV/Excel/PDF)
5. End-to-end tests

**Deliverables**:
- "What happens next" section on tracking page
- KB article suggestions on request submission
- Approval workflow (multi-level)
- One-click export button

**Exit Criteria**:
- Employees see "what happens next"
- KB articles displayed contextually
- Exports generate correctly

---

## 5. API SPECIFICATIONS

### Base URL
```
https://hr-portal-enhanced.azurewebsites.net/api
```

### Authentication
```
Authorization: Bearer {jwt_token}
```

### Key Endpoints

#### Legal Hold
```http
POST   /api/legal-hold/{reference}
DELETE /api/legal-hold/{reference}
GET    /api/legal-hold
```

#### SLA
```http
GET /api/sla/dashboard
GET /api/sla/overdue
GET /api/sla/config
POST /api/sla/config
```

#### Manager Visibility
```http
GET  /api/manager/team-requests
POST /api/manager/acknowledge/{reference}
```

#### Attachments
```http
POST /api/requests/{reference}/attachments
GET  /api/requests/{reference}/attachments
DELETE /api/requests/{reference}/attachments/{id}
```

#### Knowledge Base
```http
GET /api/kb/articles
GET /api/kb/search?q={query}
GET /api/kb/suggestions/{request_type}
```

---

## 6. DEPLOYMENT GUIDE

### Azure Setup

```bash
# Create resource group
az group create --name rg-hr-portal-enhanced --location uaenorth

# Create PostgreSQL database
az postgres flexible-server create   --name hr-portal-db-enhanced   --resource-group rg-hr-portal-enhanced   --admin-user hradmin   --admin-password [SECURE_PASSWORD]   --sku-name Standard_B2s   --version 15

# Create App Service
az appservice plan create   --name hr-portal-plan-enhanced   --resource-group rg-hr-portal-enhanced   --sku B2   --is-linux

az webapp create   --name hr-portal-enhanced   --resource-group rg-hr-portal-enhanced   --plan hr-portal-plan-enhanced   --runtime "PYTHON:3.11"

# Create Blob Storage
az storage account create   --name hrportalenhanced   --resource-group rg-hr-portal-enhanced   --sku Standard_LRS

az storage container create   --name attachments   --account-name hrportalenhanced
```

### Environment Variables

```bash
DATABASE_URL=postgresql+asyncpg://hradmin:PASSWORD@hr-portal-db-enhanced.postgres.database.azure.com/hrportal
AUTH_SECRET_KEY=[GENERATE_SECRET]
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxx
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
ALLOWED_ORIGINS=https://hr-portal-enhanced.azurewebsites.net
LEGAL_HOLD_ENABLED=true
SLA_TRACKING_ENABLED=true
```

---

## 7. SUCCESS METRICS

### Compliance (Target: Zero breaches)
- Zero missed compliance deadlines
- 100% legal hold integrity
- Zero illegal terminations
- 100% data privacy acknowledgement

### Operational (Target: 50%+ improvement)
- <1 day average request age
- 50%+ reduction in status inquiries
- 80% manager visibility adoption
- Zero lost attachments

### Experience (Target: 90%+ satisfaction)
- <5 seconds to understand status
- 75% KB self-service rate
- 90% first-time approval rate

### Financial (Target: $40K+ annual benefit)
- 840 hours/year saved
- $42,000/year value
- $360/year costs
- Net: $41,640/year (11,566% ROI)

---

## 8. NEXT STEPS FOR COPILOT AGENT

When you create the new repository, use this blueprint to:

1. **Set up project structure**:
   ```
   hr-portal-enhanced/
   ├── backend/
   │   ├── app/
   │   │   ├── models/
   │   │   ├── schemas/
   │   │   ├── services/
   │   │   ├── routers/
   │   │   └── main.py
   │   ├── alembic/
   │   └── pyproject.toml
   ├── frontend/
   │   ├── src/
   │   │   ├── components/
   │   │   ├── pages/
   │   │   └── App.tsx
   │   └── package.json
   └── docs/
   ```

2. **Create initial migrations** (use SQL from Section 2)

3. **Implement Phase 2.5** (legal hold + grievance classification first)

4. **Set up CI/CD** (GitHub Actions for auto-deploy)

5. **Configure Azure resources** (use commands from Section 6)

6. **Run tests** (unit + integration + E2E)

7. **Deploy to staging** (validate before production)

---

**END OF BLUEPRINT**

This blueprint provides everything needed to build the enhanced HR portal as a separate application. Share it with the Copilot agent when creating the new repository.
