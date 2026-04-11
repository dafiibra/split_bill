import re
import logging
from typing import Optional

from app.models.ocr_models import ReceiptItem, OcrResponse
from app.utils.number_utils import parse_rupiah

logger = logging.getLogger(__name__)

# ═══════════════════════════════════════════════════════════════
# CONFIDENCE & PRICE THRESHOLDS
# ═══════════════════════════════════════════════════════════════

# Lines with OCR confidence below this are likely garbage
MIN_CONFIDENCE = 0.35

# Receipt items in Indonesia rarely cost less than Rp 1.000
MIN_ITEM_PRICE = 1000

# ═══════════════════════════════════════════════════════════════
# KEYWORD PATTERNS (flexible to handle OCR typos)
# ═══════════════════════════════════════════════════════════════

TAX_KEYWORDS = re.compile(
    r"\b(tax|pajak|ppn|pb1|vat)\b", re.IGNORECASE
)
SERVICE_KEYWORDS = re.compile(
    r"\b(service|svc|servis|pelayanan)\b", re.IGNORECASE
)
# "Subtota]" "Subtotal" "Sub Total" etc.
SUBTOTAL_KEYWORDS = re.compile(
    r"\b(subtota[l\]i!1]?|sub\s*tota[l\]i!1]?|sub[\-\s]total)\b", re.IGNORECASE
)
# "Total" "Tota]" "Tota1" etc. — but NOT "Subtotal"
TOTAL_KEYWORDS = re.compile(
    r"(?<!\bsub)(?<!\bsub )\b(tota[l\]i!1]?|grand\s*tota[l\]i!1]?|amount\s*due|jumlah)\b", re.IGNORECASE
)
DISCOUNT_KEYWORDS = re.compile(
    r"\b(discount|diskon|voucher|promo|potongan)\b", re.IGNORECASE
)

# "Harga Pesanan" pattern (ShopeeFood/GrabFood style)
ORDER_TOTAL_KEYWORDS = re.compile(
    r"(harga\s*pesanan|order\s*total|total\s*pesanan|total\s*harga|total\s*order)", re.IGNORECASE
)

# ═══════════════════════════════════════════════════════════════
# SKIP PATTERNS
# ═══════════════════════════════════════════════════════════════

SKIP_STORE_INFO = re.compile(
    r"(terima\s*kasih|thank\s*you|invoice|receipt|nota|struk|"
    r"npwp|ruko|rukan|jl\.|jalan|blok\b|kota\b|kelurahan|kecamatan|"
    r"kabupaten|provinsi|dki\b|jakarta|surabaya|bandung|medan|"
    r"semarang|yogyakarta|bali|denpasar|makassar|palembang|"
    r"riverview|plaza|mall\b|tower|gedung|lantai|"
    r"tanjung|gedong|"
    r"www\.|\.com|\.id|http)",
    re.IGNORECASE,
)

SKIP_METADATA = re.compile(
    r"(tanggal|date\b|waktu\s*pesan|time\b|jam\b|"
    r"kasir|cashier|server\b|waiter|waitress|"
    r"table\b|meja|tamu|guest\b|pax\b|"
    r"order\s*(id|no)|receipt\s*(no|number)|"
    r"queue\s*no|antrian|nomor\s*(antrian|pesanan)|"
    r"collected\s*by|delivered\s*by|"
    r"customer|pelanggan|pembeli|"
    r"nama\s*[:\-]|"
    r"member|loyalty|point\b)",
    re.IGNORECASE,
)

SKIP_CONTACT = re.compile(
    r"(wa\b|telp|phone|fax\b|call\b|sms\b|"
    r"alamat|address|"
    r"instagram|facebook|twitter|tiktok|"
    r"follow\s*us|scan\s*me)",
    re.IGNORECASE,
)

SKIP_PAYMENT = re.compile(
    r"(gofood|grabfood|shopeefood|"
    r"cash\b|debit\b|credit\b|qris|ovo\b|gopay|dana\b|shopeepay|"
    r"tunai|kembalian|change\b|paid\b|bayar|dibayar|pembayaran|"
    r"metode\s*pem|metode\s*bayar|"
    r"online\s*telah|"
    r"notes?\b|catatan\b|"
    r"korean\s*food|motherly|love\b|"
    r"selamat\s*makan|enjoy)",
    re.IGNORECASE,
)

