"""Gift models for GiftForge MVP."""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Text, DateTime, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.models.employee import Base


class GiftTemplate(Base):
    """Gift template model - locked to 5 templates only."""
    __tablename__ = "gift_templates"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)  # birthday, anniversary, thank_you, etc
    preview_image: Mapped[str] = mapped_column(String(500), nullable=False)
    questionnaire_fields: Mapped[dict] = mapped_column(JSON, nullable=False)  # JSON structure for form fields
    template_structure: Mapped[dict] = mapped_column(JSON, nullable=False)  # Layout/design structure
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class Gift(Base):
    """Individual gift instance created by users."""
    __tablename__ = "gifts"

    id: Mapped[int] = mapped_column(primary_key=True)
    unique_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)  # Shareable link code
    template_id: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # Questionnaire responses
    recipient_name: Mapped[str] = mapped_column(String(200), nullable=False)
    occasion: Mapped[str] = mapped_column(String(100), nullable=False)
    custom_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    questionnaire_data: Mapped[dict] = mapped_column(JSON, nullable=False)  # All form responses
    
    # Generation details
    generated_content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # AI-generated content
    generation_status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)  # pending, generating, completed, failed, rejected
    rejection_reason: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)  # Safety rejection reason
    
    # Payment stub
    payment_status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)  # pending, paid, delivered
    payment_amount: Mapped[Optional[float]] = mapped_column(nullable=True)
    
    # Metadata
    creator_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    creator_ip: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    view_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    delivered_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
