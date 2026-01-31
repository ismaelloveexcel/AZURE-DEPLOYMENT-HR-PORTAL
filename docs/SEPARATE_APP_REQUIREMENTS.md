# Separate App Requirements - Enhanced HR Portal Features

**Status**: Requirements captured for future separate application  
**Date**: January 31, 2026  
**Source**: Supervisor feedback on Phase 1 implementation  

---

## ⚠️ IMPORTANT NOTE

**These features are NOT to be implemented in the current repository.**

Per supervisor instruction: "DO NOT REVISE ANYTHING IN THIS REPO. WE WILL CREATE A SEPARATE APP FOR THIS"

This document captures requirements for a future separate application.

---

## 1. UAE COMPLIANCE – MISSING/UNDER-SPECIFIED FEATURES ⚖️

### 1.1 Document Retention & Legal Hold

**Business Need**: UAE labour law and audit practice require employee records to be retrievable years later, especially in disputes.

**Current Gap**:
- No explicit retention policy logic
- No "do not delete / legal hold" mechanism
- No protection during MOHRE complaints, court cases, or audits

**Requirements**:

#### Data Model Extensions
```sql
ALTER TABLE requests ADD COLUMN retention_period_years INTEGER DEFAULT 7;
ALTER TABLE requests ADD COLUMN legal_hold BOOLEAN DEFAULT false;
ALTER TABLE requests ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE requests ADD COLUMN deleted_by VARCHAR(20) NULL;

-- Soft delete only - never hard delete
CREATE INDEX idx_requests_deleted_at ON requests(deleted_at) WHERE deleted_at IS NULL;
```

#### Features
- **Retention Tags**: Configurable retention period per request type (default 7 years per UAE law)
- **Legal Hold Toggle**: Admin-only ability to flag records as under legal hold
- **Soft Delete Only**: All deletions are logical, records remain in database
- **Audit Trail**: Track who initiated deletion and when

#### Use Cases
- MOHRE complaint investigation (retrieve 3-year-old termination request)
- Court case evidence (prevent deletion of disputed records)
- Annual audit (demonstrate retention compliance)

---

### 1.2 Grievance & Complaint Classification

**Business Need**: Some requests are legally sensitive under UAE law and require special handling.

**Current Gap**:
- All requests treated equally
- No visibility restrictions for sensitive matters
- No automatic risk flagging

**Requirements**:

#### Data Model Extensions
```sql
ALTER TABLE requests ADD COLUMN risk_classification VARCHAR(20) DEFAULT 'low';
  -- Values: low, medium, high
ALTER TABLE requests ADD COLUMN is_sensitive BOOLEAN DEFAULT false;
ALTER TABLE requests ADD COLUMN restricted_to_roles TEXT[]; 
  -- Array of roles allowed to view

-- Sensitive request types
CREATE TABLE sensitive_request_types (
  id SERIAL PRIMARY KEY,
  request_type VARCHAR(50) UNIQUE NOT NULL,
  auto_risk_level VARCHAR(20) DEFAULT 'high',
  restricted_to_roles TEXT[] DEFAULT ARRAY['admin', 'hr_manager'],
  requires_acknowledgement BOOLEAN DEFAULT true
);

-- Pre-populate sensitive types
INSERT INTO sensitive_request_types (request_type, auto_risk_level) VALUES
  ('harassment_complaint', 'high'),
  ('wage_complaint', 'high'),
  ('disciplinary_dispute', 'high'),
  ('termination_dispute', 'high'),
  ('discrimination_complaint', 'high');
```

#### Features
- **Risk Classification**: Automatic tagging based on request type
  - **Low**: Leave, certificates, general inquiries
  - **Medium**: Profile updates, bank changes
  - **High (Protected)**: Harassment, wage complaints, disciplinary disputes
- **Visibility Restriction**: High-risk requests visible only to:
  - HR Manager
  - Designated authority
  - Admin
- **Audit Flags**: `is_sensitive = true` for compliance reporting
- **Auto-Classification**: System automatically assigns risk level based on request type

#### Access Control
```python
# Example: Restrict access to sensitive requests
@router.get("/requests/pending")
async def list_pending_requests(
    role: str = Depends(require_role(["hr", "admin"])),
    employee_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_session),
):
    # Filter out sensitive requests unless user has elevated role
    if role not in ["admin", "hr_manager"]:
        requests = await service.list_non_sensitive_pending(db)
    else:
        requests = await service.list_all_pending(db)
    return requests
```

#### UI Indicators
- 🔴 Red badge for high-risk requests
- 🔒 Lock icon for restricted access
- ⚠️ Warning banner when viewing sensitive request

---

### 1.3 Probation & Termination Triggers

**Business Need**: Prevent illegal termination mistakes by tracking probation status and UAE labour law requirements.

