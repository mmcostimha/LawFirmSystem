package com.example.LawFirmAPI.service.Email;

import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailDTO;
import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.repository.EmailRepository;
import com.example.LawFirmAPI.repository.UserRepository;
import com.example.LawFirmAPI.service.VaultPasswordService;
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
    public Email getEmailByClientUsername(String username){
        User user = userRepository.findByUsername(username);
        return emailRepository.findByUser_Id(user.getId());
    }

    public Email getEmailByClientId(Long clientId){
        return emailRepository.findByUser_Id(clientId);
    }



}
