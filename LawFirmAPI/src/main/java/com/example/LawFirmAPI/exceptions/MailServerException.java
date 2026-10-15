package com.example.LawFirmAPI.exceptions;

public class MailServerException extends RuntimeException {
    public MailServerException(String message,Throwable cause ) {
        super(message, cause);
    }
    public MailServerException(String message ) {
        super(message);
    }
}
