"""Gift repository for database operations."""
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.gift import Gift, GiftTemplate


class GiftTemplateRepository:
    """Repository for gift template operations."""

    async def list_active(self, db: AsyncSession) -> List[GiftTemplate]:
        """Get all active templates ordered by display order."""
        result = await db.execute(
            select(GiftTemplate)
            .where(GiftTemplate.is_active == True)
            .order_by(GiftTemplate.display_order)
        )
        return list(result.scalars().all())

    async def get_by_id(self, db: AsyncSession, template_id: int) -> Optional[GiftTemplate]:
        """Get template by ID."""
        result = await db.execute(
            select(GiftTemplate).where(GiftTemplate.id == template_id)
        )
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, template: GiftTemplate) -> GiftTemplate:
        """Create a new gift template."""
        db.add(template)
        await db.flush()
        await db.refresh(template)
        return template


class GiftRepository:
    """Repository for gift operations."""

    async def create(self, db: AsyncSession, gift: Gift) -> Gift:
        """Create a new gift."""
        db.add(gift)
        await db.flush()
        await db.refresh(gift)
        return gift

    async def get_by_id(self, db: AsyncSession, gift_id: int) -> Optional[Gift]:
        """Get gift by ID."""
        result = await db.execute(
            select(Gift).where(Gift.id == gift_id)
        )
        return result.scalar_one_or_none()

    async def get_by_code(self, db: AsyncSession, unique_code: str) -> Optional[Gift]:
        """Get gift by unique code."""
        result = await db.execute(
            select(Gift).where(Gift.unique_code == unique_code)
        )
        return result.scalar_one_or_none()

    async def update(self, db: AsyncSession, gift: Gift) -> Gift:
        """Update a gift."""
        await db.flush()
        await db.refresh(gift)
        return gift

    async def increment_view_count(self, db: AsyncSession, gift_id: int) -> None:
        """Increment the view count for a gift."""
        gift = await self.get_by_id(db, gift_id)
        if gift:
            gift.view_count += 1
            await db.flush()

    async def list_recent(self, db: AsyncSession, limit: int = 50) -> List[Gift]:
        """Get recent gifts (for admin view)."""
        result = await db.execute(
            select(Gift)
            .order_by(Gift.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())
