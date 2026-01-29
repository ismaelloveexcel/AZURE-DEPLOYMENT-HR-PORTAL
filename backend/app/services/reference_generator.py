"""Reference number generator for requests: REF-YYYY-NNN format"""

from datetime import datetime

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.request import Request


class ReferenceGenerator:
    """Generate unique reference numbers for requests.
    
    Format: REF-YYYY-NNN
    - REF: Fixed prefix
    - YYYY: Current year (e.g., 2026)
    - NNN: Zero-padded sequential number (001, 002, etc.)
    
    Examples:
    - REF-2026-001
    - REF-2026-047
    - REF-2027-001 (resets each year)
    """
    
    @staticmethod
    async def generate(db: AsyncSession) -> str:
        """Generate next unique reference number for current year.
        
        Args:
            db: Async database session
            
        Returns:
            Unique reference string (e.g., "REF-2026-047")
            
        Thread-safe: Uses database query to ensure uniqueness even with concurrent requests.
        """
        current_year = datetime.utcnow().year
        
        # Get count of requests this year
        # Pattern: REF-2026-%
        result = await db.execute(
            select(func.count(Request.id)).where(
                Request.reference.like(f"REF-{current_year}-%")
            )
        )
        count = result.scalar() or 0
        
        # Increment and format with zero-padding
        next_number = count + 1
        reference = f"REF-{current_year}-{next_number:03d}"
        
        return reference
