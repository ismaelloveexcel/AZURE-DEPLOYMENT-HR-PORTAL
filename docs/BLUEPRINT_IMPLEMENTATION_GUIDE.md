# BAYNUNAH ESS Blueprint - Implementation Guide

## Purpose
This document provides step-by-step implementation guidance for achieving blueprint compliance based on the gaps identified in `BLUEPRINT_GAP_ANALYSIS.md`.

---

## Phase 1: Critical Infrastructure (Priority 1)

### 1.1 Approval Configuration System

#### Step 1: Create Model
```bash
# Create migration
cd backend
uv run alembic revision -m "add_approval_config_table"
```

```python
# File: backend/alembic/versions/XXXX_add_approval_config_table.py

def upgrade():
    op.create_table(
        'approval_configs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('request_type', sa.String(50), nullable=False, unique=True),
        sa.Column('approval_required', sa.Boolean(), default=True),
        sa.Column('approver_type', sa.String(50), nullable=False),  # line_manager, finance, ceo, none
        sa.Column('email_trigger', sa.String(50), nullable=False),  # on_submission, after_hr_review
        sa.Column('assisted_approval_enabled', sa.Boolean(), default=False),
        sa.Column('evidence_required', sa.Boolean(), default=False),
        sa.Column('active', sa.Boolean(), default=True),
        sa.Column('default_approver_email', sa.String(255), nullable=True),
        sa.Column('fallback_approver_email', sa.String(255), nullable=True),
        sa.Column('cc_emails', sa.String(500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_approval_configs_request_type'), 'approval_configs', ['request_type'])
    
    # Populate defaults
    op.execute("""
        INSERT INTO approval_configs (request_type, approval_required, approver_type, email_trigger, assisted_approval_enabled, evidence_required, active)
        VALUES 
            ('leave_request', true, 'line_manager', 'on_submission', false, false, true),
            ('document_request', true, 'line_manager', 'after_hr_review', false, false, true),
            ('reimbursement_request', true, 'line_manager', 'on_submission', false, true, true),
            ('recruitment_request', true, 'ceo', 'after_hr_review', false, true, true),
            ('hr_query', false, 'none', 'on_submission', false, false, true)
    """)

def downgrade():
    op.drop_index(op.f('ix_approval_configs_request_type'), table_name='approval_configs')
    op.drop_table('approval_configs')
```

#### Step 2: Create Model Class
```python
# File: backend/app/models/approval_config.py

from datetime import datetime
from typing import Optional
from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column
from app.models.renewal import Base

class ApprovalConfig(Base):
    """HR-configurable approval rules per request type.
    
    Blueprint Compliance: Implements Approval_Config reference table
    """
    __tablename__ = "approval_configs"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    request_type: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    
    # Blueprint fields
    approval_required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    approver_type: Mapped[str] = mapped_column(String(50), nullable=False)
    email_trigger: Mapped[str] = mapped_column(String(50), nullable=False)
    assisted_approval_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    evidence_required: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Enhanced fields
    default_approver_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    fallback_approver_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    cc_emails: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

# Valid values
APPROVER_TYPES = ["line_manager", "finance", "ceo", "none"]
EMAIL_TRIGGERS = ["on_submission", "after_hr_review"]
```

#### Step 3: Create Schemas
```python
# File: backend/app/schemas/approval_config.py

from datetime import datetime
from pydantic import BaseModel, field_validator

class ApprovalConfigBase(BaseModel):
    request_type: str
    approval_required: bool = True
    approver_type: str
    email_trigger: str
    assisted_approval_enabled: bool = False
    evidence_required: bool = False
    active: bool = True
    default_approver_email: str | None = None
    fallback_approver_email: str | None = None
    cc_emails: str | None = None
    
    @field_validator("approver_type")
    @classmethod
    def validate_approver_type(cls, v: str) -> str:
        valid = ["line_manager", "finance", "ceo", "none"]
        if v not in valid:
            raise ValueError(f"approver_type must be one of {valid}")
        return v
    
    @field_validator("email_trigger")
    @classmethod
    def validate_email_trigger(cls, v: str) -> str:
        valid = ["on_submission", "after_hr_review"]
        if v not in valid:
            raise ValueError(f"email_trigger must be one of {valid}")
        return v

class ApprovalConfigCreate(ApprovalConfigBase):
    pass

class ApprovalConfigUpdate(BaseModel):
    approval_required: bool | None = None
    approver_type: str | None = None
    email_trigger: str | None = None
    assisted_approval_enabled: bool | None = None
    evidence_required: bool | None = None
    active: bool | None = None
    default_approver_email: str | None = None
    fallback_approver_email: str | None = None
    cc_emails: str | None = None

class ApprovalConfigResponse(ApprovalConfigBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

#### Step 4: Create Repository
```python
# File: backend/app/repositories/approval_config.py

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.approval_config import ApprovalConfig

