package com.splitbill.backend.exception;

public class SplitBillException extends RuntimeException {

    public SplitBillException(String message) {
        super(message);
    }

    public SplitBillException(String message, Throwable cause) {
        super(message, cause);
    }
}
