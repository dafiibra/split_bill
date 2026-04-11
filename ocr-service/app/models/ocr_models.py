from typing import Optional
from pydantic import BaseModel, Field


class ReceiptItem(BaseModel):
    """Single item on a receipt."""
    name: str = Field(..., description="Item name", min_length=1)
    price: int = Field(..., description="Price in IDR (integer)", ge=0)


class OcrResponse(BaseModel):
    """
    Structured OCR extraction result.
    NOTE: All values are raw extractions — no calculations performed.
    """
    items: list[ReceiptItem] = Field(
        default_factory=list, description="List of detected items"
    )
    detectedSubtotal: Optional[int] = Field(
        None, description="Detected subtotal from receipt"
    )
    detectedTax: Optional[int] = Field(
        None, description="Detected tax amount (PPN/PB1)"
    )
    detectedService: Optional[int] = Field(
        None, description="Detected service charge"
    )
    detectedTotal: Optional[int] = Field(
        None, description="Detected total amount"
    )
    detectedDiscount: Optional[int] = Field(
        None, description="Detected discount/voucher amount"
    )
