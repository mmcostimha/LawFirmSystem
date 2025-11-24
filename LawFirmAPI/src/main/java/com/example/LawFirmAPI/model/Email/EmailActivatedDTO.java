package com.example.LawFirmAPI.model.Email;
import java.time.LocalDateTime;


public record EmailActivatedDTO(
        Long id,
        String email,
        String type,
        Boolean state,
        String clientName,
        LocalDateTime creationData,
        LocalDateTime activationData
)
{ }
