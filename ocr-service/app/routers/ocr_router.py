import logging
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.config import settings
from app.services.ocr_service import OcrService
from app.models.ocr_models import OcrResponse

logger = logging.getLogger(__name__)
router = APIRouter()

ocr_service = OcrService()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}


@router.post("/extract", response_model=OcrResponse)
async def extract_receipt(file: UploadFile = File(...)):
    """
    Extract receipt data from uploaded image.
    Returns structured items, subtotal, tax, service, and total.
    """
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. "
                   f"Allowed: {', '.join(ALLOWED_TYPES)}",
        )

    # Validate file size
    contents = await file.read()
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size: {settings.MAX_FILE_SIZE_MB}MB",
        )

    try:
        result = ocr_service.process_receipt(contents)
        return result
    except Exception as e:
        logger.error(f"OCR processing failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to process receipt image. Please try a clearer photo.",
        )
