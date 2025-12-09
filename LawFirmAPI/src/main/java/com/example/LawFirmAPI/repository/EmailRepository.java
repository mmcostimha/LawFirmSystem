package com.example.LawFirmAPI.repository;

import com.example.LawFirmAPI.model.Email.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRepository extends JpaRepository<Email, Long> {

    Email findByUser_Id(Long userId);
    Email findByEmail(String email);
}
