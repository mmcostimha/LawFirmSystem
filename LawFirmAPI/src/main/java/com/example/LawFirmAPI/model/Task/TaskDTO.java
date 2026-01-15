package com.example.LawFirmAPI.model.Task;


import java.time.LocalDateTime;

public record TaskDTO (
        Long id,
        Long clientId,
        String task,
        LocalDateTime creationDate,
        Boolean state
){
}
