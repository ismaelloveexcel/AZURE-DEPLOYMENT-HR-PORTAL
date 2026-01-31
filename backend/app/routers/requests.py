"""Request router for Phase 1 Request Tracking System"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_role
from app.database import get_session
from app.schemas.request import RequestCreate, RequestUpdate, RequestResponse, RequestPublicResponse
from app.services.requests import request_service


router = APIRouter(prefix="/requests", tags=["requests"])


@router.post("", response_model=RequestResponse, status_code=status.HTTP_201_CREATED)
async def create_request(
    data: RequestCreate,
    db: AsyncSession = Depends(get_session),
    role: str = Depends(require_role(["viewer", "hr", "admin"])),
):
    """Create new request - returns reference number.
    
    **Authentication Required**: Yes (any authenticated user)
    
    Workflow:
    1. Employee submits request
    2. System generates unique reference (REF-2026-NNN)
    3. Request starts in "submitted" status
    4. Employee receives reference for tracking
    5. [Phase 3] WhatsApp notification sent
    
    Example:
        ```json
        {
          "request_type": "leave",
          "metadata": {
            "start_date": "2026-02-01",
            "end_date": "2026-02-05",
            "reason": "Annual leave"
          }
        }
        ```
    
    Returns:
        Request with reference number (e.g., REF-2026-047)
    """
    # TODO: Extract employee_id from JWT token
    # For now, using placeholder (will be fixed when auth is connected)
    employee_id = "EMP001"  # TODO: Get from token payload
    
    request = await request_service.create_request(
        db=db,
        data=data,
        employee_id=employee_id,
        created_by=employee_id
    )
    
    # TODO [Phase 3]: Trigger WhatsApp notification
    # await whatsapp_service.notify_request_created(request)
    
    return request


@router.get("/track/{reference}", response_model=RequestPublicResponse)
async def track_request(
    reference: str,
    db: AsyncSession = Depends(get_session)
):
    """**PUBLIC ENDPOINT** - Track request by reference number (NO AUTH REQUIRED).
    
    Anyone with the reference number can check status.
    This is intentional to reduce login friction for employees.
    
    Returns sanitized data only:
    - Reference number
    - Request type
    - Current status
    - Submission date
    - Estimated completion
    - Public notes (HR-controlled)
    
    Does NOT return:
    - Employee ID
    - HR notes
    - Metadata
    
    Example:
        GET /api/requests/track/REF-2026-047
    
    Returns:
        ```json
        {
          "reference": "REF-2026-047",
          "request_type": "leave",
          "status": "approved",
          "submitted_at": "2026-01-29T10:00:00",
          "estimated_completion": "2026-02-01T10:00:00",
          "public_notes": "Approved by HR. Certificate ready for collection."
        }
        ```
    """
    return await request_service.get_public_view(db, reference)


@router.get("/pending", response_model=List[RequestResponse])
async def list_pending_requests(
    db: AsyncSession = Depends(get_session),
    role: str = Depends(require_role(["hr", "admin"])),
):
    """List all pending requests for HR review.
    
    **Authentication Required**: Yes (HR/Admin only)
    
    Shows requests with status:
    - submitted
    - reviewing
    
    Ordered by submission date (oldest first = FIFO queue).
    
    Used by HR Command Center to show action items.
    
    Returns:
        List of pending requests with full details
    """
    return await request_service.list_pending(db)


@router.patch("/{reference}", response_model=RequestResponse)
async def update_request(
    reference: str,
    data: RequestUpdate,
    db: AsyncSession = Depends(get_session),
    role: str = Depends(require_role(["hr", "admin"])),
):
    """Update request status and notes (HR only).
    
    **Authentication Required**: Yes (HR/Admin only)
    
    Allows HR to:
    - Change status (submitted → reviewing → approved → completed)
    - Add HR notes (internal only)
    - Add public notes (visible to employee)
    - Set completion date
    
    Example:
        ```json
        {
          "status": "approved",
          "public_notes": "Your leave request has been approved."
        }
        ```
    
    Triggers:
    - [Phase 3] WhatsApp notification on status change
    
    Returns:
        Updated request
    """
    request = await request_service.update_request(db, reference, data)
    
    # TODO [Phase 3]: Trigger WhatsApp notification on status change
    # await whatsapp_service.notify_status_change(request)
    
    return request