**Current Gap**:
- Compliance calendar exists but not linked to employee lifecycle
- No probation milestone tracking
- No termination notice rule enforcement
- No Article 44/45 risk indicators

**Requirements**:

#### Data Model Extensions
```sql
-- Add to employees table
ALTER TABLE employees ADD COLUMN probation_end_date DATE;
ALTER TABLE employees ADD COLUMN probation_status VARCHAR(20) DEFAULT 'on_probation';
  -- Values: on_probation, confirmed, probation_extended
ALTER TABLE employees ADD COLUMN confirmation_date DATE;

-- Probation milestone tracking
CREATE TABLE probation_milestones (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(20) REFERENCES employees(employee_id),
  milestone_type VARCHAR(20) NOT NULL, -- 30_day, 90_day, 180_day, confirmation
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  completed_by VARCHAR(20),
  notes TEXT
);

-- Termination request tracking
ALTER TABLE requests ADD COLUMN termination_type VARCHAR(20);
  -- Values: during_probation, immediate, notice_period, mutual_consent
ALTER TABLE requests ADD COLUMN notice_period_days INTEGER;
ALTER TABLE requests ADD COLUMN termination_risk_flags TEXT[];
  -- Auto-calculated risk flags
```

#### Features

**Probation Milestone Reminders**:
- Auto-create milestones on employee creation:
  - 30-day review
  - 90-day review (UAE probation max: 6 months)
  - 180-day confirmation deadline
- Calendar integration with compliance calendar
- Email/WhatsApp reminders at -7, -3, -1 days

**Termination Request Tagging**:
- Automatic classification:
  - **During probation**: No notice required (Article 44)
  - **Confirmed employee**: Notice period required (Article 45)
  - **Immediate termination**: Requires legal grounds
- Risk indicators:
  - ⚠️ "Employee on probation - verify 6-month limit"
  - ⚠️ "Notice period required: 30 days"
  - 🔴 "Immediate termination - legal grounds required"

**Auto-Warning Banners** (Internal HR only):
```
⚠️ COMPLIANCE ALERT
Employee is on probation (expires: Feb 15, 2026)
- Termination during probation: No notice required (Article 44)
- Extension: Maximum 6 months total (Article 44)
- After probation: 30-day notice required (Article 45)
```

#### Compliance Rules (UAE Labour Law)
- **Article 44**: Probation period (max 6 months)
  - Either party can terminate without notice during probation
  - One extension allowed (max 6 months total)
- **Article 45**: Notice period after probation
  - Minimum 30 days notice for confirmed employees
  - Exceptions for serious misconduct (immediate termination)

---

### 1.4 Data Privacy Acknowledgement

**Business Need**: While UAE doesn't have GDPR-level enforcement, ADGM, DIFC, and corporate governance require data handling transparency.

**Current Gap**:
- Implicit data usage, not explicit
- No logged consent for data processing
- Potential ADGM/DIFC compliance issues

**Requirements**:

#### Data Model Extensions
```sql
CREATE TABLE data_privacy_acknowledgements (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(20) REFERENCES employees(employee_id),
  acknowledgement_type VARCHAR(50) NOT NULL, -- data_usage, policy_update
  acknowledgement_text TEXT NOT NULL,
  acknowledged_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  version VARCHAR(10) -- Track policy version
);

-- Add to employees table
ALTER TABLE employees ADD COLUMN data_privacy_acknowledged_at TIMESTAMP;
ALTER TABLE employees ADD COLUMN data_privacy_version VARCHAR(10);
```

#### Features

**First-Use Banner**:
```
┌─────────────────────────────────────────────────────┐
│  DATA USAGE NOTICE                                  │
│                                                     │
│  Data you submit will be used for:                 │
│  • HR administration and payroll processing        │
│  • UAE labour law compliance                       │
│  • Company policy enforcement                      │
│                                                     │
│  Your data is protected under:                     │
│  • Company confidentiality policy                  │
│  • UAE data protection regulations                 │
│  • ADGM/DIFC standards (if applicable)            │
│                                                     │
│  [I Acknowledge and Continue]                      │
└─────────────────────────────────────────────────────┘
```

**Implementation**:
- Show on first portal login
- Show on major policy updates
- Block access until acknowledged
- Log acceptance with timestamp, IP, user agent
- Version tracking for audit trail

**Audit Export**:
```csv
Employee ID, Name, Acknowledged At, Policy Version, IP Address
EMP001, John Doe, 2026-01-15 09:23:45, v1.0, 192.168.1.100
EMP002, Jane Smith, 2026-01-16 10:15:22, v1.0, 192.168.1.101
```

---

## 2. HR OPERATIONAL REALITY – FEATURES NEEDED SOON 🧠

### 2.1 SLA & Aging Metrics

**Business Need**: Track how long requests are stuck to protect HR, not just the system.

**Current Gap**:
- Status tracked but not duration
- No SLA targets per request type
- No automated overdue alerts

