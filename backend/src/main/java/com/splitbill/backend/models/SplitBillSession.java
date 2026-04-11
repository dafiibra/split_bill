package com.splitbill.backend.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "split_bill_sessions")
public class SplitBillSession {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String restaurantName;

    private int grandTotal;

    private int totalTax;

    private int totalService;

    private int totalDiscount;

    private List<SplitEntry> splits;

    @CreatedDate
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SplitEntry {
        private String personName;
        private int subtotal;
        private int tax;
        private int service;
        private int discount;
        private int total;
        private List<ItemEntry> items;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemEntry {
        private String name;
        private int price;
    }
}
