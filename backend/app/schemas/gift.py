"""Gift schemas for GiftForge MVP."""
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator
from app.core.security import sanitize_text


# Gift Template Schemas
class GiftTemplateBase(BaseModel):
    name: str
    description: str
    category: str
    preview_image: str
    questionnaire_fields: Dict[str, Any]
    template_structure: Dict[str, Any]
    is_active: bool = True
    display_order: int = 0

    @field_validator("name", "description", "category")
    @classmethod
    def sanitize_strings(cls, value: str) -> str:
        return sanitize_text(value) if value else value


class GiftTemplateResponse(GiftTemplateBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Gift Schemas
class QuestionnaireSubmit(BaseModel):
    """Questionnaire data submitted by user."""
    template_id: int
    recipient_name: str
    occasion: str
    custom_message: Optional[str] = None
    questionnaire_data: Dict[str, Any]
    creator_email: Optional[str] = None

    @field_validator("recipient_name", "occasion")
    @classmethod
    def sanitize_required_fields(cls, value: str) -> str:
        return sanitize_text(value) if value else value

    @field_validator("custom_message")
    @classmethod
    def sanitize_optional_message(cls, value: Optional[str]) -> Optional[str]:
        return sanitize_text(value) if value else value


class GiftGenerationRequest(BaseModel):
    """Request to generate gift content using AI."""
    gift_id: int


class GiftBase(BaseModel):
    unique_code: str
    template_id: int
    recipient_name: str
    occasion: str
    custom_message: Optional[str] = None
    questionnaire_data: Dict[str, Any]
    generated_content: Optional[str] = None
    generation_status: str = "pending"
    rejection_reason: Optional[str] = None
    payment_status: str = "pending"
    payment_amount: Optional[float] = None
    creator_email: Optional[str] = None
    view_count: int = 0


class GiftResponse(GiftBase):
    id: int
    created_at: datetime
    updated_at: datetime
    delivered_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class GiftPublicResponse(BaseModel):
    """Public view of gift (limited fields for sharing)."""
    unique_code: str
    recipient_name: str
    occasion: str
    generated_content: Optional[str] = None
    generation_status: str
    template_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PaymentStubRequest(BaseModel):
    """Stub payment request."""
    gift_id: int
    payment_method: str = "credit_card"
    amount: float = Field(gt=0, description="Payment amount must be positive")
