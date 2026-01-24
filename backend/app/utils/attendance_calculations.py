"""
UAE Labor Law-Aligned Attendance Calculations

Implements overtime, offset days, and food allowance calculations per user requirements:
- 1 normal working day = 9 hours including 1 hour lunch (8 hours actual work)
- 8 hours of extra work = 1 offset day earned
- Food allowance: 50 AED per meal
  - Normal working day: 2+ extra hours = 1 meal
  - Off days: up to 8 hours = 1 meal, 8+ hours = 2 meals

Federal Decree-Law No. 33/2021 Compliance:
- Article 17: Maximum 8 regular working hours per day
- Article 19: Overtime compensation at 125% (regular) or 150% (night/holiday)
- Article 21: One rest day minimum per week
"""

from datetime import datetime, time
from decimal import Decimal
from typing import Dict, Tuple

# UAE Labor Law Constants
STANDARD_WORK_HOURS = Decimal("8.0")  # 8 hours actual work per day
STANDARD_DAY_WITH_LUNCH = Decimal("9.0")  # 9 hours including 1 hour lunch
LUNCH_DURATION_HOURS = Decimal("1.0")  # 1 hour lunch break

# Offset day accrual: 8 extra hours = 1 offset day
OFFSET_HOURS_PER_DAY = Decimal("8.0")

# Food allowance constants
FOOD_ALLOWANCE_PER_MEAL = Decimal("50.0")  # 50 AED per meal
FOOD_ALLOWANCE_MIN_HOURS_NORMAL_DAY = Decimal("2.0")  # 2+ extra hours on normal day = 1 meal
FOOD_ALLOWANCE_FIRST_MEAL_HOURS_OFF_DAY = Decimal("8.0")  # Up to 8 hours on off day = 1 meal
# 8+ hours on off day = 2 meals

# Overtime rates per UAE Article 19
OVERTIME_RATE_REGULAR = Decimal("1.25")  # 125% for regular overtime
OVERTIME_RATE_NIGHT = Decimal("1.50")  # 150% for night hours (9 PM - 4 AM)
OVERTIME_RATE_HOLIDAY = Decimal("1.50")  # 150% for holidays/rest days

# Night overtime hours (9 PM - 4 AM)
NIGHT_START_HOUR = 21  # 9 PM
NIGHT_END_HOUR = 4  # 4 AM


def calculate_actual_work_hours(
    clock_in: datetime,
    clock_out: datetime,
    lunch_duration_minutes: int = 60
) -> Decimal:
    """
    Calculate actual work hours excluding lunch break.
    
    Args:
        clock_in: Clock in time
        clock_out: Clock out time
        lunch_duration_minutes: Lunch break duration in minutes (default 60)
    
    Returns:
        Actual work hours as Decimal
    
    Example:
        Clock in: 8:00 AM
        Clock out: 5:00 PM
        Total time: 9 hours
        Lunch: 1 hour
        Actual work: 8 hours
    """
    if not clock_in or not clock_out:
        return Decimal("0.0")
    
    # Calculate total time
    total_seconds = (clock_out - clock_in).total_seconds()
    total_hours = Decimal(str(total_seconds / 3600))
    
    # Subtract lunch break
    lunch_hours = Decimal(str(lunch_duration_minutes / 60))
    actual_work_hours = total_hours - lunch_hours
    
    # Ensure non-negative
    if actual_work_hours < Decimal("0"):
        actual_work_hours = Decimal("0")
    
    return actual_work_hours.quantize(Decimal("0.01"))


