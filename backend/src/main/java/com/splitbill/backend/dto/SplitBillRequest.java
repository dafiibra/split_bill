package com.splitbill.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SplitBillRequest {

    private List<PersonAssignment> people;

    /**
     * Tax rate as decimal (e.g., 0.10 for 10%).
     * Used as fallback when detectedTax is null.
     */
    private Double taxRate;

    /**
     * Service rate as decimal (e.g., 0.05 for 5%).
     * Used as fallback when detectedService is null.
     */
    private Double serviceRate;

    /**
     * Raw detected tax from OCR. Takes priority over taxRate.
     */
    private Integer detectedTax;

    /**
     * Raw detected service from OCR. Takes priority over serviceRate.
     */
    private Integer detectedService;

    /**
     * Discount amount (if any).
     */
    private Integer detectedDiscount;
}
