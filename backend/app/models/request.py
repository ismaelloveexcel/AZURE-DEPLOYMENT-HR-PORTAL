"""Request and NotificationLog models for Phase 1 Request Tracking System"""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.renewal import Base

if TYPE_CHECKING:
    from app.models.employee import Employee


class Request(Base):
    """Request model for unified request tracking system.
    
    Replaces multiple pass systems with a single, trackable request flow.
    Each request gets a unique reference number (REF-YYYY-NNN) for public tracking.
    """
    __tablename__ = "requests"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    reference: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    employee_id: Mapped[str] = mapped_column(
        String(20), 
        ForeignKey("employees.employee_id", ondelete="CASCADE"), 
        nullable=False, 
        index=True
    )
    request_type: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="submitted", index=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    estimated_completion_days: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    hr_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    public_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_by: Mapped[str] = mapped_column(String(20), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationship
    employee: Mapped["Employee"] = relationship("Employee", back_populates="requests")
    
    def __repr__(self) -> str:
        return f"<Request {self.reference} - {self.request_type} ({self.status})>"


class NotificationLog(Base):
    """Notification log for tracking WhatsApp/Email/SMS notifications.
    
    Maintains audit trail of all notifications sent to employees.
    Supports WhatsApp (Phase 3), email, and SMS channels.
    """
    __tablename__ = "notification_log"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    employee_id: Mapped[Optional[str]] = mapped_column(
        String(20), 
        ForeignKey("employees.employee_id", ondelete="SET NULL"),
        nullable=True
    )
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    channel: Mapped[str] = mapped_column(String(20), default="whatsapp", nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    reference_id: Mapped[Optional[str]] = mapped_column(String(20), nullable=True, index=True)
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    delivered_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self) -> str:
        return f"<NotificationLog {self.channel} to {self.employee_id} - {self.status}>"