def calculate_overtime_and_offset(
    actual_work_hours: Decimal,
    is_normal_working_day: bool = True,
    is_managerial: bool = False,
    work_schedule: str = "5 days"
) -> Dict[str, Decimal]:
    """
    Calculate overtime hours and offset day accrual.
    
    User Requirements:
    - 1 normal working day = 9 hours including lunch (8 hours actual work)
    - Extra hours beyond 8 = overtime
    - 8 hours of extra work = 1 offset day
    - Managerial positions: no overtime tracking
    
    Args:
        actual_work_hours: Actual work hours (excluding lunch)
        is_normal_working_day: True for regular working days, False for off days
        is_managerial: True if employee is in managerial position
        work_schedule: "5 days" or "6 days" per week
    
    Returns:
        Dictionary with:
        - overtime_hours: Hours beyond standard 8
        - offset_days_earned: Offset days earned (8 hours = 1 day)
        - is_eligible_for_offset: True if overtime should be tracked
    
    UAE Labor Law:
    - Article 17: Maximum 8 hours regular work per day
    - Article 19: Maximum 2 hours overtime per day
    """
    result = {
        "overtime_hours": Decimal("0.0"),
        "offset_days_earned": Decimal("0.0"),
        "is_eligible_for_offset": not is_managerial,  # Managerial = no overtime
        "exceeds_legal_limit": False
    }
    
    # Managerial positions: no overtime tracking per user requirements
    if is_managerial:
        return result
    
    # Calculate overtime (hours beyond standard 8)
    if actual_work_hours > STANDARD_WORK_HOURS:
        overtime_hours = actual_work_hours - STANDARD_WORK_HOURS
        result["overtime_hours"] = overtime_hours.quantize(Decimal("0.01"))
        
        # Calculate offset days earned: 8 hours = 1 day
        offset_days = overtime_hours / OFFSET_HOURS_PER_DAY
        result["offset_days_earned"] = offset_days.quantize(Decimal("0.01"))
        
        # Check if exceeds UAE legal limit (2 hours max per day)
        if overtime_hours > Decimal("2.0"):
            result["exceeds_legal_limit"] = True
    
    return result


def calculate_food_allowance(
    actual_work_hours: Decimal,
    is_normal_working_day: bool = True,
    is_off_day: bool = False
) -> Dict[str, any]:
    """
    Calculate food allowance based on extra hours worked.
    
    User Requirements:
    - 1 meal = 50 AED
    - Normal working day: 2+ extra hours = 1 meal
    - Off days: up to 8 hours = 1 meal, 8+ hours = 2 meals
    
    Args:
        actual_work_hours: Actual work hours (excluding lunch)
        is_normal_working_day: True for regular working days
        is_off_day: True for rest days/weekends
    
    Returns:
        Dictionary with:
        - meals_count: Number of meals (0, 1, or 2)
        - food_allowance_amount: Total food allowance in AED
        - is_eligible: True if eligible for food allowance
        - reason: Explanation of calculation
    """
    result = {
        "meals_count": 0,
        "food_allowance_amount": Decimal("0.0"),
        "is_eligible": False,
        "reason": ""
    }
    
    if is_normal_working_day and not is_off_day:
        # Normal working day: 2+ extra hours beyond 8 = 1 meal
        if actual_work_hours > STANDARD_WORK_HOURS:
            extra_hours = actual_work_hours - STANDARD_WORK_HOURS
            
            if extra_hours >= FOOD_ALLOWANCE_MIN_HOURS_NORMAL_DAY:
                result["meals_count"] = 1
                result["food_allowance_amount"] = FOOD_ALLOWANCE_PER_MEAL
                result["is_eligible"] = True
                result["reason"] = f"Worked {extra_hours:.2f} extra hours on normal working day (2+ hours = 1 meal)"
    
    elif is_off_day:
        # Off day: up to 8 hours = 1 meal, 8+ hours = 2 meals
        if actual_work_hours > Decimal("0"):
            if actual_work_hours >= FOOD_ALLOWANCE_FIRST_MEAL_HOURS_OFF_DAY:
                # 8+ hours = 2 meals
                result["meals_count"] = 2
                result["food_allowance_amount"] = FOOD_ALLOWANCE_PER_MEAL * Decimal("2")
                result["is_eligible"] = True
                result["reason"] = f"Worked {actual_work_hours:.2f} hours on off day (8+ hours = 2 meals)"
            else:
                # Less than 8 hours = 1 meal
                result["meals_count"] = 1
                result["food_allowance_amount"] = FOOD_ALLOWANCE_PER_MEAL
                result["is_eligible"] = True
                result["reason"] = f"Worked {actual_work_hours:.2f} hours on off day (up to 8 hours = 1 meal)"
    
    return result