**Requirements**:

#### Data Model Extensions
```sql
-- SLA configuration
CREATE TABLE request_sla_config (
  id SERIAL PRIMARY KEY,
  request_type VARCHAR(50) UNIQUE NOT NULL,
  target_days INTEGER NOT NULL DEFAULT 3,
  escalation_days INTEGER NOT NULL DEFAULT 5,
  critical_days INTEGER NOT NULL DEFAULT 7
);

-- Pre-populate common SLAs
INSERT INTO request_sla_config (request_type, target_days, escalation_days, critical_days) VALUES
  ('leave', 2, 3, 5),
  ('certificate', 3, 5, 7),
  ('salary_certificate', 1, 2, 3),
  ('grievance', 3, 5, 7),
  ('termination_dispute', 1, 2, 3);

-- Add calculated fields to requests
ALTER TABLE requests ADD COLUMN days_open INTEGER;
ALTER TABLE requests ADD COLUMN is_overdue BOOLEAN DEFAULT false;
ALTER TABLE requests ADD COLUMN overdue_severity VARCHAR(20); 
  -- Values: on_time, approaching, overdue, critical
```

#### Features

**Auto-Calculated Metrics**:
```python
# Calculate on every status query
days_open = (datetime.now() - request.submitted_at).days
sla = get_sla_config(request.request_type)

overdue_severity = "on_time"
if days_open >= sla.critical_days:
    overdue_severity = "critical"
elif days_open >= sla.escalation_days:
    overdue_severity = "overdue"
elif days_open >= sla.target_days:
    overdue_severity = "approaching"

is_overdue = days_open > sla.target_days
```

**Dashboard Red Flags**:
```
HR Dashboard - Overdue Requests
┌────────────────────────────────────────────────────┐
│ 🔴 CRITICAL (>7 days)                       3      │
│ ⚠️  OVERDUE (5-7 days)                      5      │
│ 🟡 APPROACHING SLA (3-5 days)               8      │
│ ✅ ON TIME (<3 days)                        42     │
└────────────────────────────────────────────────────┘
```

**Request List with Aging**:
```
Reference    | Type        | Days Open | Status    | Severity
REF-2026-001 | Leave       | 2         | Reviewing | ✅ On time
REF-2026-002 | Certificate | 6         | Submitted | ⚠️ Overdue
REF-2026-003 | Grievance   | 9         | Reviewing | 🔴 Critical
```

---

### 2.2 Internal HR Notes vs Employee Notes

**Business Need**: HR often needs to document internal context without exposing it to employees.

**Current Gap**:
- All notes potentially visible
- No separation of internal vs external communication
- Risk of accidental disclosures

**Requirements**:

#### Data Model (Already Partially Implemented)
```sql
-- Already have these fields:
-- public_notes TEXT  -- Visible to employee
-- hr_notes TEXT      -- HR only

-- Add structured notes history
CREATE TABLE request_notes (
  id SERIAL PRIMARY KEY,
  request_reference VARCHAR(20) REFERENCES requests(reference),
  note_type VARCHAR(20) NOT NULL, -- internal, employee_visible, manager_feedback
  content TEXT NOT NULL,
  created_by VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  visible_to_roles TEXT[] DEFAULT ARRAY['admin', 'hr']
);
```

#### Features

**Note Types**:
1. **Internal Notes** (HR-only):
   - Legal context
   - Manager feedback
   - Investigation details
   - Sensitive remarks
2. **Employee-Visible Notes**:
   - Status updates
   - Action required
   - Resolution details
3. **System Notes**:
   - Auto-generated timestamps
   - Status transitions
   - SLA breaches

**UI Separation**:
```
┌─────────────────────────────────────────────────┐
│ Request REF-2026-047                            │
│                                                 │
│ Employee View:                                  │
│ └─ "Your leave request has been approved."     │
│                                                 │
│ Internal Notes (HR Only):                      │
│ └─ "Manager expressed concern about timing,    │
│     but approved due to family emergency.      │
│     Monitor for pattern."                      │
└─────────────────────────────────────────────────┘
```

**Access Control**:
- Employees see only `employee_visible_notes`
- HR sees all notes
- Managers see employee notes + tagged manager feedback
- System notes visible to all (timestamps only)

---

### 2.3 Manager Visibility Layer

**Business Need**: Reduce back-and-forth emails by giving managers read-only visibility.

**Current Gap**:
- Everything routed via HR
- Managers have no visibility into team requests
- Increases email load

**Requirements**:

