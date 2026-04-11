/* ─── OCR Types ─── */
export interface OcrItem {
  name: string;
  price: number;
}

export interface OcrResult {
  items: OcrItem[];
  detectedSubtotal: number | null;
  detectedTax: number | null;
  detectedService: number | null;
  detectedTotal: number | null;
  detectedDiscount: number | null;
}

/* ─── Split Bill Types ─── */
export interface ItemEntry {
  id: string;
  name: string;
  price: number;
}

export interface Participant {
  id: string;
  name: string;
}

export interface PersonAssignmentPayload {
  name: string;
  items: { name: string; price: number }[];
}

export interface SplitBillRequest {
  people: PersonAssignmentPayload[];
  taxRate: number | null;
  serviceRate: number | null;
  detectedTax: number | null;
  detectedService: number | null;
  detectedDiscount: number | null;
}

export interface PersonSplit {
  name: string;
  subtotal: number;
  tax: number;
  service: number;
  discount: number;
  total: number;
  items: { name: string; price: number }[];
}

export interface SplitBillResponse {
  grandSubtotal: number;
  totalTax: number;
  totalService: number;
  totalDiscount: number;
  grandTotal: number;
  splits: PersonSplit[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
