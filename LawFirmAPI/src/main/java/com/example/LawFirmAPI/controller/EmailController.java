package com.example.LawFirmAPI.controller;
import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailDTO;
import com.example.LawFirmAPI.service.Email.EmailService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService){
        this.emailService = emailService;
    }

    @PostMapping("/email")
    public Email registerClientEmail(@RequestBody EmailDTO request){
        return emailService.newClientEmail(request);
    }

    @PutMapping("/email")
    public Email changeClientEmail(@RequestBody EmailDTO request){
        return emailService.changeClientEmail(request);
    }

    @GetMapping("/email/username/{username}")
    public Email getClientEmail(@PathVariable String username){
        return emailService.getEmailByClientUsername(username);
    }
    @GetMapping("/email/id/{id}")
    public Email getClientEmail(@PathVariable Long id){
        return emailService.getEmailByClientId(id);
    }


}