#### Data Model Extensions
```sql
-- Manager acknowledgements
CREATE TABLE manager_acknowledgements (
  id SERIAL PRIMARY KEY,
  request_reference VARCHAR(20) REFERENCES requests(reference),
  manager_id VARCHAR(20) REFERENCES employees(employee_id),
  acknowledged_at TIMESTAMP DEFAULT NOW(),
  comment TEXT
);

-- Add to requests table
ALTER TABLE requests ADD COLUMN requires_manager_ack BOOLEAN DEFAULT false;
ALTER TABLE requests ADD COLUMN manager_acknowledged BOOLEAN DEFAULT false;
```

#### Features

**Read-Only Manager Dashboard**:
```
My Team Requests
┌────────────────────────────────────────────────────┐
│ Employee    | Type        | Status    | Days Open  │
│ John Doe    | Leave       | Approved  | 2         │
│ Jane Smith  | Certificate | Reviewing | 4         │
│ Bob Johnson | Salary Cert | Submitted | 1         │
└────────────────────────────────────────────────────┘

[View Details] [Add Comment]
```

**Comment-Only Capability**:
- Managers can add comments (stored in `manager_acknowledgements`)
- Comments visible to HR and employee
- No approval/rejection capability (HR retains control)

**Manager Acknowledgement**:
```
⚠️ Manager FYI
This leave request has been approved by HR.
Your team member will be absent Feb 5-7, 2026.

[Acknowledge] [Add Comment]
```

**Implementation Phase**: Deferred to Phase 3 or separate app

---

### 2.4 Attachment Handling Rules

**Business Need**: Requests will include documents that need proper handling.

**Current Gap**:
- No attachment handling defined
- No file validation
- No retention rules

**Requirements**:

#### Data Model
```sql
CREATE TABLE request_attachments (
  id SERIAL PRIMARY KEY,
  request_reference VARCHAR(20) REFERENCES requests(reference),
  filename VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL, -- bytes
  file_type VARCHAR(100) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by VARCHAR(20) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  virus_scan_status VARCHAR(20) DEFAULT 'pending',
  virus_scan_result TEXT,
  retention_until DATE, -- Auto-calculated based on request retention
  is_deleted BOOLEAN DEFAULT false
);
```

#### Features

**Allowed File Types**:
- Documents: PDF, DOC, DOCX
- Images: JPG, PNG (for scanned docs)
- Spreadsheets: XLS, XLSX (for payroll evidence)
- Maximum: 10MB per file

**Validation Rules**:
```python
ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.xls', '.xlsx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_attachment(file):
    # Check extension
    if not file.filename.lower().endswith(tuple(ALLOWED_EXTENSIONS)):
        raise ValueError("File type not allowed")
    
    # Check size
    if file.size > MAX_FILE_SIZE:
        raise ValueError("File size exceeds 10MB limit")
    
    # Check MIME type matches extension
    if not mime_type_matches_extension(file):
        raise ValueError("File type mismatch")
```

**Virus Scanning**:
- Placeholder for future integration
- Manual verification initially
- Status: `pending` → `clean` | `infected` | `scan_failed`

**Attachment Retention**:
- Inherit from parent request
- Auto-delete after retention period (soft delete)
- Legal hold prevents deletion

**Critical Use Cases**:
- Medical documents (certificates, fitness reports)
- Visa copies (passport, visa pages)
- Warning letters (disciplinary evidence)
- Payroll documentation (salary slips, bank statements)

---

## 3. COMPLIANCE CALENDAR – ADDITIONS 📅

### 3.1 Medical Insurance Lifecycle

**Business Need**: Medical insurance often forgotten but frequently audited.

**Requirements**:

#### Data Model Extensions
```sql
-- Add to employees table
ALTER TABLE employees ADD COLUMN medical_insurance_policy_number VARCHAR(50);
ALTER TABLE employees ADD COLUMN medical_insurance_provider VARCHAR(100);
ALTER TABLE employees ADD COLUMN medical_insurance_start_date DATE;
ALTER TABLE employees ADD COLUMN medical_insurance_end_date DATE;
ALTER TABLE employees ADD COLUMN medical_insurance_grace_period_days INTEGER DEFAULT 30;

-- Calendar events
-- Use existing compliance_calendar_events table with new event types:
-- - medical_insurance_expiry
-- - medical_insurance_grace_period_end
-- - new_joiner_enrollment_deadline
```

#### Features

**Lifecycle Tracking**:
- Policy start/end dates
- Grace period alerts (typically 30 days)
- New joiner enrollment deadline (within 30 days of joining per UAE law)

**Calendar Integration**:
```
Compliance Calendar - Medical Insurance
┌────────────────────────────────────────────────────┐
│ Feb 15 │ John Doe - Insurance expires (30 days)    │
│ Feb 20 │ Jane Smith - Grace period ends (7 days)   │
│ Mar 1  │ New Joiner - Bob Johnson enrollment due   │
└────────────────────────────────────────────────────┘
```

**Auto-Alerts**:
- -60 days: Renewal preparation
- -30 days: Urgent renewal required
- -7 days: Critical - insurance expiring
- Grace period: Daily reminders

