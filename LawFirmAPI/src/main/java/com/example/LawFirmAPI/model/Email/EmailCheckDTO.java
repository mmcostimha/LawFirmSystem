package com.example.LawFirmAPI.model.Email;

import java.util.Date;

public record EmailCheckDTO (
        String from,
        String subject,
        String content,
        Date receivedDate
) {}
