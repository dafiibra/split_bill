package com.splitbill.backend.services;

import com.splitbill.backend.dto.PersonAssignment;
import com.splitbill.backend.dto.PersonSplit;
import com.splitbill.backend.dto.SplitBillRequest;
import com.splitbill.backend.dto.SplitBillResponse;
import com.splitbill.backend.exception.SplitBillException;
import com.splitbill.backend.models.SplitBillSession;
import com.splitbill.backend.repositories.SplitBillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SplitBillService {

    private final SplitBillRepository splitBillRepository;

    /**
     * Core split bill calculation using proportional distribution.
     *
     * Priority Logic:
     * 1. If detectedTax exists → use directly
     * 2. Else if taxRate exists → tax = subtotal * taxRate
     * 3. Else → tax = 0
     * Same applies for service charge.
     *
     * Rounding Rule:
     * - Round to integer (rupiah)
     * - If sum(personTotal) != grandTotal → adjust largest subtotal person
     */
    public SplitBillResponse calculateSplit(SplitBillRequest request) {
        List<PersonAssignment> people = request.getPeople();

        if (people == null || people.isEmpty()) {
            throw new SplitBillException("At least one person is required");
        }

        // Validate all people have names
        for (PersonAssignment person : people) {
            if (person.getName() == null || person.getName().isBlank()) {
                throw new SplitBillException("All participants must have a name");
            }
        }

        // Step 1: Calculate grand subtotal (sum of ALL items across all people)
        int grandSubtotal = 0;
        for (PersonAssignment person : people) {
            if (person.getItems() != null) {
                for (PersonAssignment.ItemEntry item : person.getItems()) {
                    if (item.getPrice() < 0) {
                        throw new SplitBillException("Item price cannot be negative: " + item.getName());
                    }
                    grandSubtotal += item.getPrice();
                }
            }
        }

        if (grandSubtotal <= 0) {
            throw new SplitBillException("Grand subtotal must be greater than 0. Assign at least one item.");
        }

        // Step 2: Determine total tax (priority: detected > rate > 0)
        int totalTax = resolveTaxOrService(
                request.getDetectedTax(),
                request.getTaxRate(),
                grandSubtotal
        );

        // Step 3: Determine total service (priority: detected > rate > 0)
        int totalService = resolveTaxOrService(
                request.getDetectedService(),
                request.getServiceRate(),
                grandSubtotal
        );

        // Step 4: Determine total discount
        int totalDiscount = request.getDetectedDiscount() != null
                ? request.getDetectedDiscount() : 0;

        // Step 5: Calculate grand total
        int grandTotal = grandSubtotal + totalTax + totalService - totalDiscount;

        if (grandTotal < 0) {
            throw new SplitBillException("Grand total cannot be negative. Check discount amount.");
        }

        // Step 6: Proportional split per person
        List<PersonSplit> splits = new ArrayList<>();
        int sumOfPersonTotals = 0;
        int largestSubtotalIdx = 0;
        int largestSubtotal = 0;

        for (int i = 0; i < people.size(); i++) {
            PersonAssignment person = people.get(i);

            // Calculate person's subtotal
            int personSubtotal = 0;
            if (person.getItems() != null) {
                for (PersonAssignment.ItemEntry item : person.getItems()) {
                    personSubtotal += item.getPrice();
                }
            }

            // Track the person with the largest subtotal (for rounding adjustment)
            if (personSubtotal > largestSubtotal) {
                largestSubtotal = personSubtotal;
                largestSubtotalIdx = i;
            }

            // Calculate ratio: personSubtotal / grandSubtotal
            double ratio = (double) personSubtotal / grandSubtotal;

            // Proportional tax, service, discount
            int personTax = (int) Math.round(totalTax * ratio);
            int personService = (int) Math.round(totalService * ratio);
            int personDiscount = (int) Math.round(totalDiscount * ratio);

            // Person total
            int personTotal = personSubtotal + personTax + personService - personDiscount;
            sumOfPersonTotals += personTotal;

            splits.add(PersonSplit.builder()
                    .name(person.getName())
                    .subtotal(personSubtotal)
                    .tax(personTax)
                    .service(personService)
                    .discount(personDiscount)
                    .total(personTotal)
                    .items(person.getItems())
                    .build());
        }

        // Step 7: Rounding adjustment — ensure sum(personTotal) == grandTotal
        int diff = grandTotal - sumOfPersonTotals;
        if (diff != 0 && !splits.isEmpty()) {
            PersonSplit adjustPerson = splits.get(largestSubtotalIdx);
            adjustPerson.setTotal(adjustPerson.getTotal() + diff);
            log.debug("Rounding adjustment of {} applied to '{}'", diff, adjustPerson.getName());
        }

        return SplitBillResponse.builder()
                .grandSubtotal(grandSubtotal)
                .totalTax(totalTax)
                .totalService(totalService)
                .totalDiscount(totalDiscount)
                .grandTotal(grandTotal)
                .splits(splits)
                .build();
    }

    /**
     * Save split bill session to history (requires authenticated user).
     */
    public SplitBillSession saveSession(String userId, String restaurantName, SplitBillResponse response) {
        List<SplitBillSession.SplitEntry> entries = response.getSplits().stream()
                .map(split -> SplitBillSession.SplitEntry.builder()
                        .personName(split.getName())
                        .subtotal(split.getSubtotal())
                        .tax(split.getTax())
                        .service(split.getService())
                        .discount(split.getDiscount())
                        .total(split.getTotal())
                        .items(split.getItems() != null
                                ? split.getItems().stream()
                                    .map(item -> SplitBillSession.ItemEntry.builder()
                                            .name(item.getName())
                                            .price(item.getPrice())
                                            .build())
                                    .collect(Collectors.toList())
                                : List.of())
                        .build())
                .collect(Collectors.toList());

        SplitBillSession session = SplitBillSession.builder()
                .userId(userId)
                .restaurantName(restaurantName)
                .grandTotal(response.getGrandTotal())
                .totalTax(response.getTotalTax())
                .totalService(response.getTotalService())
                .totalDiscount(response.getTotalDiscount())
                .splits(entries)
                .build();

        return splitBillRepository.save(session);
    }

    /**
     * Get user's split bill history.
     */
    public List<SplitBillSession> getUserHistory(String userId) {
        return splitBillRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Priority resolution for tax/service:
     * 1. detectedValue (from OCR) takes priority
     * 2. rate * subtotal as fallback
     * 3. 0 if neither exists
     */
    private int resolveTaxOrService(Integer detectedValue, Double rate, int subtotal) {
        if (detectedValue != null && detectedValue >= 0) {
            return detectedValue;
        }
        if (rate != null && rate > 0) {
            return (int) Math.round(subtotal * rate);
        }
        return 0;
    }
}
