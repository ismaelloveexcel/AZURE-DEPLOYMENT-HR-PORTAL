"""Pydantic schemas for Request Tracking System"""

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, field_validator

from app.core.security import sanitize_text


# Allowed request types (can be extended)
ALLOWED_REQUEST_TYPES = {
    "leave",
    "certificate",
    "salary_certificate",
    "employment_letter",
    "noc",
    "bank_letter",
    "profile_update",
    "document_upload",
    "grievance",
}

# Allowed status values
ALLOWED_STATUSES = {"submitted", "reviewing", "approved", "completed", "rejected"}


class RequestBase(BaseModel):
    """Base schema for Request"""
    
    request_type: str
    metadata: Optional[dict[str, Any]] = None
    
    @field_validator("request_type")
    @classmethod
    def validate_request_type(cls, value: str) -> str:
        """Validate request type is one of allowed types"""
        if value not in ALLOWED_REQUEST_TYPES:
            raise ValueError(
                f"request_type must be one of: {', '.join(sorted(ALLOWED_REQUEST_TYPES))}"
            )
        return value


class RequestCreate(RequestBase):
    """Schema for creating a new request"""
    pass


class RequestUpdate(BaseModel):
    """Schema for updating an existing request (HR only)"""
    
    status: Optional[str] = None
    hr_notes: Optional[str] = None
    public_notes: Optional[str] = None
    completed_at: Optional[datetime] = None
    
    @field_validator("status")
    @classmethod
    def validate_status(cls, value: Optional[str]) -> Optional[str]:
        """Validate status is one of allowed statuses"""
        if value and value not in ALLOWED_STATUSES:
            raise ValueError(
                f"status must be one of: {', '.join(sorted(ALLOWED_STATUSES))}"
            )
        return value
    
    @field_validator("hr_notes", "public_notes")
    @classmethod
    def sanitize_notes(cls, value: Optional[str]) -> Optional[str]:
        """Sanitize text input to prevent XSS"""
        return sanitize_text(value) if value else None


class RequestResponse(RequestBase):
    """Schema for request response (full details for HR)"""
    
    id: int
    reference: str
    employee_id: str
    status: str
    submitted_at: datetime
    completed_at: Optional[datetime]
    estimated_completion_days: int
    hr_notes: Optional[str] = None
    public_notes: Optional[str] = None
    created_by: str
    updated_at: datetime
    
    class Config:
        from_attributes = True


class RequestPublicResponse(BaseModel):
    """Public view of request (no sensitive data)
    
    Used for the public tracking endpoint (no authentication required).
    Does not expose HR notes or employee_id.
    """
    
    reference: str
    request_type: str
    status: str
    submitted_at: datetime
    estimated_completion: datetime  # Calculated field
    public_notes: Optional[str] = None
    
    class Config:
        from_attributes = True
