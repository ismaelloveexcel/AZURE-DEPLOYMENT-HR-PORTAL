"""Request service for CRUD operations on requests"""

from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.request import Request
from app.schemas.request import RequestCreate, RequestUpdate, RequestResponse, RequestPublicResponse
from app.services.reference_generator import ReferenceGenerator


class RequestService:
    """Service layer for request operations.
    
    Handles business logic for request tracking system:
    - Creating requests with auto-generated reference numbers
    - Public tracking (no auth required)
    - HR queue management
    - Status updates with audit trail
    """
    
    async def create_request(
        self,
        db: AsyncSession,
        data: RequestCreate,
        employee_id: str,
        created_by: str
    ) -> RequestResponse:
        """Create new request with auto-generated reference number.
        
        Args:
            db: Database session
            data: Request creation data
            employee_id: Employee submitting the request
            created_by: User creating the request (usually same as employee_id)
            
        Returns:
            Created request with reference number
            
        Example:
            >>> request = await service.create_request(
            ...     db, RequestCreate(request_type="leave"), "EMP001", "EMP001"
            ... )
            >>> print(request.reference)  # REF-2026-047
        """
        # Generate unique reference number
        reference = await ReferenceGenerator.generate(db)
        
        # Create request
        request = Request(
            reference=reference,
            employee_id=employee_id,
            request_type=data.request_type,
            metadata=data.metadata,
            created_by=created_by,
            status="submitted",  # Always starts as submitted
            submitted_at=datetime.utcnow(),
            estimated_completion_days=3  # Default 3 business days
        )
        
        db.add(request)
        await db.commit()  # Commit first
        await db.refresh(request)  # Then refresh
        
        return RequestResponse.model_validate(request)
    
    async def get_by_reference(
        self,
        db: AsyncSession,
        reference: str
    ) -> Optional[Request]:
        """Get request by reference number.
        
        Args:
            db: Database session
            reference: Reference number (e.g., "REF-2026-001")
            
        Returns:
            Request object or None if not found
        """
        result = await db.execute(
            select(Request).where(Request.reference == reference.upper())
        )
        return result.scalar_one_or_none()
    
    async def get_public_view(
        self,
        db: AsyncSession,
        reference: str
    ) -> RequestPublicResponse:
        """Get public view of request (sanitized for tracking).
        
        This endpoint is PUBLIC (no authentication required).
        Returns only safe data: status, dates, public notes.
        Does NOT return: hr_notes, employee_id, metadata.
        
        Args:
            db: Database session
            reference: Reference number
            
        Returns:
            Public view of request
            
        Raises:
            HTTPException: 404 if request not found
        """
        request = await self.get_by_reference(db, reference)
        
        if not request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Request {reference} not found"
            )
        
        # Calculate estimated completion date
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
        db: AsyncSession,
        limit: int = 100
    ) -> List[RequestResponse]:
        """List all pending requests for HR queue.
        
        Returns requests with status: submitted, reviewing
        Ordered by submission date (oldest first = FIFO).
        
        Args:
            db: Database session
            limit: Maximum number of requests to return
            
        Returns:
            List of pending requests
        """
        result = await db.execute(
            select(Request)
            .where(Request.status.in_(["submitted", "reviewing"]))
            .order_by(Request.submitted_at.asc())
            .limit(limit)
        )
        requests = result.scalars().all()
        return [RequestResponse.model_validate(r) for r in requests]
    
    async def update_request(
        self,
        db: AsyncSession,
        reference: str,
        data: RequestUpdate
    ) -> RequestResponse:
        """Update request status and notes (HR only).
        
        Args:
            db: Database session
            reference: Reference number
            data: Update data (status, notes, completion date)
            
        Returns:
            Updated request
            
        Raises:
            HTTPException: 404 if request not found
        """
        request = await self.get_by_reference(db, reference)
        
        if not request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Request {reference} not found"
            )
        
        # Update fields if provided
        if data.status is not None:
            request.status = data.status
            
            # Auto-set completed_at if status is completed
            if data.status == "completed" and not request.completed_at:
                request.completed_at = datetime.utcnow()
        
        if data.hr_notes is not None:
            request.hr_notes = data.hr_notes
        
        if data.public_notes is not None:
            request.public_notes = data.public_notes
        
        if data.completed_at is not None:
            request.completed_at = data.completed_at
        
        # Update timestamp
        request.updated_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(request)
        
        return RequestResponse.model_validate(request)


# Singleton instance
request_service = RequestService()
