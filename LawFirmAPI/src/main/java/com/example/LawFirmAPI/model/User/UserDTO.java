package com.example.LawFirmAPI.model.User;

public record UserDTO(
        String name,
        String email,
        String phone,
        String role,
        String username,
        String password
){
}
