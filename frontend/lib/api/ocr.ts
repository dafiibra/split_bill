import axios from "axios";
import type { OcrResult } from "@/lib/types/splitbill";

const OCR_BASE_URL =
  process.env.NEXT_PUBLIC_OCR_URL || "http://localhost:8000";

const ocrApi = axios.create({
  baseURL: OCR_BASE_URL,
  timeout: 60000, // OCR can be slow on first load
});

/**
 * Upload receipt image to OCR service.
 * Returns structured items + detected totals.
 * OCR service does NOT perform any calculations.
 */
export async function extractReceipt(file: File): Promise<OcrResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await ocrApi.post<OcrResult>("/api/ocr/extract", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}