class ApprovalConfigRepository:
    async def get_by_request_type(
        self, 
        session: AsyncSession, 
        request_type: str
    ) -> Optional[ApprovalConfig]:
        """Get approval config for a specific request type"""
        result = await session.execute(
            select(ApprovalConfig).where(
                ApprovalConfig.request_type == request_type,
                ApprovalConfig.active == True
            )
        )
        return result.scalar_one_or_none()
    
    async def list_all(self, session: AsyncSession) -> Sequence[ApprovalConfig]:
        """List all approval configs"""
        result = await session.execute(
            select(ApprovalConfig).order_by(ApprovalConfig.request_type)
        )
        return result.scalars().all()
    
    async def create(
        self, 
        session: AsyncSession, 
        config_data: dict
    ) -> ApprovalConfig:
        """Create new approval config"""
        config = ApprovalConfig(**config_data)
        session.add(config)
        await session.flush()
        await session.refresh(config)
        return config
    
    async def update(
        self, 
        session: AsyncSession, 
        config_id: int, 
        update_data: dict
    ) -> Optional[ApprovalConfig]:
        """Update existing approval config"""
        result = await session.execute(
            select(ApprovalConfig).where(ApprovalConfig.id == config_id)
        )
        config = result.scalar_one_or_none()
        if config:
            for key, value in update_data.items():
                if value is not None:
                    setattr(config, key, value)
            await session.flush()
            await session.refresh(config)
        return config
```

#### Step 5: Create Service
```python
# File: backend/app/services/approval_config.py

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.approval_config import ApprovalConfigRepository
from app.schemas.approval_config import ApprovalConfigCreate, ApprovalConfigUpdate, ApprovalConfigResponse

class ApprovalConfigService:
    def __init__(self):
        self._repo = ApprovalConfigRepository()
    
    async def get_config(
        self, 
        session: AsyncSession, 
        request_type: str
    ) -> Optional[ApprovalConfigResponse]:
        """Get approval configuration for a request type"""
        config = await self._repo.get_by_request_type(session, request_type)
        return ApprovalConfigResponse.model_validate(config) if config else None
    
    async def list_configs(
        self, 
        session: AsyncSession
    ) -> List[ApprovalConfigResponse]:
        """List all approval configurations"""
        configs = await self._repo.list_all(session)
        return [ApprovalConfigResponse.model_validate(c) for c in configs]
    
    async def create_config(
        self, 
        session: AsyncSession, 
        data: ApprovalConfigCreate
    ) -> ApprovalConfigResponse:
        """Create new approval configuration"""
        config = await self._repo.create(session, data.dict())
        await session.commit()
        return ApprovalConfigResponse.model_validate(config)
    
    async def update_config(
        self, 
        session: AsyncSession, 
        config_id: int, 
        data: ApprovalConfigUpdate
    ) -> Optional[ApprovalConfigResponse]:
        """Update approval configuration"""
        config = await self._repo.update(session, config_id, data.dict(exclude_unset=True))
        if config:
            await session.commit()
            return ApprovalConfigResponse.model_validate(config)
        return None

approval_config_service = ApprovalConfigService()
```

#### Step 6: Add Admin Endpoints
```python
# File: backend/app/routers/admin.py (add to existing router)

from app.services.approval_config import approval_config_service
from app.schemas.approval_config import (
    ApprovalConfigCreate, 
    ApprovalConfigUpdate, 
    ApprovalConfigResponse
)

