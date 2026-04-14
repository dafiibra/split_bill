package com.splitbill.backend.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super("Email sudah terdaftar: " + email);
    }
}
