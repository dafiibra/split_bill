import api from "@/lib/axios";
import type {
  SplitBillRequest,
  SplitBillResponse,
  ApiResponse,
} from "@/lib/types/splitbill";

/**
 * Send split bill calculation request to backend.
 * Backend is the source of truth for all financial calculations.
 */
export async function calculateSplitBill(
  request: SplitBillRequest
): Promise<SplitBillResponse> {
  const response = await api.post<ApiResponse<SplitBillResponse>>(
    "/api/split-bill/calculate",
    request
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Split bill calculation failed");
  }

  return response.data.data;
}

/**
 * Save split bill session to history (requires auth).
 */
export async function saveSplitBillSession(
  request: SplitBillRequest,
  restaurantName: string
): Promise<void> {
  await api.post(
    `/api/split-bill/save?restaurantName=${encodeURIComponent(restaurantName)}`,
    request
  );
}

/**
 * Get user's split bill history (requires auth).
 */
export async function getSplitBillHistory(): Promise<any[]> {
  const response = await api.get<ApiResponse<any[]>>("/api/split-bill/history");
  return response.data.data;
}
