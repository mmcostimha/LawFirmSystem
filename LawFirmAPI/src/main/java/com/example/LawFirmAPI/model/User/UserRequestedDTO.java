package com.example.LawFirmAPI.model.User;

public record UserRequestedDTO(
        String name,
        String email,
        String phone,
        String role
) {
}