def calculate_overtime_pay(
    overtime_hours: Decimal,
    hourly_rate: Decimal,
    is_night_overtime: bool = False,
    is_holiday_overtime: bool = False
) -> Dict[str, Decimal]:
    """
    Calculate overtime pay based on UAE Labor Law Article 19.
    
    Args:
        overtime_hours: Overtime hours worked
        hourly_rate: Employee's hourly rate
        is_night_overtime: True if work between 9 PM - 4 AM
        is_holiday_overtime: True if work on public holiday or rest day
    
    Returns:
        Dictionary with:
        - overtime_rate: Multiplier (1.25 or 1.50)
        - overtime_amount: Total overtime pay in AED
    
    UAE Labor Law Article 19:
    - Regular overtime: 125% of hourly rate
    - Night overtime (9 PM - 4 AM): 150% of hourly rate
    - Holiday/rest day overtime: 150% of hourly rate
    """
    # Determine overtime rate
    if is_night_overtime or is_holiday_overtime:
        rate = OVERTIME_RATE_NIGHT  # 150%
    else:
        rate = OVERTIME_RATE_REGULAR  # 125%
    
    # Calculate overtime pay
    overtime_amount = overtime_hours * hourly_rate * rate
    
    return {
        "overtime_rate": rate,
        "overtime_amount": overtime_amount.quantize(Decimal("0.01"))
    }


def is_night_hours(clock_in: datetime, clock_out: datetime) -> bool:
    """
    Check if work hours include night hours (9 PM - 4 AM).
    
    Args:
        clock_in: Clock in time
        clock_out: Clock out time
    
    Returns:
        True if any work hours fall between 9 PM and 4 AM
    """
    if not clock_in or not clock_out:
        return False
    
    # Check if any time falls in night range (21:00 - 04:00)
    current = clock_in
    while current < clock_out:
        hour = current.hour
        if hour >= NIGHT_START_HOUR or hour < NIGHT_END_HOUR:
            return True
        current = current.replace(hour=(hour + 1) % 24)
    
    return False


