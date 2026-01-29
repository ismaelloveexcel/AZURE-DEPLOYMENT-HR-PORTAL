# Quick Start: Phase 1 Implementation Guide

## Overview
This guide walks through implementing the **Request Tracking System** - the foundation of the simplified HR portal.

**Time Estimate**: 1-2 weeks  
**Developer**: Solo HR or contracted developer  
**Prerequisites**: Existing FastAPI + React + PostgreSQL setup

---

## What You'll Build in Phase 1

```
┌─────────────────────────────────────┐
│  Employee                           │
│  ┌───────────────────────────────┐  │
│  │ Submit Request                │  │
│  │ ↓                             │  │
│  │ Get: REF-2026-047             │  │
│  │ ↓                             │  │
│  │ WhatsApp: "Request received"  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Anyone (Public)                    │
│  ┌───────────────────────────────┐  │
│  │ Go to /track                  │  │
│  │ ↓                             │  │
│  │ Enter: REF-2026-047           │  │
│  │ ↓                             │  │
│  │ See status & timeline         │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  HR                                 │
│  ┌───────────────────────────────┐  │
│  │ See request queue             │  │
│  │ ↓                             │  │
│  │ Update status                 │  │
│  │ ↓                             │  │
│  │ WhatsApp auto-sent            │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Step 1: Database Setup (30 minutes)

### 1.1 Create Migration File

```bash
cd backend
uv run alembic revision -m "create_requests_and_notifications_tables"
```

### 1.2 Edit Migration File

```python
# alembic/versions/xxx_create_requests_and_notifications_tables.py

