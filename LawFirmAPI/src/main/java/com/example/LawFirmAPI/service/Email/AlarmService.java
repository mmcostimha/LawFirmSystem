package com.example.LawFirmAPI.service.Email;

import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import com.example.LawFirmAPI.repository.EmailRepository;
import com.example.LawFirmAPI.repository.EmailSupervisorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AlarmService {

    private final EmailRepository emailRepository;
    private final EmailSupervisorRepository emailSupervisorRepository;

    public AlarmService(EmailRepository emailRepository, EmailSupervisorRepository emailSupervisorRepository){
        this.emailRepository = emailRepository;
        this.emailSupervisorRepository =emailSupervisorRepository;
    }

    @Transactional
    public void activateAlarm(EmailSupervised emailSupervised){
        Email email = emailSupervised.getEmail();
        emailSupervised.setActivationDate();
        email.setAlarm(true);

        emailRepository.save(email);
        emailSupervisorRepository.save(emailSupervised);

    }
}
