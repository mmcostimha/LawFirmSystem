package com.example.LawFirmAPI.service.Email;

import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailDTO;
import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.repository.EmailRepository;
import com.example.LawFirmAPI.repository.UserRepository;
//import com.example.LawFirmAPI.service.VaultPasswordService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmailService {

    //private final VaultPasswordService vaultPasswordService;
    private final UserRepository userRepository;
    private final EmailRepository emailRepository;


    public  EmailService(UserRepository userRepository,
                         EmailRepository emailRepository)
    {
        this.userRepository = userRepository;
        //this.vaultPasswordService=  vaultPasswordService;
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
        //vaultPasswordService.storeEmailPassword(newEmail.client_id(),newEmail.password());
        return  emailRepository.save(email);
    }

    public Email changeClientEmail(EmailDTO newEmail){
        //vaultPasswordService.storeEmailPassword(newEmail.client_id(),newEmail.password());
        Email email = emailRepository.findByUser_Id(newEmail.client_id());
        email.setEmail(newEmail.email());
        email.setPassword(newEmail.password());
        email.setValid(true);

        return emailRepository.save(email);
    }
    public Email getEmailByClientUsername(String username){
        User user = userRepository.findByUsername(username);
        Email email = emailRepository.findByUser_Id(user.getId());
        //System.out.println("EMAIL ENCONTRADO: " + email.getEmail());
        return email;
    }

    public Email getEmailByClientId(Long clientId){
        return emailRepository.findByUser_Id(clientId);
    }
    public Email getEmailByClientEmail(String email){
        return emailRepository.findByEmail(email);
    }
    public boolean emailExist(Email email){
        return emailRepository.existsById(email.getId());
    }
    public boolean emailIsValid(Email email){
        return email.getValid();
    }

    public ResponseEntity<Email> turnOffAlarmByUsername(String username){

        Email email = getEmailByClientUsername(username);
        email.setAlarm(false);
        return ResponseEntity.ok(emailRepository.save(email));
    }
    public ResponseEntity<Email> setValidEmailByUsername(String username, boolean bool) {
        Email email = getEmailByClientUsername(username);

        email.setValid(bool);

        //System.out.println("PEDI PARA APAGAR");
        return ResponseEntity.ok(emailRepository.save(email));
    }



}
