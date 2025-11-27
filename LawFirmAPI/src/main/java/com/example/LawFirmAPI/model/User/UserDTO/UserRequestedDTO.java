package com.example.LawFirmAPI.model.User.UserDTO;

public record UserRequestedDTO(
        String name,
        String email,
        String phone,
        String role
) {
}
