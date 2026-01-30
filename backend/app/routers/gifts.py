"""Gift router for GiftForge MVP."""
from typing import List
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.services.gift import GiftService
from app.schemas.gift import (
    GiftTemplateResponse,
    QuestionnaireSubmit,
    GiftResponse,
    GiftPublicResponse,
    GiftGenerationRequest,
    PaymentStubRequest
)

router = APIRouter(prefix="/gifts", tags=["giftforge"])
service = GiftService()


@router.get("/templates", response_model=List[GiftTemplateResponse])
async def list_templates(db: AsyncSession = Depends(get_session)):
    """List all active gift templates (limited to 5 for MVP)."""
    return await service.list_templates(db)


@router.get("/templates/{template_id}", response_model=GiftTemplateResponse)
async def get_template(
    template_id: int,
    db: AsyncSession = Depends(get_session)
):
    """Get a specific gift template."""
    template = await service.get_template(db, template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    return template


@router.post("/questionnaire", response_model=GiftResponse, status_code=status.HTTP_201_CREATED)
async def submit_questionnaire(
    data: QuestionnaireSubmit,
    request: Request,
    db: AsyncSession = Depends(get_session)
):
    """Submit questionnaire and create a new gift instance."""
    creator_ip = request.client.host if request.client else None
    return await service.submit_questionnaire(db, data, creator_ip)


@router.post("/generate", response_model=GiftResponse)
async def generate_content(
    data: GiftGenerationRequest,
    db: AsyncSession = Depends(get_session)
):
    """Generate AI content for a gift (with safety checks)."""
    return await service.generate_content(db, data.gift_id)


@router.get("/view/{unique_code}", response_model=GiftPublicResponse)
async def view_gift_public(
    unique_code: str,
    db: AsyncSession = Depends(get_session)
):
    """View a gift by its unique code (public access, increments view count)."""
    gift = await service.get_gift_by_code(db, unique_code)
    if not gift:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gift not found"
        )
    return gift


@router.get("/{gift_id}", response_model=GiftResponse)
async def get_gift(
    gift_id: int,
    db: AsyncSession = Depends(get_session)
):
    """Get a gift by ID (for creator/admin)."""
    gift = await service.get_gift(db, gift_id)
    if not gift:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gift not found"
        )
    return gift


@router.post("/payment", response_model=GiftResponse)
async def process_payment(
    data: PaymentStubRequest,
    db: AsyncSession = Depends(get_session)
):
    """Process stub payment and deliver gift."""
    return await service.process_payment_stub(db, data)


@router.get("/", response_model=List[GiftResponse])
async def list_recent_gifts(
    db: AsyncSession = Depends(get_session)
):
    """List recent gifts (admin view)."""
    return await service.list_recent_gifts(db)