# Add these endpoints to the existing admin router

@router.get("/approval-configs", response_model=List[ApprovalConfigResponse])
async def list_approval_configs(
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(require_role(["admin", "hr"]))
):
    """List all approval configurations (HR/Admin only)"""
    return await approval_config_service.list_configs(session)

@router.get("/approval-configs/{request_type}", response_model=ApprovalConfigResponse)
async def get_approval_config(
    request_type: str,
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(require_role(["admin", "hr"]))
):
    """Get approval configuration for a request type"""
    config = await approval_config_service.get_config(session, request_type)
    if not config:
        raise HTTPException(404, "Configuration not found")
    return config

@router.post("/approval-configs", response_model=ApprovalConfigResponse)
async def create_approval_config(
    config: ApprovalConfigCreate,
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(require_role(["admin"]))
):
    """Create new approval configuration (Admin only)"""
    return await approval_config_service.create_config(session, config)

@router.put("/approval-configs/{config_id}", response_model=ApprovalConfigResponse)
async def update_approval_config(
    config_id: int,
    config: ApprovalConfigUpdate,
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(require_role(["admin"]))
):
    """Update approval configuration (Admin only)"""
    updated = await approval_config_service.update_config(session, config_id, config)
    if not updated:
        raise HTTPException(404, "Configuration not found")
    return updated
```

---

### 1.2 Document Risk Configuration

Follow similar pattern as Approval Config above, creating:
- Migration: `add_document_risk_config_table.py`
- Model: `models/document_risk_config.py`
- Schema: `schemas/document_risk_config.py`
- Repository: `repositories/document_risk_config.py`
- Service: `services/document_risk_config.py`
- Endpoints: Add to `routers/admin.py`

---

## Phase 2: Missing Modules

### 2.1 Document Requests Module

See detailed implementation in BLUEPRINT_GAP_ANALYSIS.md Section 13, Sample 3.

**Files to create:**
1. `models/document_request.py`
2. `schemas/document_request.py`
3. `repositories/document_request.py`
4. `services/document_request.py`
5. `routers/document_requests.py`
6. Migration file

---

### 2.2 Reimbursement Requests Module

**Quick Start:**
```bash
# Create files in order
touch backend/app/models/reimbursement.py
touch backend/app/schemas/reimbursement.py
touch backend/app/repositories/reimbursement.py
touch backend/app/services/reimbursement.py
touch backend/app/routers/reimbursements.py
```

**Model Template:**
```python
# backend/app/models/reimbursement.py
from datetime import datetime, date
from decimal import Decimal
from typing import Optional
from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.renewal import Base

class ReimbursementRequest(Base):
    """Employee reimbursement/expense claims.
    
    Blueprint Compliance: Implements Reimbursement_Requests table
    """
    __tablename__ = "reimbursement_requests"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    request_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False, index=True)
    
    # Blueprint fields
    claim_type: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    receipt: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)  # File path
    
    # Approval workflow (blueprint)
    approval_required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    assisted_approval_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    approval_response: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    approval_responder_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    approval_response_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Status (blueprint-compliant)
    status: Mapped[str] = mapped_column(String(50), default="Submitted", nullable=False)
    submitted_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    hr_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Enhanced fields
    currency: Mapped[str] = mapped_column(String(10), default="AED", nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    approved_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    paid: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    paid_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    payment_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Immutability
    is_locked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    hr_override_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    employee = relationship("Employee", foreign_keys=[employee_id])

# Claim types
CLAIM_TYPES = [
    "travel", "meals", "transportation", "medical", 
    "office_supplies", "training", "other"
]
```

**Follow same pattern** for schemas, repositories, services, and routers as shown in Approval Config example.

---

### 2.3 HR Queries Module

Similar implementation pattern. Key model:

```python
# backend/app/models/hr_query.py
class HRQuery(Base):
    """Employee queries/questions to HR.
    
    Blueprint Compliance: Implements HR_Queries table
    """
    __tablename__ = "hr_queries"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    query_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False, index=True)
    
    # Blueprint fields
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    confidential: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="Submitted", nullable=False)
    submitted_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    hr_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Enhanced fields
    subject: Mapped[str] = mapped_column(String(200), nullable=False)
    responded_by: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    responded_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    requires_followup: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    closed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    employee = relationship("Employee", foreign_keys=[employee_id])

