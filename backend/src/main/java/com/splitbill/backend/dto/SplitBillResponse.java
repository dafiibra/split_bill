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
public class SplitBillResponse {
    private int grandSubtotal;
    private int totalTax;
    private int totalService;
    private int totalDiscount;
    private int grandTotal;
    private List<PersonSplit> splits;
}
