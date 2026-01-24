"""
OCR pattern extraction utilities for UAE documents.
Regular expressions for extracting Emirates ID, passport, visa numbers from scanned documents.
"""
import re
from typing import Optional


# UAE Emirates ID format: 784-YYYY-NNNNNNN-C
# 784 = UAE country code, YYYY = year, NNNNNNN = sequence, C = check digit
EMIRATES_ID_PATTERN = r'784-\d{4}-\d{7}-\d{1}'

# Passport format: 2 letters + 7 digits (varies by country)
PASSPORT_PATTERN = r'[A-Z]{2}\d{7}'

# UAE Visa Number: Variable format, typically alphanumeric
VISA_NUMBER_PATTERN = r'[0-9]{3}/[0-9]{4}/[0-9]{7}'

# IBAN format (UAE): AE + 2 check digits + 19 digits
UAE_IBAN_PATTERN = r'AE\d{21}'


def extract_emirates_id(text: str) -> Optional[str]:
    """
    Extract Emirates ID number from OCR text.
    
    Args:
        text: OCR-extracted text from document
        
    Returns:
        Emirates ID in format 784-YYYY-NNNNNNN-C or None if not found
        
    Example:
        >>> extract_emirates_id("Emirates ID: 784-2015-1234567-8")
        '784-2015-1234567-8'
    """
    if not text:
        return None
        
    match = re.search(EMIRATES_ID_PATTERN, text)
    return match.group(0) if match else None


def extract_passport_number(text: str) -> Optional[str]:
    """
    Extract passport number from OCR text.
    
    Args:
        text: OCR-extracted text from document
        
    Returns:
        Passport number in format AA1234567 or None if not found
        
    Example:
        >>> extract_passport_number("Passport No: AB1234567")
        'AB1234567'
    """
    if not text:
        return None
        
    match = re.search(PASSPORT_PATTERN, text)
    return match.group(0) if match else None


def extract_visa_number(text: str) -> Optional[str]:
    """
    Extract UAE visa number from OCR text.
    
    Args:
        text: OCR-extracted text from document
        
    Returns:
        Visa number or None if not found
        
    Example:
        >>> extract_visa_number("Visa: 201/2024/1234567")
        '201/2024/1234567'
    """
    if not text:
        return None
        
    match = re.search(VISA_NUMBER_PATTERN, text)
    return match.group(0) if match else None


def extract_iban(text: str) -> Optional[str]:
    """
    Extract UAE IBAN from OCR text.
    
    Args:
        text: OCR-extracted text from document
        
    Returns:
        IBAN in format AE + 21 digits or None if not found
        
    Example:
        >>> extract_iban("IBAN: AE070331234567890123456")
        'AE070331234567890123456'
    """
    if not text:
        return None
        
    match = re.search(UAE_IBAN_PATTERN, text)
    return match.group(0) if match else None


def extract_all_document_numbers(text: str) -> dict:
    """
    Extract all document numbers from OCR text.
    
    Args:
        text: OCR-extracted text from document
        
    Returns:
        Dictionary with extracted numbers:
        {
            'emirates_id': str or None,
            'passport': str or None,
            'visa': str or None,
            'iban': str or None
        }
    """
    return {
        'emirates_id': extract_emirates_id(text),
        'passport': extract_passport_number(text),
        'visa': extract_visa_number(text),
        'iban': extract_iban(text)
    }


def validate_emirates_id_format(eid: str) -> bool:
    """
    Validate Emirates ID format.
    
    Args:
        eid: Emirates ID string
        
    Returns:
        True if format is valid
    """
    if not eid:
        return False
    return bool(re.fullmatch(EMIRATES_ID_PATTERN, eid))


def validate_iban_format(iban: str) -> bool:
    """
    Validate UAE IBAN format.
    
    Args:
        iban: IBAN string
        
    Returns:
        True if format is valid
    """
    if not iban:
        return False
    return bool(re.fullmatch(UAE_IBAN_PATTERN, iban))
