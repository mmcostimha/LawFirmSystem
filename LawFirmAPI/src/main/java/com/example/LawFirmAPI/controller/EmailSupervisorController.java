package com.example.LawFirmAPI.controller;

import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailDTO;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import com.example.LawFirmAPI.service.Email.EmailService;
import com.example.LawFirmAPI.service.Email.EmailSupervisorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EmailSupervisorController {

    private final EmailSupervisorService emailSupervisorService;
    private final EmailService emailService;


    public EmailSupervisorController(EmailSupervisorService emailSupervisorService, EmailService emailService){
        this.emailSupervisorService=emailSupervisorService;
        this.emailService= emailService;

    }
    //Add a supervisor type to a CLient
    @PostMapping("/supervisor/{id}/{type}")
    public EmailSupervised addToCheckList( @PathVariable Long id,@PathVariable String type){

        Email email = emailService.getEmailByClientId(id);


        return emailSupervisorService.addToCheckList(email,type);
    }

    //Get List of Supervisors
    @GetMapping("/supervisor")
    public List<EmailSupervised> getEmailSupervisedList(){
        return emailSupervisorService.getEmailSupervisedList();
    }

    //Delete a type of supervisor from Client
    @DeleteMapping("/supervisor/{id}/{type}")
    public ResponseEntity<EmailSupervised> deleteFromCheckList(@PathVariable Long id, @PathVariable String type){

        Email email = emailService.getEmailByClientId(id);

        return emailSupervisorService.deleteFromCheckList(email,type);
    }

}
