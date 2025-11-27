package com.example.LawFirmAPI.controller;

import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailActivatedDTO;
import com.example.LawFirmAPI.model.Email.EmailDTO;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import com.example.LawFirmAPI.repository.UserRepository;
import com.example.LawFirmAPI.service.Email.EmailService;
import com.example.LawFirmAPI.service.Email.EmailSupervisorService;
import com.example.LawFirmAPI.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class EmailSupervisorController {

    private final EmailSupervisorService emailSupervisorService;
    private final UserService userService;
    private final EmailService emailService;


    public EmailSupervisorController(EmailSupervisorService emailSupervisorService, EmailService emailService,UserService userService){
        this.emailSupervisorService=emailSupervisorService;
        this.emailService= emailService;
        this.userService = userService;

    }
    //Add a supervisor type to a CLient
    @PostMapping("/supervisor/{id}/{type}")
    public EmailSupervised addToCheckList( @PathVariable Long id,@PathVariable String type){

        Email email = emailService.getEmailByClientId(id);
        return emailSupervisorService.addToCheckList(email,type);
    }

    //Get List of Supervisors
    @GetMapping("/supervisor")
    public List<EmailActivatedDTO> getEmailSupervisedList(){

        List<EmailActivatedDTO> dtoList = new ArrayList<>();
        List<EmailSupervised> emailSupervisedList = emailSupervisorService.getEmailSupervisedList();

        for (EmailSupervised emailSpv : emailSupervisedList) {

            String clientName = userService.getByID(emailSpv.getEmail().getClient_id()).getName();

            // Supondo que EmailActivatedDTO tenha um construtor que recebe EmailSupervised
            EmailActivatedDTO dto = new EmailActivatedDTO(
                emailSpv.getEmail().getId(),
                emailSpv.getEmail().getEmail(),
                emailSpv.getType(),
                emailSpv.getEmail().getAlarm(),
                clientName,
                emailSpv.getEmail().getCreationDate(),
                emailSpv.getCreationDate()
            );

            dtoList.add(dto);
        }
        System.out.println(dtoList.toString());
        return dtoList;
    }

    //Delete a type of supervisor from Client
    @DeleteMapping("/supervisor/{id}/{type}")
    public ResponseEntity<EmailSupervised> deleteFromCheckList(@PathVariable Long id, @PathVariable String type){

        Email email = emailService.getEmailByClientId(id);

        return emailSupervisorService.deleteFromCheckList(email,type);
    }

}
