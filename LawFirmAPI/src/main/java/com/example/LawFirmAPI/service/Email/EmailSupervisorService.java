package com.example.LawFirmAPI.service.Email;

import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import com.example.LawFirmAPI.repository.EmailSupervisorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailSupervisorService {

    private final EmailSupervisorRepository emailSupervisorRepository;
    private final AsyncSupervisorService asyncSupervisorService;

    public EmailSupervisorService(EmailSupervisorRepository emailSupervisorRepository,
                                  AsyncSupervisorService asyncSupervisorService){
        this.emailSupervisorRepository = emailSupervisorRepository;
        this.asyncSupervisorService=asyncSupervisorService;
    }

    public EmailSupervised addToCheckList(Email email,String type){

        EmailSupervised emailSupervised = new EmailSupervised(email, type);
        return emailSupervisorRepository.save(emailSupervised);
    }

    public ResponseEntity<EmailSupervised> deleteFromCheckList(Email email,String type){
        EmailSupervised emailSupervised = new EmailSupervised(email, type);

        List<EmailSupervised> emailSupervisedList= emailSupervisorRepository.getByEmail(email);
        if (emailSupervisedList.isEmpty())
            throw new ResourceNotFound("Do not exit any supervisor for the email "+ email.getEmail() );

        EmailSupervised toDelete = emailSupervisorRepository.findByEmailAndType(email, type)
                .orElseThrow(() -> new ResourceNotFound(
                        "The email " + email.getEmail() + " with type " + type + " is not on the supervised list"));

        // Delete
        emailSupervisorRepository.delete(toDelete);
        return ResponseEntity.ok(toDelete);
    }

    public List<EmailSupervised> getEmailSupervisedList(){
       return emailSupervisorRepository.findAll();
    }

    @Scheduled(cron = "${spring.task.scheduling.cron}")
    public void checkEmails() throws Exception {
        List<EmailSupervised> listEmail = emailSupervisorRepository.findAll();

        if(listEmail.isEmpty())
            System.out.println("Dont exist supervised emails");
        else{
            // dispara todas as execuções em paralelo
            List<CompletableFuture<Void>> futures = listEmail.stream()
                    .map(asyncSupervisorService::fetchSubjectsFromLast24Hours)
                    .toList();
            // espera todas terminarem antes de imprimir "Acabei"
            //CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        }
        System.out.println("Acabei");
    }



}