def upgrade():
    # Requests table
    op.create_table(
        'requests',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('reference', sa.String(20), unique=True, nullable=False),
        sa.Column('employee_id', sa.String(20), sa.ForeignKey('employees.employee_id'), nullable=False),
        sa.Column('request_type', sa.String(50), nullable=False),
        sa.Column('status', sa.String(20), server_default='submitted', nullable=False),
        sa.Column('submitted_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('estimated_completion_days', sa.Integer(), server_default='3'),
        sa.Column('hr_notes', sa.Text(), nullable=True),
        sa.Column('public_notes', sa.Text(), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_by', sa.String(20), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now())
    )
    
    # Indexes for performance
    op.create_index('idx_requests_reference', 'requests', ['reference'])
    op.create_index('idx_requests_employee', 'requests', ['employee_id'])
    op.create_index('idx_requests_status', 'requests', ['status'])
    
    # Notification log table
    op.create_table(
        'notification_log',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('employee_id', sa.String(20), sa.ForeignKey('employees.employee_id')),
        sa.Column('phone_number', sa.String(20)),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('channel', sa.String(20), server_default='whatsapp'),
        sa.Column('status', sa.String(20), server_default='pending'),
        sa.Column('reference_id', sa.String(20)),
        sa.Column('sent_at', sa.DateTime(), nullable=True),
        sa.Column('delivered_at', sa.DateTime(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )
    
    op.create_index('idx_notif_employee', 'notification_log', ['employee_id'])
    op.create_index('idx_notif_reference', 'notification_log', ['reference_id'])

def downgrade():
    op.drop_table('notification_log')
    op.drop_table('requests')
```

### 1.3 Run Migration

```bash
uv run alembic upgrade head
```

---

## Step 2: Backend Models (15 minutes)

### 2.1 Create Request Model

```python
# backend/app/models/request.py

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.models.renewal import Base

class Request(Base):
    __tablename__ = "requests"
    
    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(20), unique=True, nullable=False, index=True)
    employee_id = Column(String(20), ForeignKey("employees.employee_id"), nullable=False, index=True)
    request_type = Column(String(50), nullable=False)
    status = Column(String(20), default="submitted", index=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    estimated_completion_days = Column(Integer, default=3)
    hr_notes = Column(Text, nullable=True)
    public_notes = Column(Text, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_by = Column(String(20), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="requests")

class NotificationLog(Base):
    __tablename__ = "notification_log"
    
    id = Column(Integer, primary_key=True)
    employee_id = Column(String(20), ForeignKey("employees.employee_id"))
    phone_number = Column(String(20))
    message = Column(Text, nullable=False)
    channel = Column(String(20), default="whatsapp")
    status = Column(String(20), default="pending")
    reference_id = Column(String(20), index=True)
    sent_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### 2.2 Update Employee Model

```python
# backend/app/models/employee.py (add this relationship)

class Employee(Base):
    # ... existing fields ...
    
    requests = relationship("Request", back_populates="employee")
```

---

## Step 3: Backend Schemas (20 minutes)

```python
# backend/app/schemas/request.py

from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, field_validator
from app.core.security import sanitize_text

class RequestBase(BaseModel):
    request_type: str
    metadata: Optional[dict[str, Any]] = None
    
    @field_validator("request_type")
    @classmethod
    def validate_request_type(cls, value: str) -> str:
        allowed = {
            "leave", "certificate", "salary_certificate", 
            "employment_letter", "noc", "bank_letter", 
            "profile_update", "document_upload", "grievance"
        }
        if value not in allowed:
            raise ValueError(f"request_type must be one of: {allowed}")
        return value

class RequestCreate(RequestBase):
    pass

class RequestUpdate(BaseModel):
    status: Optional[str] = None
    hr_notes: Optional[str] = None
    public_notes: Optional[str] = None
    completed_at: Optional[datetime] = None
    
    @field_validator("status")
    @classmethod
    def validate_status(cls, value: Optional[str]) -> Optional[str]:
        if value:
            allowed = {"submitted", "reviewing", "approved", "completed", "rejected"}
            if value not in allowed:
                raise ValueError(f"status must be one of: {allowed}")
        return value
    
    @field_validator("hr_notes", "public_notes")
    @classmethod
    def sanitize_notes(cls, value: Optional[str]) -> Optional[str]:
        return sanitize_text(value) if value else None

class RequestResponse(RequestBase):
    id: int
    reference: str
    employee_id: str
    status: str
    submitted_at: datetime
    completed_at: Optional[datetime]
    estimated_completion_days: int
    public_notes: Optional[str]
    created_by: str
    updated_at: datetime
    
    class Config:
        from_attributes = True

class RequestPublicResponse(BaseModel):
    """Public view - no sensitive data"""
    reference: str
    request_type: str
    status: str
    submitted_at: datetime
    estimated_completion: datetime
    public_notes: Optional[str]
    
    class Config:
        from_attributes = True
```

---

## Step 4: Reference Number Generator (15 minutes)

```python
# backend/app/services/reference_generator.py

from datetime import datetime
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.request import Request

class ReferenceGenerator:
    @staticmethod
    async def generate(db: AsyncSession) -> str:
        """Generate unique reference: REF-2026-001"""
        current_year = datetime.utcnow().year
        
        # Get count of requests this year
        result = await db.execute(
            select(func.count(Request.id))
            .where(Request.reference.like(f"REF-{current_year}-%"))
        )
        count = result.scalar() or 0
        
        # Increment and format
        next_number = count + 1
        reference = f"REF-{current_year}-{next_number:03d}"
        
        return reference
```

---

## Step 5: Request Service (45 minutes)

```python
# backend/app/services/requests.py

from typing import List, Optional
from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.models.request import Request
from app.schemas.request import RequestCreate, RequestUpdate, RequestResponse, RequestPublicResponse
from app.services.reference_generator import ReferenceGenerator

class RequestService:
    async def create_request(
        self, 
        db: AsyncSession, 
        data: RequestCreate,
        employee_id: str,
        created_by: str
    ) -> RequestResponse:
        """Create new request with auto-generated reference"""
        reference = await ReferenceGenerator.generate(db)
        
        request = Request(
            reference=reference,
            employee_id=employee_id,
            request_type=data.request_type,
            metadata=data.metadata,
            created_by=created_by
        )
        
        db.add(request)
        await db.flush()
        await db.refresh(request)
        await db.commit()
        
        return RequestResponse.model_validate(request)
    
    async def get_by_reference(
        self, 
        db: AsyncSession, 
        reference: str
    ) -> Optional[Request]:
        """Get request by reference number"""
        result = await db.execute(
            select(Request).where(Request.reference == reference)
        )
        return result.scalar_one_or_none()
    
    async def get_public_view(
        self, 
        db: AsyncSession, 
        reference: str
    ) -> RequestPublicResponse:
        """Public view - sanitized for employee tracking"""
        request = await self.get_by_reference(db, reference)
        
        if not request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Request not found"
            )
        
        # Calculate estimated completion
        estimated_completion = request.submitted_at + timedelta(
            days=request.estimated_completion_days
        )
        
        return RequestPublicResponse(
            reference=request.reference,
            request_type=request.request_type,
            status=request.status,
            submitted_at=request.submitted_at,
            estimated_completion=estimated_completion,
            public_notes=request.public_notes
        )
    
    async def list_pending(
        self, 
        db: AsyncSession
    ) -> List[RequestResponse]:
        """List all pending requests for HR"""
        result = await db.execute(
            select(Request)
            .where(Request.status.in_(["submitted", "reviewing"]))
            .order_by(Request.submitted_at.asc())
        )
        requests = result.scalars().all()
        return [RequestResponse.model_validate(r) for r in requests]
    
    async def update_request(
        self, 
        db: AsyncSession,
        reference: str,
        data: RequestUpdate
    ) -> RequestResponse:
        """Update request status and notes"""
        request = await self.get_by_reference(db, reference)
        
        if not request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Request not found"
            )
        
        if data.status:
            request.status = data.status
        if data.hr_notes is not None:
            request.hr_notes = data.hr_notes
        if data.public_notes is not None:
            request.public_notes = data.public_notes
        if data.completed_at:
            request.completed_at = data.completed_at
        
        request.updated_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(request)
        
        return RequestResponse.model_validate(request)

request_service = RequestService()
```

---

## Step 6: Request Router (30 minutes)

```python
# backend/app/routers/requests.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import require_role
from app.database import get_session
from app.schemas.request import RequestCreate, RequestUpdate, RequestResponse, RequestPublicResponse
from app.services.requests import request_service

router = APIRouter(prefix="/requests", tags=["requests"])

@router.post("", response_model=RequestResponse)
async def create_request(
    data: RequestCreate,
    role: str = Depends(require_role(["employee", "hr", "admin"])),
    db: AsyncSession = Depends(get_session),
):
    """Create new request - returns reference number"""
    # In production, get employee_id from JWT token
    # For now, using placeholder
    employee_id = "EMP001"  # TODO: Extract from token
    
    request = await request_service.create_request(
        db, data, employee_id, created_by=employee_id
    )
    
    # TODO: Trigger WhatsApp notification
    
    return request

@router.get("/track/{reference}", response_model=RequestPublicResponse)
async def track_request(reference: str, db: AsyncSession = Depends(get_session)):
    """Public endpoint - track request by reference number (NO AUTH REQUIRED)"""
    return await request_service.get_public_view(db, reference)

@router.get("/pending", response_model=List[RequestResponse])
async def list_pending_requests(
    role: str = Depends(require_role(["hr", "admin"])),
    db: AsyncSession = Depends(get_session),
):
    """List all pending requests for HR review"""
    return await request_service.list_pending(db)

@router.patch("/{reference}", response_model=RequestResponse)
async def update_request(
    reference: str,
    data: RequestUpdate,
    role: str = Depends(require_role(["hr", "admin"])),
    db: AsyncSession = Depends(get_session),
):
    """Update request status and notes"""
    request = await request_service.update_request(db, reference, data)
    
    # TODO: Trigger WhatsApp notification on status change
    
    return request
```

---

## Step 7: Register Router (5 minutes)

```python
# backend/app/main.py

from app.routers import requests

# Add to router registration
app.include_router(requests.router, prefix="/api")
```

---

## Step 8: Frontend - Track Request Page (1 hour)

```typescript
// frontend/src/pages/TrackRequest.tsx

import { useState } from 'react';
import { Search } from 'lucide-react';

interface RequestStatus {
  reference: string;
  request_type: string;
  status: string;
  submitted_at: string;
  estimated_completion: string;
  public_notes: string | null;
}

export const TrackRequest = () => {
  const [reference, setReference] = useState('');
  const [request, setRequest] = useState<RequestStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!reference.trim()) {
      setError('Please enter a reference number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/requests/track/${reference.trim()}`);
      
      if (!response.ok) {
        throw new Error('Request not found');
      }
      
      const data = await response.json();
      setRequest(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request not found');
      setRequest(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusSteps = (currentStatus: string) => {
    const steps = ['submitted', 'reviewing', 'approved', 'completed'];
    const currentIndex = steps.indexOf(currentStatus);
    
    return steps.map((step, index) => ({
      name: step.charAt(0).toUpperCase() + step.slice(1),
      completed: index <= currentIndex
    }));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Track Your Request
          </h1>
          <p className="text-gray-600">
            Enter your reference number to check status
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="REF-2026-001"
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-900"
            >
              <Search size={20} />
            </button>
          </div>
          
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Result */}
        {request && (
          <div className="border border-gray-200 rounded-sm p-6">
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-1">Reference</div>
              <div className="text-xl font-medium text-gray-900">
                {request.reference}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-1">Request Type</div>
              <div className="text-gray-900">
                {request.request_type.replace('_', ' ').toUpperCase()}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-3">Status</div>
              <div className="space-y-2">
                {getStatusSteps(request.status).map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`
                        w-4 h-4 rounded-full border-2 mr-3
                        ${step.completed 
                          ? 'bg-gray-900 border-gray-900' 
                          : 'bg-white border-gray-300'
                        }
                      `}
                    />
                    <div
                      className={
                        step.completed ? 'text-gray-900' : 'text-gray-400'
                      }
                    >
                      {step.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-1">Submitted</div>
              <div className="text-gray-900">
                {formatDate(request.submitted_at)}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-1">
                Expected Completion
              </div>
              <div className="text-gray-900">
                {formatDate(request.estimated_completion)}
              </div>
            </div>

            {request.public_notes && (
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Notes</div>
                <div className="text-gray-900">{request.public_notes}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## Step 9: Frontend - Submit Request Page (1 hour)

```typescript
// frontend/src/pages/SubmitRequest.tsx

import { useState } from 'react';
import { Check } from 'lucide-react';

const requestTypes = [
  { value: 'leave', label: 'Leave Request' },
  { value: 'certificate', label: 'Experience Certificate' },
  { value: 'salary_certificate', label: 'Salary Certificate' },
  { value: 'employment_letter', label: 'Employment Letter' },
  { value: 'noc', label: 'NOC (No Objection Certificate)' },
  { value: 'bank_letter', label: 'Bank Letter' },
  { value: 'profile_update', label: 'Profile Update' },
  { value: 'grievance', label: 'Grievance/Complaint' },
];

export const SubmitRequest = () => {
  const [requestType, setRequestType] = useState('');
  const [metadata, setMetadata] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          request_type: requestType,
          metadata: metadata ? JSON.parse(metadata) : {}
        })
      });

      const data = await response.json();
      setReference(data.reference);
      setSubmitted(true);
      
      // TODO: Trigger WhatsApp notification
    } catch (err) {
      alert('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-medium text-gray-900 mb-4">
            Request Submitted
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your request has been received. Use this reference to track status:
          </p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 mb-6">
            <div className="text-3xl font-medium text-gray-900">
              {reference}
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = `/track?ref=${reference}`}
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-sm hover:bg-gray-800"
            >
              Track Request
            </button>
            
            <button
              onClick={() => {
                setSubmitted(false);
                setRequestType('');
                setMetadata('');
                setReference('');
              }}
              className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-sm hover:bg-gray-50"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium text-gray-900 mb-8">
          Submit Request
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Request Type
            </label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">Select request type...</option>
              {requestTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              rows={4}
              placeholder="Provide any additional information..."
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !requestType}
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-sm hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};
```

---

## Step 10: Test Everything (30 minutes)

### 10.1 Backend Testing

```bash
# Start backend
cd backend
uv run uvicorn app.main:app --reload

# Test endpoints with curl

# 1. Create request (requires auth token)
curl -X POST http://localhost:8000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"request_type": "leave", "metadata": {}}'

# Expected: {"reference": "REF-2026-001", ...}

# 2. Track request (public - no auth)
curl http://localhost:8000/api/requests/track/REF-2026-001

# Expected: {"reference": "REF-2026-001", "status": "submitted", ...}

# 3. List pending (requires HR role)
curl http://localhost:8000/api/requests/pending \
  -H "Authorization: Bearer HR_TOKEN"

# Expected: [{"reference": "REF-2026-001", ...}]

# 4. Update request (requires HR role)
curl -X PATCH http://localhost:8000/api/requests/REF-2026-001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer HR_TOKEN" \
  -d '{"status": "approved", "public_notes": "Approved by HR"}'

# Expected: {"reference": "REF-2026-001", "status": "approved", ...}
```

### 10.2 Frontend Testing

```bash
# Start frontend
cd frontend
npm run dev

# Test in browser:
# 1. Go to http://localhost:5173/track
# 2. Enter REF-2026-001
# 3. Should see request status

# 4. Go to http://localhost:5173/requests/new (requires login)
# 5. Submit a request
# 6. Should get reference number
# 7. Use reference to track
```

---

## Step 11: Deploy to Azure (optional for Phase 1)

```bash
# Update .github/workflows/deploy.yml if needed
# Commit and push to main branch
git add .
git commit -m "Phase 1: Request tracking system"
git push origin main

# GitHub Actions will automatically deploy
```

---

## Verification Checklist

- [ ] Database tables created (requests, notification_log)
- [ ] Backend models defined
- [ ] Backend schemas with validation
- [ ] Reference generator working (REF-YYYY-NNN format)
- [ ] Request service CRUD operations
- [ ] Request router with 4 endpoints
- [ ] Track request page (public, no auth)
- [ ] Submit request page (authenticated)
- [ ] Can create request via API
- [ ] Can track request by reference
- [ ] Can list pending requests (HR)
- [ ] Can update request status (HR)

---

## What's Next?

**Phase 2**: HR Command Center & Compliance Calendar
**Phase 3**: WhatsApp Integration
**Phase 4**: Migration from old pass system
**Phase 5**: Polish & launch

---

## Need Help?

- Backend issues: Check `backend/app/main.py` logs
- Frontend issues: Check browser console
- Database issues: Check migration with `alembic current`
- API docs: http://localhost:8000/docs

---

**Estimated Phase 1 completion: 1-2 weeks**  
**Next milestone: Working request tracking system with reference numbers**