def calculate_complete_attendance(
    clock_in: datetime,
    clock_out: datetime,
    is_normal_working_day: bool = True,
    is_off_day: bool = False,
    is_holiday: bool = False,
    is_managerial: bool = False,
    hourly_rate: Decimal = Decimal("0.0"),
    work_schedule: str = "5 days",
    lunch_duration_minutes: int = 60
) -> Dict[str, any]:
    """
    Complete attendance calculation combining all rules.
    
    This is the main function to use for calculating attendance records.
    It combines overtime, offset days, and food allowance calculations.
    
    Args:
        clock_in: Clock in time
        clock_out: Clock out time
        is_normal_working_day: True for regular working days
        is_off_day: True for rest days/weekends
        is_holiday: True for public holidays
        is_managerial: True if employee is in managerial position
        hourly_rate: Employee's hourly rate (for overtime pay calculation)
        work_schedule: "5 days" or "6 days" per week
        lunch_duration_minutes: Lunch break duration in minutes
    
    Returns:
        Complete dictionary with all calculations:
        - actual_work_hours: Hours worked excluding lunch
        - overtime_hours: Hours beyond standard 8
        - offset_days_earned: Offset days accrued
        - food_allowance_meals: Number of meals
        - food_allowance_amount: Food allowance in AED
        - overtime_pay: Overtime pay in AED (if applicable)
        - overtime_rate: Overtime multiplier
        - is_night_overtime: True if night hours
        - exceeds_legal_limit: True if exceeds 2 hours overtime
        - educational_message: Friendly explanation
    """
    # Step 1: Calculate actual work hours
    actual_work_hours = calculate_actual_work_hours(
        clock_in, clock_out, lunch_duration_minutes
    )
    
    # Step 2: Calculate overtime and offset days
    overtime_result = calculate_overtime_and_offset(
        actual_work_hours,
        is_normal_working_day,
        is_managerial,
        work_schedule
    )
    
    # Step 3: Calculate food allowance
    food_result = calculate_food_allowance(
        actual_work_hours,
        is_normal_working_day,
        is_off_day
    )
    
    # Step 4: Check if night overtime
    is_night = is_night_hours(clock_in, clock_out)
    
    # Step 5: Calculate overtime pay (if applicable)
    overtime_pay_result = {"overtime_rate": Decimal("0.0"), "overtime_amount": Decimal("0.0")}
    if overtime_result["overtime_hours"] > Decimal("0") and hourly_rate > Decimal("0"):
        overtime_pay_result = calculate_overtime_pay(
            overtime_result["overtime_hours"],
            hourly_rate,
            is_night,
            is_holiday or is_off_day
        )
    
    # Step 6: Generate educational message
    educational_message = _generate_educational_message(
        actual_work_hours,
        overtime_result,
        food_result,
        is_managerial,
        is_off_day,
        is_holiday
    )
    
    # Combine all results
    return {
        "actual_work_hours": actual_work_hours,
        "overtime_hours": overtime_result["overtime_hours"],
        "offset_days_earned": overtime_result["offset_days_earned"],
        "food_allowance_meals": food_result["meals_count"],
        "food_allowance_amount": food_result["food_allowance_amount"],
        "overtime_pay_amount": overtime_pay_result["overtime_amount"],
        "overtime_rate": overtime_pay_result["overtime_rate"],
        "is_night_overtime": is_night,
        "is_holiday_overtime": is_holiday or is_off_day,
        "exceeds_legal_limit": overtime_result["exceeds_legal_limit"],
        "is_eligible_for_offset": overtime_result["is_eligible_for_offset"],
        "food_allowance_reason": food_result["reason"],
        "educational_message": educational_message
    }


def _generate_educational_message(
    actual_work_hours: Decimal,
    overtime_result: Dict,
    food_result: Dict,
    is_managerial: bool,
    is_off_day: bool,
    is_holiday: bool
) -> str:
    """Generate friendly, educational message about attendance calculation."""
    messages = []
    
    # Work hours message
    messages.append(f"✅ You worked {actual_work_hours:.2f} hours today (excluding lunch break).")
    
    # Overtime message
    if is_managerial:
        messages.append("ℹ️ As a managerial employee, overtime hours are not tracked per company policy.")
    elif overtime_result["overtime_hours"] > Decimal("0"):
        ot_hours = overtime_result["overtime_hours"]
        offset_days = overtime_result["offset_days_earned"]
        
        messages.append(f"⏱️ Extra hours worked: {ot_hours:.2f} hours beyond standard 8 hours.")
        messages.append(f"📊 Offset days earned: {offset_days:.2f} days (8 extra hours = 1 offset day).")
        
        if overtime_result["exceeds_legal_limit"]:
            messages.append("⚠️ Note: This exceeds the UAE legal limit of 2 hours overtime per day (Article 19). Please discuss with your manager.")
    
    # Food allowance message
    if food_result["is_eligible"]:
        meals = food_result["meals_count"]
        amount = food_result["food_allowance_amount"]
        messages.append(f"🍽️ Food allowance: {meals} meal(s) = {amount:.2f} AED. {food_result['reason']}")
    
    # Special day messages
    if is_holiday:
        messages.append("🎉 Working on a public holiday earns 150% overtime rate (Article 19).")
    elif is_off_day:
        messages.append("📅 Working on your rest day earns 150% overtime rate and food allowance (Article 21).")
    
    return " ".join(messages)
