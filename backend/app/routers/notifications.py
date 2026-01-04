from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.notification import NotificationService
from app.repositories.notification import NotificationRepository
from app.schemas.notification import NotificationCreate, NotificationResponse
from app.auth.dependencies import get_current_user, get_session
from typing import List, Optional

router = APIRouter(prefix="/api/notifications", tags=["notifications"])
service = NotificationService(NotificationRepository())

@router.post("", response_model=NotificationResponse)
async def create_notification(
    data: NotificationCreate,
    session: AsyncSession = Depends(get_session),
    user = Depends(get_current_user)
):
    return await service.create(session, data)

@router.get("", response_model=List[NotificationResponse])
async def list_notifications(
    unread_only: bool = False,
    session: AsyncSession = Depends(get_session),
    user = Depends(get_current_user)
):
    return await service.list(session, user.employee_id, unread_only)

@router.post("/{notification_id}/read", response_model=NotificationResponse)
async def mark_read(
    notification_id: int,
    session: AsyncSession = Depends(get_session),
    user = Depends(get_current_user)
):
    return await service.mark_read(session, notification_id)
