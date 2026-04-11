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
public class OcrResultDto {
    private List<ItemDto> items;
    private Integer detectedSubtotal;
    private Integer detectedTax;
    private Integer detectedService;
    private Integer detectedTotal;
    private Integer detectedDiscount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemDto {
        private String name;
        private int price;
    }
}
