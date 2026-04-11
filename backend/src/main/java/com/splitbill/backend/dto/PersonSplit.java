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
public class PersonSplit {
    private String name;
    private int subtotal;
    private int tax;
    private int service;
    private int discount;
    private int total;
    private List<PersonAssignment.ItemEntry> items;
}