SKIP_NOTES = re.compile(
    r"(\*\s*catatan|catatan\s*:|sambal\s*di|sambal\s*pisah|kol\s*gore|"
    r"extra\s*|pedas|tidak\s*pedas|less\s*spicy|no\s*ice|"
    r"tanpa\s*|tanpa$|tanpa\b)",
    re.IGNORECASE,
)

PHONE_PATTERN = re.compile(r"0\d{2,4}[\-\s]?\d{3,4}[\-\s]?\d{3,6}")
DATE_PATTERN = re.compile(r"\d{1,2}[\s/\-\.]\d{1,2}[\s/\-\.]\d{2,4}")
TIME_PATTERN = re.compile(r"^\d{1,2}:\d{2}(:\d{2})?$")

PRICE_PATTERN = re.compile(r"[\d]+[.,\s]?[\d]*[.,]?[\d]+")
MODIFIER_PATTERN = re.compile(r"^[\+\-]")
QTY_PATTERN = re.compile(r"^\d+\s*[xX]\s*")
UNIT_PRICE_PATTERN = re.compile(r"@\s*[\d.,]+")

# Pattern for lines that are just a hashtag + number like "#954"
HASH_NUMBER = re.compile(r"^#\s*\d+$")

# Pattern to detect garbage OCR text (too many special chars relative to letters)
GARBAGE_PATTERN = re.compile(r"[^a-zA-Z0-9\s]")


