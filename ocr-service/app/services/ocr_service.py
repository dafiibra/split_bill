import base64
import io
import json
import logging
import re

import anthropic
from PIL import Image

from app.config import settings
from app.models.ocr_models import OcrResponse, ReceiptItem

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a receipt OCR assistant that extracts structured data from receipt images.

Rules:
- All prices must be integers in Indonesian Rupiah (IDR) — no decimals, no currency symbols
- Only include actual ordered items (food, drinks, products) — skip store name, address, dates, order numbers, QR codes, payment info, cashier info
- For quantity items like "2x Nasi Goreng 30.000", list as individual entries: [{"name": "Nasi Goreng", "price": 30000}, {"name": "Nasi Goreng", "price": 30000}]
- detectedTax: total tax amount (PPN / pajak / tax) — null if not on receipt
- detectedService: service charge amount (biaya layanan / service charge) — null if not on receipt
- detectedDiscount: discount/promo/voucher amount as positive integer — null if not on receipt
- detectedSubtotal: subtotal before tax/service — null if not found
- detectedTotal: grand total / total tagihan / jumlah yang harus dibayar — null if not found
- Respond with ONLY valid JSON — no markdown, no explanation, no code blocks"""

EXTRACT_PROMPT = """Extract all items and totals from this receipt. Return ONLY this JSON structure:
{
  "items": [{"name": "item name", "price": 15000}],
  "detectedSubtotal": null,
  "detectedTax": null,
  "detectedService": null,
  "detectedTotal": null,
  "detectedDiscount": null
}"""


class OcrService:
    """OCR service powered by Claude Vision — accurate, no local model loading."""

    def __init__(self):
        self._client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    def process_receipt(self, image_bytes: bytes, content_type: str = "image/jpeg") -> OcrResponse:
        """
        Full OCR pipeline:
        1. Resize/compress image for efficient API call
        2. Send to Claude Vision for extraction
        3. Parse structured JSON response
        """
        resized_bytes, media_type = self._prepare_image(image_bytes, content_type)
        image_b64 = base64.standard_b64encode(resized_bytes).decode("utf-8")

        logger.info(f"Sending image to Claude Vision ({len(resized_bytes):,} bytes, {media_type})")

        message = self._client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": image_b64,
                            },
                        },
                        {"type": "text", "text": EXTRACT_PROMPT},
                    ],
                }
            ],
        )

        response_text = message.content[0].text.strip()
        logger.info(f"Claude response preview: {response_text[:300]}")

        # Strip markdown code fences if Claude includes them despite instructions
        response_text = re.sub(r"^```(?:json)?\s*\n?", "", response_text)
        response_text = re.sub(r"\n?\s*```$", "", response_text).strip()

        data = json.loads(response_text)

        items = [
            ReceiptItem(name=str(item["name"]).strip(), price=int(item["price"]))
            for item in data.get("items", [])
            if item.get("name") and int(item.get("price", 0)) > 0
        ]

        logger.info(f"Extracted {len(items)} items from receipt")

        return OcrResponse(
            items=items,
            detectedSubtotal=data.get("detectedSubtotal"),
            detectedTax=data.get("detectedTax"),
            detectedService=data.get("detectedService"),
            detectedTotal=data.get("detectedTotal"),
            detectedDiscount=data.get("detectedDiscount"),
        )

    def _prepare_image(self, image_bytes: bytes, content_type: str) -> tuple[bytes, str]:
        """
        Resize image to max 1920px (preserving aspect ratio) and convert to JPEG.
        This reduces API payload size while keeping enough quality for accurate OCR.
        """
        try:
            img = Image.open(io.BytesIO(image_bytes))

            # Flatten transparency (RGBA/P → RGB)
            if img.mode in ("RGBA", "P", "LA"):
                img = img.convert("RGB")
            elif img.mode != "RGB":
                img = img.convert("RGB")

            w, h = img.size
            max_dim = 1920
            if w > max_dim or h > max_dim:
                ratio = min(max_dim / w, max_dim / h)
                new_w, new_h = int(w * ratio), int(h * ratio)
                img = img.resize((new_w, new_h), Image.LANCZOS)
                logger.info(f"Resized image: {w}x{h} → {new_w}x{new_h}")

            out = io.BytesIO()
            img.save(out, format="JPEG", quality=92, optimize=True)
            return out.getvalue(), "image/jpeg"

        except Exception as e:
            logger.warning(f"Image preparation failed ({e}), using original bytes")
            # Normalize content_type (browsers sometimes send "image/jpg")
            safe_type = "image/jpeg" if content_type in ("image/jpg", "image/jpeg") else content_type
            return image_bytes, safe_type
