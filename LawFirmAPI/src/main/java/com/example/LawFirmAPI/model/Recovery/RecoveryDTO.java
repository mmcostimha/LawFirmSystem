package com.example.LawFirmAPI.model.Recovery;

import java.time.LocalDateTime;

public record RecoveryDTO(
        Long codeId,
        LocalDateTime createdDate,
        String code
) {
}