QUERY_CATEGORIES = [
    "payroll", "benefits", "leave", "policy", 
    "complaint", "grievance", "general"
]
```

---

## Phase 3: Email Approval Infrastructure

### 3.1 Assisted Approval Tracking Model

```python
# backend/app/models/assisted_approval.py
from datetime import datetime
from typing import Optional
from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column
from app.models.renewal import Base

class AssistedApproval(Base):
    """Email-based assisted approval tracking.
    
    Blueprint Compliance: Tracks email approval workflow
    """
    __tablename__ = "assisted_approvals"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    # Link to request
    request_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    request_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    request_number: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Approver
    approver_email: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Token for email link
    approval_token: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    token_expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    
    # Email tracking
    email_sent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    email_opened_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Response
    response_received: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    response_action: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # approve, reject
    response_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # HR confirmation (blueprint requirement)
    hr_confirmed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    hr_confirmed_by: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    hr_confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
```

### 3.2 Email Service

```python
# backend/app/services/email_service.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

class EmailService:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.FROM_EMAIL
    
    def send_email(
        self, 
        to: str, 
        subject: str, 
        body: str, 
        is_html: bool = False
    ):
        """Send email (plain text or simple HTML)"""
        msg = MIMEMultipart()
        msg['From'] = self.from_email
        msg['To'] = to
        msg['Subject'] = subject
        
        mime_type = 'html' if is_html else 'plain'
        msg.attach(MIMEText(body, mime_type))
        
        with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
            server.starttls()
            server.login(self.smtp_user, self.smtp_password)
            server.send_message(msg)

email_service = EmailService()
```

### 3.3 Email Approval Service

See full implementation in BLUEPRINT_GAP_ANALYSIS.md Section 13, Sample 2.

---

## Testing Checklist

After implementing each module:

- [ ] Unit tests for repository CRUD operations
- [ ] Unit tests for service business logic
- [ ] Integration tests for API endpoints
- [ ] Test role-based access control
- [ ] Test data validation and sanitization
- [ ] Test blueprint status mapping
- [ ] Test email sending (if applicable)
- [ ] Test HR confirmation workflow
- [ ] Test request immutability
- [ ] Manual UI testing

---

## Deployment Checklist

Before deploying to production:

- [ ] Run all migrations on staging
- [ ] Populate default configurations
- [ ] Update environment variables for email settings
- [ ] Test email delivery end-to-end
- [ ] Update frontend to consume new APIs
- [ ] Update API documentation (Swagger)
- [ ] Train HR users on new configuration screens
- [ ] Document new workflows in user guide
- [ ] Set up monitoring for email approval failures
- [ ] Create rollback plan

---

## Frontend Integration Notes

### API Consumption Pattern

```typescript
// frontend/src/api/documentRequests.ts
export const documentRequestAPI = {
  create: async (data: DocumentRequestCreate) => {
    const response = await fetch('/api/document-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  list: async () => {
    const response = await fetch('/api/document-requests', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};
```

### UI Component Pattern

```typescript
// frontend/src/components/DocumentRequestForm.tsx
export const DocumentRequestForm = () => {
  const [documentType, setDocumentType] = useState('');
  const [purpose, setPurpose] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await documentRequestAPI.create({
        document_type: documentType,
        purpose
      });
      // Show generic success message per blueprint
      alert(result.message); // "Your request has been received. HR will follow up if required."
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

---

## Maintenance & Support

### Configuration Management

All approval rules and document risk levels should be managed through admin UI, not code changes.

**To add a new request type:**
1. Add entry to `approval_configs` table via admin UI
2. Add entry to `document_risk_configs` if applicable
3. No code deployment needed

### Monitoring

Key metrics to track:
- Email approval delivery rate
- Email approval response time
- Pending HR confirmations count
- Requests stuck in "Approval Response Received" status
- Failed email deliveries

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-25  
**See Also:** BLUEPRINT_GAP_ANALYSIS.md
