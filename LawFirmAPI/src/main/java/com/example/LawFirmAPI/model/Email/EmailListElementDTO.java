package com.example.LawFirmAPI.model.Email;

public record EmailListElementDTO(
        Long clientId,
        String clientName,
        String email
) {
}
