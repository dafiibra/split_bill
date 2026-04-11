import logging

import easyocr
import numpy as np

from app.config import settings
from app.models.ocr_models import OcrResponse
from app.services.image_preprocessor import ImagePreprocessor
from app.services.receipt_parser import ReceiptParser

logger = logging.getLogger(__name__)


class OcrService:
    """Main OCR service that coordinates preprocessing, text extraction, and parsing."""

    def __init__(self):
        self._reader: easyocr.Reader | None = None
        self._preprocessor = ImagePreprocessor()
        self._parser = ReceiptParser()

    @property
    def reader(self) -> easyocr.Reader:
        """Lazy-load EasyOCR reader (heavy initialization)."""
        if self._reader is None:
            logger.info(
                f"Initializing EasyOCR with languages: {settings.OCR_LANGUAGES}"
            )
            self._reader = easyocr.Reader(
                settings.OCR_LANGUAGES, gpu=False
            )
        return self._reader

    def process_receipt(self, image_bytes: bytes) -> OcrResponse:
        """
        Full OCR pipeline:
        1. Preprocess image
        2. Extract text with EasyOCR
        3. Parse extracted text into structured data

        NOTE: This service only EXTRACTS data. No calculations are performed.
        """
        # Step 1: Preprocess
        preprocessed = self._preprocessor.preprocess_for_easyocr(image_bytes)

        # Step 2: OCR extraction
        raw_results = self.reader.readtext(
            preprocessed,
            detail=1,
            paragraph=False,
        )

        # Convert to (text, confidence) tuples
        text_lines: list[tuple[str, float]] = []
        for bbox, text, confidence in raw_results:
            text_lines.append((text, confidence))
            logger.info(f"  OCR LINE: '{text}' (conf: {confidence:.2f})")

        logger.info(f"Extracted {len(text_lines)} text lines from receipt")

        # Step 3: Parse into structured data
        result = self._parser.parse(text_lines)

        return result