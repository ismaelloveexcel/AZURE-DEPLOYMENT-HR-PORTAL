"""
Compliance utility functions for UAE labour law requirements.
Includes alert urgency calculation and document validation.
"""
from datetime import date, timedelta
from typing import Literal


def get_alert_urgency(expiry_date: date) -> Literal['critical', 'urgent', 'warning', 'notice', 'ok']:
    """
    Calculate urgency level based on expiry date.
    
    Returns color-coded urgency level for UI display:
    - critical: Red - Expired or expires today
    - urgent: Orange - Expires in 1-7 days
    - warning: Yellow - Expires in 8-30 days
    - notice: Amber - Expires in 31-60 days
    - ok: Green - More than 60 days remaining
    
    Args:
        expiry_date: Document expiry date
        
    Returns:
        Urgency level string
    """
    if not expiry_date:
        return 'critical'
    
    days = (expiry_date - date.today()).days
    
    if days <= 0:
        return 'critical'  # Red - Expired
    elif days <= 7:
        return 'urgent'    # Orange - 7 days
    elif days <= 30:
        return 'warning'   # Yellow - 30 days
    elif days <= 60:
        return 'notice'    # Amber - 60 days
    else:
        return 'ok'        # Green - More than 60 days
