package com.example.LawFirmAPI.exceptions;

public class UnsupportedMailProviderException extends RuntimeException {
    public UnsupportedMailProviderException(String message) {
        super(message);
    }
}
