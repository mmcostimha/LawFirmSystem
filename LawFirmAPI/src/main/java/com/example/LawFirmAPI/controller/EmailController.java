package com.example.LawFirmAPI.controller;
import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailDTO;
import com.example.LawFirmAPI.service.Email.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService){
        this.emailService = emailService;
    }

    //Create Email for a client
    @PostMapping("/email")
    public Email registerClientEmail(@RequestBody EmailDTO request){
        return emailService.newClientEmail(request);
    }

    //Change email of a Client
    @PutMapping("/email")
    public Email changeClientEmail(@RequestBody EmailDTO request){
        return emailService.changeClientEmail(request);
    }

    // Get Email By the Client Username
    @GetMapping("/email/username/{username}")
    public Email getClientEmail(@PathVariable String username){
        return emailService.getEmailByClientUsername(username);
    }
    // Get Email By the Client Id
    @GetMapping("/email/id/{id}")
    public Email getClientEmail(@PathVariable Long id){
        return emailService.getEmailByClientId(id);
    }

//    //Delete Client Email
//    @DeleteMapping("")
//    public ResponseEntity<Email> deleteClientEmail(@PathVariable String username){
//        return emailService.deleteEmailByUsername(username);
//    }

    //Turn off the Client Email Alarm
    @PutMapping("/email/alarm/{username}")
    public ResponseEntity<Email> turnOffAlarm(@PathVariable String username){
        return emailService.turnOffAlarmByUsername(username);
    }



}
