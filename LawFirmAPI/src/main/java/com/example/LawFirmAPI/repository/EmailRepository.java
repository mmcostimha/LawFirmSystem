package com.example.LawFirmAPI.repository;

import com.example.LawFirmAPI.model.Email.Email;
import org.apache.juli.logging.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRepository extends JpaRepository<Email, Log> {

    Email findByUser_Id(Long userId);
}
