package com.example.LawFirmAPI.model.User.UserDTO;


import java.time.LocalDateTime;

public record UserAccountCreatedDTO(
    String username,
    String password,
    Long id,
    LocalDateTime creationDate
){ }
