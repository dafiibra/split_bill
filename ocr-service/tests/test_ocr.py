import pytest
from app.utils.number_utils import parse_rupiah
from app.services.receipt_parser import ReceiptParser


class TestParseRupiah:
    def test_plain_number(self):
        assert parse_rupiah("75000") == 75000

    def test_dot_thousands(self):
        assert parse_rupiah("75.000") == 75000

    def test_comma_thousands(self):
        assert parse_rupiah("75,000") == 75000

    def test_large_number(self):
        assert parse_rupiah("1.250.000") == 1250000

    def test_with_decimal(self):
        assert parse_rupiah("75.50") == 76  # rounded

    def test_empty(self):
        assert parse_rupiah("") is None

    def test_none_input(self):
        assert parse_rupiah(None) is None

    def test_mixed_format_dot_decimal(self):
        assert parse_rupiah("1,250,000.50") == 1250001

    def test_mixed_format_comma_decimal(self):
        assert parse_rupiah("1.250.000,50") == 1250001


class TestReceiptParser:
    def setup_method(self):
        self.parser = ReceiptParser()

    def test_parse_basic_receipt(self):
        lines = [
            ("Nasi Goreng 75000", 0.9),
            ("Es Teh 15000", 0.85),
            ("Subtotal 90000", 0.9),
            ("Tax 10% 9000", 0.9),
            ("Total 99000", 0.95),
        ]
        result = self.parser.parse(lines)

        assert len(result.items) == 2
        assert result.items[0].name == "Nasi Goreng"
        assert result.items[0].price == 75000
        assert result.items[1].name == "Es Teh"
        assert result.items[1].price == 15000
        assert result.detectedSubtotal == 90000
        assert result.detectedTax == 9000
        assert result.detectedTotal == 99000

    def test_skip_irrelevant_lines(self):
        lines = [
            ("Terima Kasih", 0.9),
            ("Tanggal: 2025-01-01", 0.9),
            ("Kopi Latte 35.000", 0.85),
        ]
        result = self.parser.parse(lines)

        assert len(result.items) == 1
        assert result.items[0].name == "Kopi Latte"
        assert result.items[0].price == 35000

    def test_no_tax_service(self):
        lines = [
            ("Burger 50000", 0.9),
            ("Total 50000", 0.9),
        ]
        result = self.parser.parse(lines)

        assert result.detectedTax is None
        assert result.detectedService is None

    def test_service_charge_detected(self):
        lines = [
            ("Nasi Padang 45.000", 0.9),
            ("Service 5% 2.250", 0.85),
            ("Total 47.250", 0.9),
        ]
        result = self.parser.parse(lines)

        assert result.detectedService == 2250
        assert result.detectedTotal == 47250

    def test_discount_detected(self):
        lines = [
            ("Ayam Geprek 30.000", 0.9),
            ("Voucher -5.000", 0.85),
            ("Discount 5.000", 0.85),
            ("Total 25.000", 0.9),
        ]
        result = self.parser.parse(lines)

        assert result.detectedDiscount == 5000

    def test_quantity_prefix_removed(self):
        lines = [
            ("2x Kopi Susu 56.000", 0.9),
        ]
        result = self.parser.parse(lines)

        assert len(result.items) == 1
        assert result.items[0].name == "Kopi Susu"
        assert result.items[0].price == 56000

    def test_empty_input(self):
        result = self.parser.parse([])
        assert len(result.items) == 0
        assert result.detectedSubtotal is None
        assert result.detectedTotal is None
