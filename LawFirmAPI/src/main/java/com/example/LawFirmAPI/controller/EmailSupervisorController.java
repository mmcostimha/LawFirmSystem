package com.example.LawFirmAPI.controller;

import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailActivatedDTO;
import com.example.LawFirmAPI.model.Email.EmailDTO;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import com.example.LawFirmAPI.repository.UserRepository;
import com.example.LawFirmAPI.service.Email.AsyncSupervisorService;
import com.example.LawFirmAPI.service.Email.EmailService;
import com.example.LawFirmAPI.service.Email.EmailSupervisorService;
import com.example.LawFirmAPI.service.UserService;
import org.springframework.boot.actuate.autoconfigure.metrics.MetricsProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class EmailSupervisorController {

    private final EmailSupervisorService emailSupervisorService;
    private final AsyncSupervisorService asyncSupervisorService;
    private final UserService userService;
    private final EmailService emailService;

    public EmailSupervisorController(EmailSupervisorService emailSupervisorService, EmailService emailService,UserService userService,AsyncSupervisorService asyncSupervisorService){
        this.emailSupervisorService=emailSupervisorService;
        this.emailService= emailService;
        this.userService = userService;
        this.asyncSupervisorService = asyncSupervisorService;

    }
    //Add a supervisor type to a CLient
    @PostMapping("/supervisor/{id}/{type}")
    public EmailActivatedDTO addToCheckList( @PathVariable Long id,@PathVariable String type){
        Email email = emailService.getEmailByClientId(id);
        EmailSupervised alarm = emailSupervisorService.addToCheckList(email,type);
        String clientName = userService.getById(alarm.getEmail().getClient_id()).getName();

        return  new EmailActivatedDTO(
                alarm.getId(),
                email.getEmail(),
                alarm.getType(),
                email.getAlarm(),
                clientName,
                alarm.getCreationDate(),
                alarm.getActivationDate()
        );
    }

    //Get List of Supervisors
    @GetMapping("/supervisor")
    public List<EmailActivatedDTO> getEmailSupervisedList(){

        List<EmailActivatedDTO> dtoList = new ArrayList<>();
        List<EmailSupervised> emailSupervisedList = emailSupervisorService.getEmailSupervisedList();

        for (EmailSupervised emailSpv : emailSupervisedList) {

            String clientName = userService.getById(emailSpv.getEmail().getClient_id()).getName();

            // Supondo que EmailActivatedDTO tenha um construtor que recebe EmailSupervised
            EmailActivatedDTO dto = new EmailActivatedDTO(
                emailSpv.getId(),
                emailSpv.getEmail().getEmail(),
                emailSpv.getType(),
                emailSpv.getEmail().getAlarm(),
                clientName,
                emailSpv.getCreationDate(),
                emailSpv.getActivationDate()
            );

            dtoList.add(dto);
        }
        //System.out.println(dtoList.toString());
        return dtoList;
    }

    @DeleteMapping("/supervisor/{supervisedEmailId}")
    public ResponseEntity<EmailSupervised> deleteFromCheckList(@PathVariable Long supervisedEmailId){
        // Agora você pode usar o objeto 'alarm'superviedEmailId
        //System.out.println("Id do Alarm: "+supervisedEmailId );
        return emailSupervisorService.deleteEmailSupervisedById(supervisedEmailId);
    }
    //Get List of Supervisors
    @GetMapping("/supervisor/actioned")
    public List<EmailActivatedDTO> getActionedEmailSupervisedList(){
        List<EmailActivatedDTO> dtoList = new ArrayList<>();
        List<EmailSupervised> emailSupervisedList = emailSupervisorService.getEmailSupervisedList();

        for (EmailSupervised emailSpv : emailSupervisedList) {
            String clientName = userService.getById(emailSpv.getEmail().getClient_id()).getName();
//            System.out.println("Data de acinamento: "+emailSpv.getActivationDate());
            if (emailSpv.getEmail().getAlarm()){
                // Supondo que EmailActivatedDTO tenha um construtor que recebe EmailSupervised
                EmailActivatedDTO dto = new EmailActivatedDTO(
                        emailSpv.getId(),
                        emailSpv.getEmail().getEmail(),
                        emailSpv.getType(),
                        emailSpv.getEmail().getAlarm(),
                        clientName,
                        emailSpv.getCreationDate(),
                        emailSpv.getActivationDate()
                );

                dtoList.add(dto);
            }
        }
        //System.out.println(dtoList.toString());
        return dtoList;
    }

    @PostMapping("/supervisor/teste")
    public  ResponseEntity<?> emailValidator(@RequestBody EmailDTO email){

        return asyncSupervisorService.fetchSubjectsEmailValidation(email);
    }

    @PostMapping("/supervisor/check")
    public  ResponseEntity<?> checkEmails() throws Exception {
        return emailSupervisorService.forcedCheckEmails();
    }
;}