---

### 3.2 Emirates ID & Labour Card Sync

**Business Need**: Visa, Emirates ID, and Labour Card are interconnected - expiry of one affects others.

**Requirements**:

#### Data Model Extensions
```sql
-- Add to employees table
ALTER TABLE employees ADD COLUMN labour_card_number VARCHAR(50);
ALTER TABLE employees ADD COLUMN labour_card_expiry_date DATE;
ALTER TABLE employees ADD COLUMN establishment_card_number VARCHAR(50);

-- Dependency mapping
CREATE TABLE document_dependencies (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(20) REFERENCES employees(employee_id),
  primary_document VARCHAR(50), -- visa, emirates_id, labour_card
  dependent_document VARCHAR(50),
  relationship_type VARCHAR(50) -- expires_with, must_renew_before
);
```

#### Features

**Dependency Mapping**:
- Visa renewal → Emirates ID must be renewed first
- Emirates ID expiry → Labour Card becomes invalid
- Labour Card renewal → Requires valid visa and EID

**Sync Alerts**:
```
⚠️ DEPENDENCY ALERT
John Doe's visa expires on Mar 15, 2026

Dependent documents:
├─ Emirates ID expires: Apr 1, 2026 (⚠️ Renew after visa)
└─ Labour Card expires: Mar 31, 2026 (⚠️ Renew after visa)

Action: Renew visa first, then update EID and Labour Card
```

**Renewal Workflow**:
1. Visa renewal initiated
2. System flags: "EID and Labour Card renewals pending"
3. After visa renewed: Auto-create calendar events for EID + Labour Card

---

### 3.3 Public Holiday Governance

**Business Need**: Prevent leave disputes by clearly defining holiday types.

**Requirements**:

#### Data Model
```sql
CREATE TABLE public_holidays (
  id SERIAL PRIMARY KEY,
  holiday_date DATE NOT NULL,
  holiday_name VARCHAR(100) NOT NULL,
  holiday_type VARCHAR(50) NOT NULL, -- uae_official, company_declared, optional
  is_mandatory BOOLEAN DEFAULT true,
  applies_to_departments TEXT[], -- NULL = all departments
  notes TEXT
);

-- Pre-populate UAE official holidays
INSERT INTO public_holidays (holiday_date, holiday_name, holiday_type, is_mandatory) VALUES
  ('2026-01-01', 'New Year', 'uae_official', true),
  ('2026-12-02', 'UAE National Day', 'uae_official', true),
  ('2026-12-03', 'UAE National Day Holiday', 'uae_official', true);
```

#### Features

