package com.splitbill.backend.controllers;

import com.splitbill.backend.dto.SplitBillRequest;
import com.splitbill.backend.dto.SplitBillResponse;
import com.splitbill.backend.exception.ApiResponse;
import com.splitbill.backend.models.SplitBillSession;
import com.splitbill.backend.models.User;
import com.splitbill.backend.services.SplitBillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/split-bill")
@RequiredArgsConstructor
public class SplitBillController {

    private final SplitBillService splitBillService;

    /**
     * Calculate split bill based on person assignments.
     * This endpoint is the source of truth for all financial calculations.
     * Accessible without authentication (public).
     */
    @PostMapping("/calculate")
    public ResponseEntity<ApiResponse<SplitBillResponse>> calculateSplit(
            @RequestBody SplitBillRequest request
    ) {
        SplitBillResponse result = splitBillService.calculateSplit(request);
        return ResponseEntity.ok(
                ApiResponse.ok("Split bill calculated successfully", result)
        );
    }

    /**
     * Save split bill session to history.
     * Requires authentication.
     */
    @PostMapping("/save")
    public ResponseEntity<ApiResponse<SplitBillSession>> saveSession(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false, defaultValue = "Unknown Restaurant") String restaurantName,
            @RequestBody SplitBillRequest request
    ) {
        SplitBillResponse result = splitBillService.calculateSplit(request);
        SplitBillSession session = splitBillService.saveSession(
                user.getId(), restaurantName, result
        );
        return ResponseEntity.ok(
                ApiResponse.ok("Split bill saved successfully", session)
        );
    }

    /**
     * Get authenticated user's split bill history.
     */
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<SplitBillSession>>> getHistory(
            @AuthenticationPrincipal User user
    ) {
        List<SplitBillSession> history = splitBillService.getUserHistory(user.getId());
        return ResponseEntity.ok(
                ApiResponse.ok("History retrieved successfully", history)
        );
    }
}
