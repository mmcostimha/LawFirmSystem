package com.example.LawFirmAPI.model.User.UserDTO;

public record UserDTO(
        String name,
        String email,
        String phone,
        String role,
        String username,
        String password
){
}
