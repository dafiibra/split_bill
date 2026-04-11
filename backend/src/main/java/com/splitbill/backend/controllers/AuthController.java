package com.splitbill.backend.controllers;

import com.splitbill.backend.dto.AuthRequest;
import com.splitbill.backend.dto.AuthResponse;
import com.splitbill.backend.dto.GoogleAuthRequest;
import com.splitbill.backend.dto.RegisterRequest;
import com.splitbill.backend.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(
            @RequestBody AuthRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(
            @RequestBody GoogleAuthRequest request
    ) {
        return ResponseEntity.ok(service.googleAuth(request));
    }
}
