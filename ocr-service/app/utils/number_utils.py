import re
from typing import Optional


def parse_rupiah(raw: str) -> Optional[int]:
    """
    Parse Indonesian Rupiah number format to integer.

    Handles:
    - 75000 → 75000
    - 75.000 → 75000
    - 75,000 → 75000
    - 1.250.000 → 1250000
    - 12,500.00 → 12500 (rounds)
    """
    if not raw:
        return None

    # Remove all non-digit and non-separator chars
    cleaned = re.sub(r"[^\d.,]", "", raw)

    if not cleaned:
        return None

    # Determine separator meaning:
    # If last separator has 3 digits after it → thousands separator
    # If last separator has 2 digits after it → decimal separator
    if "." in cleaned and "," in cleaned:
        # Mixed: assume last one is decimal
        if cleaned.rfind(".") > cleaned.rfind(","):
            # Format: 1,250,000.00 → comma is thousands
            cleaned = cleaned.replace(",", "")
            value = float(cleaned)
        else:
            # Format: 1.250.000,00 → dot is thousands
            cleaned = cleaned.replace(".", "").replace(",", ".")
            value = float(cleaned)
    elif "." in cleaned:
        last_dot = cleaned.rfind(".")
        after_dot = cleaned[last_dot + 1:]
        if len(after_dot) == 3:
            # 75.000 → thousands separator
            cleaned = cleaned.replace(".", "")
            value = float(cleaned)
        else:
            # 75.00 → decimal
            value = float(cleaned)
    elif "," in cleaned:
        last_comma = cleaned.rfind(",")
        after_comma = cleaned[last_comma + 1:]
        if len(after_comma) == 3:
            # 75,000 → thousands separator
            cleaned = cleaned.replace(",", "")
            value = float(cleaned)
        else:
            # 75,50 → decimal
            cleaned = cleaned.replace(",", ".")
            value = float(cleaned)
    else:
        value = float(cleaned)

    return round(value)