**Holiday Types**:
1. **UAE Official**: Mandatory, paid, government-declared
2. **Company Declared**: Company-specific (e.g., founder's day)
3. **Optional**: Available to specific groups (e.g., religious holidays)

**Visibility Rules**:
- All employees see UAE official holidays
- Relevant departments see company-declared holidays
- Individuals see optional holidays applicable to them

**Leave Integration**:
```
Leave Request Validation:
- Check if dates overlap with public holidays
- Auto-exclude public holidays from leave calculation
- Warning: "Feb 5 is a public holiday (not counted in leave balance)"
```

**Calendar Display**:
```
February 2026
┌────────────────────────────────────────────────────┐
│ 5  │ 🇦🇪 UAE National Day (Company Closed)         │
│ 12 │ 🏢 Founder's Day (Company Holiday)            │
│ 20 │ ⭐ Optional Holiday (Hindu - Maha Shivaratri) │
└────────────────────────────────────────────────────┘
```

---

## 4. EMPLOYEE EXPERIENCE – STRATEGIC GAPS 🚦

### 4.1 "What Happens Next?" Visibility

**Business Need**: Cut follow-ups by 50%+ with clear expectations.

**Current Gap**:
- Tracking shows status but not expectations
- Employees don't know what to expect
- Increases "where is my request?" calls

**Requirements**:

#### Data Model Extensions
```sql
-- Add to requests table
ALTER TABLE requests ADD COLUMN current_stage VARCHAR(50);
ALTER TABLE requests ADD COLUMN next_stage VARCHAR(50);
ALTER TABLE requests ADD COLUMN estimated_completion_date DATE;

-- Stage descriptions
CREATE TABLE request_stage_descriptions (
  id SERIAL PRIMARY KEY,
  request_type VARCHAR(50) NOT NULL,
  stage VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  typical_duration_days INTEGER,
  next_stage VARCHAR(50),
  employee_action_required BOOLEAN DEFAULT false
);
```

#### Features

**Status with Context**:
```
┌─────────────────────────────────────────────────────┐
│ Request REF-2026-047                                │
│                                                     │
│ Status: Under Review                                │
│                                                     │
│ What's happening:                                   │
│ Your leave request is being reviewed by HR and     │
│ your manager. We're checking team availability     │
│ and ensuring compliance with leave policies.       │
│                                                     │
│ Expected completion: Within 3 working days          │
│ (By: Feb 3, 2026)                                  │
│                                                     │
│ What happens next:                                  │
│ └─ HR will review → Manager will approve →         │
│    You'll receive WhatsApp confirmation            │
│                                                     │
│ No action needed from you.                          │
└─────────────────────────────────────────────────────┘
```

**Dynamic ETA Calculation**:
```python
def calculate_eta(request):
    sla = get_sla_config(request.request_type)
    business_days = calculate_business_days(
        start=datetime.now(),
        days=sla.target_days,
        exclude_weekends=True,
        exclude_holidays=True
    )
    return business_days
```

**Stage-Based Messaging**:
- **Submitted**: "Your request has been received and is in the queue."
- **Reviewing**: "HR is reviewing your request. Expected completion: 2 days."
- **Approved**: "Your request has been approved. Certificate will be ready for collection tomorrow."
- **Completed**: "Your request is complete. No further action needed."

---

### 4.2 Knowledge Base / Policy Linking

**Business Need**: Educate employees, don't just process them.

**Current Gap**:
- No contextual help
- Employees don't understand policies
- Increases repetitive questions

**Requirements**:

#### Data Model
```sql
CREATE TABLE knowledge_base_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  article_type VARCHAR(50), -- policy, faq, guide, form
  related_request_types TEXT[],
  tags TEXT[],
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Link requests to KB articles
CREATE TABLE request_kb_suggestions (
  id SERIAL PRIMARY KEY,
  request_type VARCHAR(50) NOT NULL,
  kb_article_id INTEGER REFERENCES knowledge_base_articles(id),
  display_order INTEGER DEFAULT 0
);
```

#### Features

**Contextual Policy Display**:
```
Submit Leave Request
┌─────────────────────────────────────────────────────┐
│ Request Type: Annual Leave                          │
│                                                     │
│ 📖 Related Policies:                                │
│                                                     │
│ Leave Policy                                        │
│ └─ Annual leave: 30 days per year after 1 year     │
│    of service. Leave approval requires 7 days       │
│    advance notice for periods > 5 days.             │
│    [Read Full Policy →]                             │
│                                                     │
│ Public Holidays                                     │
│ └─ Public holidays are not counted as leave days.   │
│    Check holiday calendar before booking.           │
│    [View Calendar →]                                │
│                                                     │
│ [Continue with Request]                             │
└─────────────────────────────────────────────────────┘
```

**Smart Suggestions**:
- Leave request → Show leave policy + balance calculation
- Certificate request → Show sample format + processing time
- Grievance → Show resolution process + escalation path

**Search Integration**:
```
🔍 Search Policies & FAQs
├─ "How many leave days do I have?"
├─ "What documents needed for visa renewal?"
├─ "How to request salary certificate?"
└─ "Maternity leave entitlement"
```

**Implementation**:
- Phase 1: Static policy links
- Phase 2: Dynamic suggestions based on request type
- Phase 3: AI-powered search and recommendations

---

## 5. GOVERNANCE & SCALABILITY – FUTURE-PROOFING 🔒

### 5.1 Delegation of Authority Matrix

**Business Need**: HR shouldn't be the only gatekeeper as system scales.

**Current Gap**:
- HR is single point of approval for all requests
- Doesn't scale as organization grows
- Some decisions don't need HR involvement

**Requirements**:

#### Data Model
```sql
CREATE TABLE approval_rules (
  id SERIAL PRIMARY KEY,
  request_type VARCHAR(50) NOT NULL,
  approval_level INTEGER NOT NULL, -- 1 = first approver, 2 = second, etc.
  approver_role VARCHAR(50) NOT NULL, -- manager, hr, finance, admin
  approver_department VARCHAR(100), -- NULL = any department
  approval_required BOOLEAN DEFAULT true,
  can_delegate BOOLEAN DEFAULT false,
  timeout_days INTEGER DEFAULT 3
);

CREATE TABLE request_approvals (
  id SERIAL PRIMARY KEY,
  request_reference VARCHAR(20) REFERENCES requests(reference),
  approval_level INTEGER NOT NULL,
  approver_role VARCHAR(50) NOT NULL,
  approver_id VARCHAR(20) REFERENCES employees(employee_id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, delegated
  approved_at TIMESTAMP,
  comments TEXT,
  delegated_to VARCHAR(20) REFERENCES employees(employee_id),
  delegated_at TIMESTAMP
);

-- Pre-configure common approval rules
INSERT INTO approval_rules (request_type, approval_level, approver_role) VALUES
  ('leave', 1, 'manager'),
  ('leave', 2, 'hr'),
  ('salary_certificate', 1, 'hr'),
  ('bank_letter', 1, 'hr'),
  ('bank_letter', 2, 'finance'),
  ('termination', 1, 'hr'),
  ('termination', 2, 'admin');
```

#### Features

**Multi-Level Approval**:
```
Leave Request Approval Flow:
1. Manager (Line manager approval)
2. HR (Policy compliance check)
3. Auto-complete (if both approved)

Salary Certificate:
1. HR (Single approval - direct issue)

Termination:
1. HR (Legal review)
2. Admin/Director (Final authorization)
```

**Delegation Logic**:
```
┌─────────────────────────────────────────────────────┐
│ Pending Approvals (Manager View)                   │
│                                                     │
│ REF-2026-047 | John Doe | Leave | Feb 5-7         │
│ [Approve] [Reject] [Delegate to: Sarah (Acting)] │
│                                                     │
│ REF-2026-048 | Jane Smith | Certificate            │
│ [Approve] [Reject] [Delegate]                      │
└─────────────────────────────────────────────────────┘
```

**Timeout Escalation**:
- If manager doesn't respond in 3 days → Auto-escalate to HR
- If HR doesn't respond in 5 days → Escalate to admin
- Automatic reminders at -1 day before timeout

**Authority Matrix Example**:
| Request Type | Manager | HR | Finance | Admin |
|--------------|---------|-----|---------|-------|
| Leave | Level 1 | Level 2 | - | - |
| Certificate | - | Level 1 | - | - |
| Bank Letter | - | Level 1 | Level 2 | - |
| Termination | - | Level 1 | - | Level 2 |
| Grievance | - | Level 1 | - | Level 2 (if escalated) |

---

### 5.2 Export & Audit Readiness

**Business Need**: Auditors will ask. Be ready.

**Current Gap**:
- No one-click export capability
- Manual data extraction for audits
- Time-consuming compliance reporting

**Requirements**:

#### Features

**One-Click Exports**:

**1. Request Export**:
```csv
Reference, Type, Employee ID, Employee Name, Status, Submitted, Completed, Days Open, SLA Status
REF-2026-001, Leave, EMP001, John Doe, Completed, 2026-01-15, 2026-01-17, 2, On Time
REF-2026-002, Certificate, EMP002, Jane Smith, Approved, 2026-01-20, , 11, Overdue
```

**2. Status History Export**:
```csv
Reference, Previous Status, New Status, Changed By, Changed At, Notes
REF-2026-001, submitted, reviewing, HR001, 2026-01-15 10:30, Initial review
REF-2026-001, reviewing, approved, MGR001, 2026-01-16 14:20, Manager approved
REF-2026-001, approved, completed, HR001, 2026-01-17 09:15, Certificate issued
```

**3. Audit Log Export**:
```csv
Timestamp, User ID, Action, Resource Type, Resource ID, IP Address, Details
2026-01-15 09:23, EMP001, CREATE, request, REF-2026-001, 192.168.1.100, Leave request submitted
2026-01-15 10:30, HR001, UPDATE, request, REF-2026-001, 192.168.1.50, Status changed to reviewing
2026-01-16 14:20, MGR001, UPDATE, request, REF-2026-001, 192.168.1.75, Status changed to approved
```

**4. Compliance Report**:
```csv
Employee ID, Name, Visa Expiry, EID Expiry, Medical Insurance, Labour Card, Compliance Status
EMP001, John Doe, 2026-03-15, 2026-04-01, 2026-12-31, 2026-03-31, ⚠️ Visa expiring soon
EMP002, Jane Smith, 2027-01-20, 2027-02-15, 2026-06-30, 2027-01-31, ⚠️ Insurance expiring
EMP003, Bob Johnson, 2026-11-10, 2026-12-05, 2027-03-15, 2026-11-30, ✅ All current
```

#### Export Options
- **Format**: CSV, Excel (XLSX), PDF
- **Filters**: Date range, status, employee, department, request type
- **Scheduling**: Daily, weekly, monthly auto-exports via email

#### API Endpoints
```python
@router.get("/api/exports/requests")
async def export_requests(
    format: str = "csv",  # csv, xlsx, pdf
    from_date: date = None,
    to_date: date = None,
    status: str = None,
    role: str = Depends(require_role(["admin", "hr"]))
):
    """Export requests with filters"""
    
@router.get("/api/exports/audit-log")
async def export_audit_log(
    format: str = "csv",
    from_date: date = None,
    to_date: date = None,
    role: str = Depends(require_role(["admin"]))
):
    """Export audit log - admin only"""
```

---

## 6. IMPLEMENTATION STRATEGY

### 6.1 Phasing Recommendation

**Phase 2.5 (Enhanced Compliance - 2 weeks)**:
- Document retention & legal hold
- Grievance classification
- Probation & termination triggers
- Data privacy acknowledgement

**Phase 3.5 (Operational Excellence - 2 weeks)**:
- SLA & aging metrics
- Internal vs employee notes (enhance existing)
- Manager visibility layer
- Attachment handling

**Phase 4.5 (Advanced Calendar - 1 week)**:
- Medical insurance lifecycle
- Emirates ID & Labour Card sync
- Public holiday governance

**Phase 5.5 (Experience & Governance - 2 weeks)**:
- "What happens next?" visibility
- Knowledge base / policy linking
- Delegation of authority matrix
- Export & audit readiness

### 6.2 Data Migration Considerations

**For Separate App**:
- Import existing employee data (probation dates, insurance dates)
- Migrate compliance deadlines to new calendar structure
- Import historical requests (if keeping old pass data)
- Set up SLA baselines from current processing times

**Data Quality**:
- Validate probation end dates
- Backfill missing insurance dates
- Audit existing retention needs
- Clean up incomplete records

### 6.3 Integration Points with Current System

**Shared Data**:
- Employee master table (read-only reference)
- Authentication system (shared JWT)
- Document storage (shared location)

**Separate Data**:
- Enhanced request tracking (new tables)
- Compliance calendar (new structure)
- Knowledge base (new domain)
- Approval workflows (new logic)

---

## 7. SUCCESS METRICS

### 7.1 Compliance Metrics
- **Zero missed deadlines** (visa, insurance, probation)
- **100% legal hold compliance** (no accidental deletions)
- **Zero illegal terminations** (probation/notice period compliance)
- **100% data privacy acknowledgement** (all employees)

### 7.2 Operational Metrics
- **<1 day average request age** (SLA compliance)
- **50% reduction in status inquiries** (proactive communication)
- **80% manager visibility adoption** (reduced HR bottleneck)
- **Zero lost attachments** (document handling compliance)

### 7.3 Experience Metrics
- **<5 seconds to understand request status** ("what's next" clarity)
- **75% policy self-service** (KB utilization)
- **90% first-time approval rate** (better employee understanding)

### 7.4 Governance Metrics
- **<15 minutes audit report generation** (export readiness)
- **3-level delegation active** (reduced HR bottleneck)
- **100% audit trail completeness** (no gaps in history)

---

## 8. RISKS & MITIGATIONS

### 8.1 Risks

**Complexity Creep**:
- Risk: Too many features overwhelm solo HR
- Mitigation: Phased rollout, optional features, progressive disclosure

**Data Migration Issues**:
- Risk: Incomplete/incorrect historical data
- Mitigation: Dry-run migrations, data validation, manual review

**Adoption Resistance**:
- Risk: Employees/managers resist new workflows
- Mitigation: Training, gradual rollout, clear benefits communication

**Performance Impact**:
- Risk: Complex queries slow down system
- Mitigation: Database indexing, caching, query optimization

### 8.2 Mitigations

**Phased Implementation**:
- Deploy high-impact features first
- Collect feedback before next phase
- Allow time for adoption

**Progressive Enhancement**:
- Core features work without advanced features
- Optional modules can be disabled
- Fallback to simple workflows

**Training & Documentation**:
- Video walkthroughs for key features
- Quick reference cards
- In-app contextual help

---

## 9. COST IMPLICATIONS

### 9.1 Development Effort

**Phase 2.5 (Compliance)**: 80-100 hours
**Phase 3.5 (Operations)**: 80-100 hours
**Phase 4.5 (Calendar)**: 40-50 hours
**Phase 5.5 (Experience)**: 80-100 hours

**Total**: 280-350 hours (~7-9 weeks)

### 9.2 Ongoing Costs

**Storage**: Increased database size for attachments, audit logs (~$10-20/month)
**Backup**: Enhanced retention requires more backup storage (~$5-10/month)
**Support**: Training and documentation creation (one-time: 40-60 hours)

**Total Additional**: ~$15-30/month recurring

### 9.3 ROI

**Time Savings**:
- Reduced audit prep: 40 hours/year saved
- Reduced compliance research: 20 hours/year saved
- Reduced status inquiries: 15 hours/week × 52 = 780 hours/year saved

**Value**: 840 hours/year × $50/hour = **$42,000/year saved**

**Cost**: ~$30/month = $360/year

**Net ROI**: **$41,640/year** (11,566% ROI)

---

## 10. CONCLUSION

This separate app will address critical gaps in:
- **UAE compliance** (legal hold, grievances, probation, data privacy)
- **HR operations** (SLAs, notes separation, manager visibility, attachments)
- **Calendar enhancements** (insurance, EID/visa sync, holidays)
- **Employee experience** (expectations, knowledge base)
- **Governance** (delegation, audit exports)

**All features designed for solo HR maintainability.**

**Next Steps**:
1. Supervisor approval of phasing strategy
2. Technology stack selection for separate app
3. Data migration planning
4. Phase 2.5 kickoff

---

**Document Status**: Requirements captured, awaiting separate app implementation decision.
