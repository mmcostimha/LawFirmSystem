package com.example.LawFirmAPI.exceptions;

public class MailboxAuthenticationException extends RuntimeException {
    public MailboxAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
    public MailboxAuthenticationException(String message) {
        super(message);
    }
}