class ReceiptParser:
    """
    Parses raw OCR text lines into structured receipt data.

    Key features:
    - Confidence threshold to reject garbage OCR lines
    - Multi-line item detection (name and price on separate lines)
    - Flexible keyword matching to handle OCR typos
    - Smart filtering for Indonesian receipt formats
    """

    def parse(self, text_lines: list[tuple[str, float]]) -> OcrResponse:
        items: list[ReceiptItem] = []
        detected_subtotal: Optional[int] = None
        detected_tax: Optional[int] = None
        detected_service: Optional[int] = None
        detected_total: Optional[int] = None
        detected_discount: Optional[int] = None

        # ── PHASE 1: Filter low confidence + classify every line ──
        classified: list[dict] = []
        for text, confidence in text_lines:
            text = text.strip()
            if not text or len(text) < 2:
                continue

            # Skip low confidence OCR lines (likely garbage)
            if confidence < MIN_CONFIDENCE:
                logger.debug(f"SKIP (low conf {confidence:.2f}): '{text}'")
                continue

            # Skip garbage text (too many special chars)
            if self._is_garbage(text):
                logger.debug(f"SKIP (garbage): '{text}'")
                continue

            info = self._classify_line(text)
            info["confidence"] = confidence
            classified.append(info)

        logger.debug(f"Classified {len(classified)} lines (after confidence filter)")

        # ── PHASE 2: Process with lookahead for multi-line items ──
        i = 0
        pending_item_name: Optional[str] = None

        while i < len(classified):
            line = classified[i]
            line_type = line["type"]
            text = line["text"]
            price = line["price"]

            if line_type == "skip":
                pending_item_name = None
                i += 1
                continue

            if line_type == "subtotal":
                if price is None or price < MIN_ITEM_PRICE:
                    price = self._find_price_ahead(classified, i)
                if price is not None:
                    detected_subtotal = price
                    logger.debug(f"SUBTOTAL: {price}")
                pending_item_name = None
                i += 1
                continue

            if line_type in ("total", "order_total"):
                if price is None or price < MIN_ITEM_PRICE:
                    price = self._find_price_ahead(classified, i)
                if price is not None:
                    if detected_total is None:
                        detected_total = price
                    logger.debug(f"TOTAL: {price}")
                pending_item_name = None
                i += 1
                continue

            if line_type == "tax":
                if price is None:
                    price = self._find_price_ahead(classified, i)
                if price is not None:
                    detected_tax = price
                    logger.debug(f"TAX: {price}")
                pending_item_name = None
                i += 1
                continue

            if line_type == "service":
                if price is None:
                    price = self._find_price_ahead(classified, i)
                if price is not None:
                    detected_service = price
                    logger.debug(f"SERVICE: {price}")
                pending_item_name = None
                i += 1
                continue

            if line_type == "discount":
                if price is None:
                    price = self._find_price_ahead(classified, i)
                if price is not None:
                    detected_discount = price
                    logger.debug(f"DISCOUNT: {price}")
                pending_item_name = None
                i += 1
                continue

            if line_type == "modifier":
                logger.debug(f"SKIP modifier: '{text}'")
                i += 1
                continue

            if line_type == "item_with_price":
                name = self._extract_item_name(text)
                if name and len(name) >= 2 and price and price >= MIN_ITEM_PRICE:
                    items.append(ReceiptItem(name=name, price=price))
                    logger.debug(f"ITEM: '{name}' = {price}")
                pending_item_name = None
                i += 1
                continue

            if line_type == "text_only":
                candidate_name = self._clean_name(text)
                if candidate_name and len(candidate_name) >= 2:
                    price_ahead = self._find_price_ahead(classified, i)
                    if price_ahead is not None and price_ahead >= MIN_ITEM_PRICE:
                        if pending_item_name:
                            full_name = pending_item_name + " " + candidate_name
                        else:
                            full_name = candidate_name
                        items.append(ReceiptItem(name=full_name, price=price_ahead))
                        logger.debug(f"ITEM (multi-line): '{full_name}' = {price_ahead}")
                        pending_item_name = None
                        i = self._skip_to_after_price(classified, i)
                        continue
                    else:
                        if pending_item_name:
                            pending_item_name = pending_item_name + " " + candidate_name
                        else:
                            pending_item_name = candidate_name
                i += 1
                continue

            if line_type == "price_only":
                if pending_item_name and price and price >= MIN_ITEM_PRICE:
                    items.append(ReceiptItem(name=pending_item_name, price=price))
                    logger.debug(f"ITEM (pending+price): '{pending_item_name}' = {price}")
                    pending_item_name = None
                else:
                    logger.debug(f"SKIP orphan price: {price} from '{text}'")
                i += 1
                continue

            i += 1

        return OcrResponse(
            items=items,
            detectedSubtotal=detected_subtotal,
            detectedTax=detected_tax,
            detectedService=detected_service,
            detectedTotal=detected_total,
            detectedDiscount=detected_discount,
        )

    def _is_garbage(self, text: str) -> bool:
        """Check if text is likely OCR garbage."""
        letters = sum(1 for c in text if c.isalpha())
        specials = len(GARBAGE_PATTERN.findall(text))
        total = len(text.replace(" ", ""))

        if total == 0:
            return True

        # If more than 40% special chars → garbage
        if total > 3 and specials / total > 0.4:
            return True

        # Very short with no letters
        if total <= 3 and letters == 0:
            return True

        return False

    def _classify_line(self, text: str) -> dict:
        """Classify a single OCR line."""
        result = {"text": text, "type": "unknown", "price": None}

        # ── Hard skip checks ──
        if self._should_skip(text):
            result["type"] = "skip"
            return result

        # Modifier lines (+Less Spicy, +Bulgogi)
        if MODIFIER_PATTERN.match(text):
            result["type"] = "modifier"
            return result

        # Quantity-only lines ("Ix", "2x", "1x")
        if re.match(r"^\d*[IiLl1]?[xX]$", text.strip()):
            result["type"] = "skip"
            logger.debug(f"SKIP (qty only): '{text}'")
            return result

        # Unit price lines ("@158.000", "@0")
        if re.match(r"^@\s*[\d.,]+$", text.strip()):
            result["type"] = "skip"
            logger.debug(f"SKIP (unit price): '{text}'")
            return result

        # Hash number lines ("#954")
        if HASH_NUMBER.match(text.strip()):
            result["type"] = "skip"
            logger.debug(f"SKIP (hash number): '{text}'")
            return result

        # Extract price
        price = self._extract_price(text)
        result["price"] = price

        # ── Keyword classification ──
        if ORDER_TOTAL_KEYWORDS.search(text):
            result["type"] = "order_total"
            return result

        if SUBTOTAL_KEYWORDS.search(text):
            result["type"] = "subtotal"
            return result

        if TOTAL_KEYWORDS.search(text):
            result["type"] = "total"
            return result

        if TAX_KEYWORDS.search(text):
            result["type"] = "tax"
            return result

        if SERVICE_KEYWORDS.search(text):
            result["type"] = "service"
            return result

        if DISCOUNT_KEYWORDS.search(text):
            result["type"] = "discount"
            return result

        # ── Content type ──
        has_letters = bool(re.search(r"[a-zA-Z]", text))
        letter_count = len(re.sub(r"[^a-zA-Z]", "", text))
        has_meaningful_text = has_letters and letter_count >= 2

        if price is not None and has_meaningful_text:
            result["type"] = "item_with_price"
        elif price is not None and not has_meaningful_text:
            result["type"] = "price_only"
        elif has_meaningful_text:
            result["type"] = "text_only"
        else:
            result["type"] = "skip"
            logger.debug(f"SKIP (no useful content): '{text}'")

        return result

    def _find_price_ahead(self, classified: list[dict], current_idx: int) -> Optional[int]:
        """Look ahead up to 4 lines to find a price."""
        for j in range(current_idx + 1, min(current_idx + 5, len(classified))):
            line = classified[j]
            if line["type"] in ("skip", "modifier"):
                continue

            price = line["price"]
            if price is not None and price >= MIN_ITEM_PRICE:
                return price

            if line["type"] in ("subtotal", "total", "order_total",
                                "tax", "service", "discount"):
                break

        return None

    def _skip_to_after_price(self, classified: list[dict], current_idx: int) -> int:
        """Skip past price line(s) after consuming them via lookahead."""
        j = current_idx + 1
        while j < len(classified):
            line = classified[j]
            if line["type"] in ("skip", "modifier"):
                j += 1
                continue
            if line["type"] == "price_only":
                return j + 1
            break
        return j

    def _should_skip(self, text: str) -> bool:
        """Check if a line should be skipped."""

        if re.match(r"^[\-=_\.\*\#\~\s]{3,}$", text):
            return True

        if SKIP_STORE_INFO.search(text):
            return True
        if SKIP_METADATA.search(text):
            return True
        if SKIP_CONTACT.search(text):
            return True
        if SKIP_PAYMENT.search(text):
            return True
        if SKIP_NOTES.search(text):
            return True
        if PHONE_PATTERN.search(text):
            return True

        if DATE_PATTERN.search(text) and len(text.strip()) < 20:
            return True

        if TIME_PATTERN.match(text.strip()):
            return True

        clean = text.strip()
        if len(clean) <= 8 and re.match(r"^[\d\s]+$", clean):
            return True

        # Alphanumeric codes (5+ chars, all uppercase + digits)
        if re.match(r"^[A-Z0-9]{5,}$", clean):
            return True

        # Long number strings (order IDs like "3039784185542144013")
        digits_only = re.sub(r"\D", "", clean)
        if len(digits_only) > 10:
            return True

        return False

    def _extract_price(self, text: str) -> Optional[int]:
        """Extract price from text."""
        cleaned = re.sub(r"\bRp\.?\s*", "", text, flags=re.IGNORECASE)

        matches = PRICE_PATTERN.findall(cleaned)
        if not matches:
            return None

        raw_price = matches[-1]
        return parse_rupiah(raw_price)

    def _extract_item_name(self, text: str) -> str:
        """Extract item name from a line that has both name and price."""
        result = UNIT_PRICE_PATTERN.sub("", text)
        result = re.sub(r"\bRp\.?\s*", "", result, flags=re.IGNORECASE)

        matches = list(PRICE_PATTERN.finditer(result))
        if matches:
            last_match = matches[-1]
            result = result[: last_match.start()].strip()

        result = QTY_PATTERN.sub("", result).strip()
        return self._clean_name(result)

    def _clean_name(self, name: str) -> str:
        """Clean item name."""
        name = re.sub(r"^[\W_]+|[\W_]+$", "", name)
        name = re.sub(r"\bRp\.?\s*", "", name, flags=re.IGNORECASE)
        name = QTY_PATTERN.sub("", name).strip()
        name = re.sub(r"\s+", " ", name).strip()
        return name