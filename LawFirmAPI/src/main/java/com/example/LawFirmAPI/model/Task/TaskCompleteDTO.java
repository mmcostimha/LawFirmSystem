package com.example.LawFirmAPI.model.Task;

import java.time.LocalDateTime;

public record TaskCompleteDTO(
        Long id,
        Long clientId,
        String task,
        LocalDateTime creationDate,
        String taskOwner,
        Boolean state
) {
}
