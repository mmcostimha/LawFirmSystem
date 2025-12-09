package com.example.LawFirmAPI.controller;
import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailDTO;
import com.example.LawFirmAPI.service.Email.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService){
        this.emailService = emailService;
    }

    //Create Email for a client
    @PostMapping("/email")
    public Email registerClientEmail(@RequestBody EmailDTO request){
        System.out.println("Email recebido: "+ request.email() + " com id de client "+ request.client_id());
        try {
            Email emailReceived = emailService.getEmailByClientId(request.client_id());
            return emailService.changeClientEmail(request);
        } catch (Exception e){
            return emailService.newClientEmail(request);
        }
    }

    //Change email of a Client
    @PutMapping("/email")
    public Email changeClientEmail(@RequestBody EmailDTO request){
        return emailService.changeClientEmail(request);
    }

    // Get Email By the Client Username
    @GetMapping("/email/username/{username}")
    public Email getClientEmail(@PathVariable String username){
        Email emailAsked = emailService.getEmailByClientUsername(username);
        if (emailService.emailIsValid(emailAsked))
            return emailAsked;
        return null;
    }
    // Get Email By the Client Id
    @GetMapping("/email/id/{id}")
    public Email getClientEmail(@PathVariable Long id){
        Email emailAsked = emailService.getEmailByClientId(id);
        if (emailService.emailIsValid(emailAsked))
            return emailAsked;
        return null;
    }

    //Delete Client Corporate Email
    @DeleteMapping("/email/{username}")
    public ResponseEntity<Email> deleteClientEmail(@PathVariable String username){
        return emailService.setValidEmailByUsername(username, false);
    }

    //Turn off the Client Email Alarm
    @PutMapping("/email/alarm/{username}")
    public ResponseEntity<Email> turnOffAlarm(@PathVariable String username){
        return emailService.turnOffAlarmByUsername(username);
    }



}
