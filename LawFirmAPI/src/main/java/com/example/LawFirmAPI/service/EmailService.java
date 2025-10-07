package com.example.LawFirmAPI.service;

import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailDTO;
import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.repository.EmailRepository;
import com.example.LawFirmAPI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmailService {

    private final VaultPasswordService vaultPasswordService;
    private final UserRepository userRepository;
    private final EmailRepository emailRepository;

    public  EmailService(UserRepository userRepository,
                         VaultPasswordService vaultPasswordService,
                         EmailRepository emailRepository)
    {
        this.userRepository = userRepository;
        this.vaultPasswordService=  vaultPasswordService;
        this.emailRepository = emailRepository;
    }


//    public void setEmail(EmailDTO newEmail){
////        System.out.println("Before"+newEmail.client_id()+ " "+ newEmail.password());
//        vaultPasswordService.storeEmailPassword(newEmail.client_id(),newEmail.password());
//        System.out.println("Sended");
//
//        String passwordReceived = vaultPasswordService.getEmailPassword(newEmail.client_id());
//        System.out.println("Email sended: " + newEmail.email()+" and password: "+ passwordReceived);
//    }

    public Email newClientEmail(EmailDTO newEmail){
        //Check Client
        Optional<User> user = userRepository.findById(newEmail.client_id());
        if (user.isEmpty())
                throw  new ResourceNotFound("User "+newEmail.client_id()+" not found.");

        //Create Email row
        Email email = new Email(newEmail,user.get());
        //Save password on vault
        vaultPasswordService.storeEmailPassword(newEmail.client_id(),newEmail.password());
        return  emailRepository.save(email);
    }

    public Email changeClientEmail(EmailDTO newEmail){
        vaultPasswordService.storeEmailPassword(newEmail.client_id(),newEmail.password());
        Email email = emailRepository.findByUser_Id(newEmail.client_id());
        email.setEmail(newEmail.email());
        return email;
    }
    public String getEmailByClientUsername(String username){
        User user = userRepository.findByUsername(username);
        Email email = emailRepository.findByUser_Id(user.getId());
        return email.getEmail();
    }

    public String getEmailByClientId(Long clientId){
        Email email = emailRepository.findByUser_Id(clientId);
        return email.getEmail();
    }


}
