"""Gift service for business logic."""
import secrets
import string
from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.gift import Gift, GiftTemplate
from app.repositories.gift import GiftRepository, GiftTemplateRepository
from app.schemas.gift import (
    GiftTemplateResponse,
    QuestionnaireSubmit,
    GiftResponse,
    GiftPublicResponse,
    PaymentStubRequest
)


class GiftService:
    """Service for gift operations."""

    def __init__(self):
        self.gift_repo = GiftRepository()
        self.template_repo = GiftTemplateRepository()

    def _generate_unique_code(self) -> str:
        """Generate a unique gift code."""
        # Generate an 8-character alphanumeric code
        alphabet = string.ascii_uppercase + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(8))

    async def list_templates(self, db: AsyncSession) -> List[GiftTemplateResponse]:
        """List all active gift templates (limited to 5)."""
        templates = await self.template_repo.list_active(db)
        # Enforce 5 template limit
        return [GiftTemplateResponse.model_validate(t) for t in templates[:5]]

    async def get_template(self, db: AsyncSession, template_id: int) -> Optional[GiftTemplateResponse]:
        """Get a specific template."""
        template = await self.template_repo.get_by_id(db, template_id)
        if not template:
            return None
        return GiftTemplateResponse.model_validate(template)

    async def submit_questionnaire(
        self,
        db: AsyncSession,
        data: QuestionnaireSubmit,
        creator_ip: Optional[str] = None
    ) -> GiftResponse:
        """Submit questionnaire and create gift instance."""
        # Validate template exists
        template = await self.template_repo.get_by_id(db, data.template_id)
        if not template or not template.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found or inactive"
            )

        # Generate unique code
        unique_code = self._generate_unique_code()
        
        # Ensure uniqueness
        attempts = 0
        while await self.gift_repo.get_by_code(db, unique_code):
            if attempts > 10:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to generate unique code"
                )
            unique_code = self._generate_unique_code()
            attempts += 1

        # Create gift
        gift = Gift(
            unique_code=unique_code,
            template_id=data.template_id,
            recipient_name=data.recipient_name,
            occasion=data.occasion,
            custom_message=data.custom_message,
            questionnaire_data=data.questionnaire_data,
            creator_email=data.creator_email,
            creator_ip=creator_ip,
            generation_status="pending",
            payment_status="pending"
        )

        gift = await self.gift_repo.create(db, gift)
        await db.commit()
        return GiftResponse.model_validate(gift)

    async def generate_content(self, db: AsyncSession, gift_id: int) -> GiftResponse:
        """Generate AI content for a gift using Grok (stubbed for MVP)."""
        gift = await self.gift_repo.get_by_id(db, gift_id)
        if not gift:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Gift not found"
            )

        # Update status to generating
        gift.generation_status = "generating"
        await db.commit()

        # Stub: Simulate Grok AI generation with safety check
        try:
            # TODO: Replace with actual Grok API call
            # For MVP, use template-based generation
            template = await self.template_repo.get_by_id(db, gift.template_id)
            
            # Safety check (basic keyword filtering for MVP)
            unsafe_keywords = ["violence", "hate", "explicit", "offensive"]
            message_to_check = f"{gift.recipient_name} {gift.occasion} {gift.custom_message or ''}".lower()
            
            for keyword in unsafe_keywords:
                if keyword in message_to_check:
                    gift.generation_status = "rejected"
                    gift.rejection_reason = "Content flagged by safety filter"
                    await db.commit()
                    return GiftResponse.model_validate(gift)

            # Generate content (stub)
            generated_content = f"""Dear {gift.recipient_name},

Wishing you a wonderful {gift.occasion}! 

{gift.custom_message or 'May this special day bring you joy and happiness.'}

With warm wishes,
Your Friend"""

            gift.generated_content = generated_content
            gift.generation_status = "completed"
            
        except Exception as e:
            gift.generation_status = "failed"
            gift.rejection_reason = f"Generation failed: {str(e)}"

        await db.commit()
        return GiftResponse.model_validate(gift)

    async def get_gift(self, db: AsyncSession, gift_id: int) -> Optional[GiftResponse]:
        """Get a gift by ID."""
        gift = await self.gift_repo.get_by_id(db, gift_id)
        if not gift:
            return None
        return GiftResponse.model_validate(gift)

    async def get_gift_by_code(
        self,
        db: AsyncSession,
        unique_code: str,
        increment_views: bool = True
    ) -> Optional[GiftPublicResponse]:
        """Get a gift by unique code (public access)."""
        gift = await self.gift_repo.get_by_code(db, unique_code)
        if not gift:
            return None
        
        if increment_views:
            await self.gift_repo.increment_view_count(db, gift.id)
            await db.commit()
        
        return GiftPublicResponse.model_validate(gift)

    async def process_payment_stub(
        self,
        db: AsyncSession,
        data: PaymentStubRequest
    ) -> GiftResponse:
        """Process stub payment and mark gift as paid/delivered."""
        gift = await self.gift_repo.get_by_id(db, data.gift_id)
        if not gift:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Gift not found"
            )

        # Stub payment processing
        gift.payment_status = "paid"
        gift.payment_amount = data.amount
        gift.delivered_at = datetime.utcnow()
        
        await db.commit()
        return GiftResponse.model_validate(gift)

    async def list_recent_gifts(self, db: AsyncSession, limit: int = 50) -> List[GiftResponse]:
        """List recent gifts (admin only)."""
        gifts = await self.gift_repo.list_recent(db, limit)
        return [GiftResponse.model_validate(g) for g in gifts]
