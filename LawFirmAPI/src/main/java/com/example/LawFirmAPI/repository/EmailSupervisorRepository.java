package com.example.LawFirmAPI.repository;

import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmailSupervisorRepository extends JpaRepository<EmailSupervised,Long> {
    Optional<EmailSupervised> getByType(String type);
    List<EmailSupervised> getByEmail(Email email);
    Optional<EmailSupervised> findByEmailAndType(Email email, String type);
}
