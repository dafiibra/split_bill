package com.splitbill.backend.exceptions;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super("Email sudah terdaftar: " + email);
    }
}
