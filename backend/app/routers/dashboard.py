"""
Dashboard Router - Provides summary metrics and recent activity for home dashboard
"""
from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_role
from app.database import get_session
from app.models.employee import Employee

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class DashboardMetrics(BaseModel):
    """Dashboard metrics response"""
    total_employees: int
    active_employees: int
    visas_expiring_30: int
    eids_expiring_30: int
    pending_onboarding: int
    pending_passes: int
    compliance_alerts: int


class RecentActivity(BaseModel):
    """Recent activity item"""
    id: int
    employee_name: str
    action: str
    timestamp: str
    type: str  # success, warning, info


@router.get("/metrics", response_model=DashboardMetrics)
async def get_dashboard_metrics(
    session: AsyncSession = Depends(get_session),
    current_user: dict = Depends(require_role(["admin", "hr", "manager", "viewer"]))
):
    """
    Get dashboard metrics including employee counts and compliance alerts.
    
    Returns key metrics for the home dashboard:
    - Total and active employee counts
    - Upcoming document expirations (30 days)
    - Pending onboarding count
    - Compliance alerts
    """
    now = datetime.now().date()
    thirty_days = now + timedelta(days=30)
    
    # Total employees
    total_result = await session.execute(
        select(func.count(Employee.id))
    )
    total_employees = total_result.scalar() or 0
    
    # Active employees
    active_result = await session.execute(
        select(func.count(Employee.id)).where(Employee.is_active == True)
    )
    active_employees = active_result.scalar() or 0
    
    # Visas expiring in 30 days
    visa_result = await session.execute(
        select(func.count(Employee.id)).where(
            and_(
                Employee.visa_expiry_date.isnot(None),
                Employee.visa_expiry_date <= thirty_days,
                Employee.visa_expiry_date >= now,
                Employee.is_active == True
            )
        )
    )
    visas_expiring_30 = visa_result.scalar() or 0
    
    # Emirates IDs expiring in 30 days
    eid_result = await session.execute(
        select(func.count(Employee.id)).where(
            and_(
                Employee.emirates_id_expiry.isnot(None),
                Employee.emirates_id_expiry <= thirty_days,
                Employee.emirates_id_expiry >= now,
                Employee.is_active == True
            )
        )
    )
    eids_expiring_30 = eid_result.scalar() or 0
    
    # Pending onboarding (profile_status != 'complete')
    onboarding_result = await session.execute(
        select(func.count(Employee.id)).where(
            and_(
                Employee.is_active == True,
                or_(
                    Employee.profile_status == None,
                    Employee.profile_status != 'complete'
                )
            )
        )
    )
    pending_onboarding = onboarding_result.scalar() or 0
    
    # Pending passes - TODO: Implement when Pass model is available
    # Currently hardcoded to 0 as placeholder
    # Should query Pass model where status='pending' and aggregate count
    pending_passes = 0  # Placeholder - requires Pass model implementation
    
    # Total compliance alerts (expired + expiring soon)
    visa_expired = await session.execute(
        select(func.count(Employee.id)).where(
            and_(
                Employee.visa_expiry_date.isnot(None),
                Employee.visa_expiry_date < now,
                Employee.is_active == True
            )
        )
    )
    
    eid_expired = await session.execute(
        select(func.count(Employee.id)).where(
            and_(
                Employee.emirates_id_expiry.isnot(None),
                Employee.emirates_id_expiry < now,
                Employee.is_active == True
            )
        )
    )
    
    medical_expired = await session.execute(
        select(func.count(Employee.id)).where(
            and_(
                Employee.medical_fitness_expiry.isnot(None),
                Employee.medical_fitness_expiry < now,
                Employee.is_active == True
            )
        )
    )
    
    compliance_alerts = (
        (visa_expired.scalar() or 0) + 
        (eid_expired.scalar() or 0) + 
        (medical_expired.scalar() or 0) +
        visas_expiring_30 + 
        eids_expiring_30
    )
    
    return DashboardMetrics(
        total_employees=total_employees,
        active_employees=active_employees,
        visas_expiring_30=visas_expiring_30,
        eids_expiring_30=eids_expiring_30,
        pending_onboarding=pending_onboarding,
        pending_passes=pending_passes,
        compliance_alerts=compliance_alerts
    )


@router.get("/recent-activity", response_model=List[RecentActivity])
async def get_recent_activity(
    limit: int = 10,
    session: AsyncSession = Depends(get_session),
    current_user: dict = Depends(require_role(["admin", "hr", "manager", "viewer"]))
):
    """
    Get recent activity feed for dashboard.
    
    NOTE: This is a placeholder implementation showing recent employee creations.
    TODO: Implement proper audit log system with activity tracking for:
    - Employee updates
    - Onboarding completions
    - Compliance renewals
    - Document uploads
    - Pass creations
    
    For now, returns recent employees as activity items.
    Limited to last 10 items by default.
    """
    # PLACEHOLDER: In production, this should query an audit_log or activity table
    # For now, return recent employees as activity
    
    result = await session.execute(
        select(Employee)
        .where(Employee.is_active == True)
        .order_by(Employee.created_at.desc())
        .limit(limit)
    )
    employees = result.scalars().all()
    
    activity_items = []
    for idx, emp in enumerate(employees):
        activity_items.append(RecentActivity(
            id=idx + 1,
            employee_name=emp.name,
            action="Employee record created",  # Placeholder - should reflect actual action
            timestamp=emp.created_at.isoformat() if emp.created_at else datetime.now().isoformat(),
            type="info"  # Placeholder - should reflect action type
        ))
    
    return activity_items
