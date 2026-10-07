package com.example.LawFirmAPI.service.Email;

import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailDTO;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import com.example.LawFirmAPI.repository.EmailRepository;
import com.example.LawFirmAPI.repository.EmailSupervisorRepository;
import jakarta.mail.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class AsyncSupervisorService {

    private final EmailRepository emailRepository;
    private final EmailSupervisorRepository emailSupervisorRepository;
    private final ImapMailReader mailReader;

    public AsyncSupervisorService(EmailRepository emailRepository,EmailSupervisorRepository emailSupervisorRepository, ImapMailReader mailReader){
        this.emailRepository=emailRepository;
        this.emailSupervisorRepository=emailSupervisorRepository;
        this.mailReader = mailReader;
    }

    public CompletableFuture<Void> fetchSubjectsFromLast24Hours(EmailSupervised emailSupervised){
        //posso vir a repetir essa funcao pois um email pode ser supervisionado por dois motivos(tipos)
        Email clientEmail = emailSupervised.getEmail();

        if(clientEmail.getAlarm()){
            System.out.println("Alarm ja acionado do email "+ clientEmail.getEmail());
            return CompletableFuture.completedFuture(null);
        }
        String email = clientEmail.getEmail();
        String clientPassword = clientEmail.getPassword();
        List<String> senders;

        try {
            List<MailMessage> mailMessages = mailReader.fetchSince(email,clientPassword, Instant.now().minus(Duration.ofHours(24)));

            senders = mailMessages.stream()
                    .map(MailMessage::from)
                    .toList();
        }
        catch (AuthenticationFailedException authEx) {
            throw new RuntimeException("Erro na autenticaçao do email " + clientEmail.getEmail(), authEx);
        }
        catch (Exception e) {
            throw new RuntimeException("Erro ao buscar emails do email " + clientEmail.getEmail(), e);
        }
        setClientAlarm(clientEmail, senders, emailSupervised);
        return CompletableFuture.completedFuture(null);
    }

    public ResponseEntity<List<String>> fetchSubjectsEmailValidation(EmailDTO emailDTO) {

        String email = emailDTO.email();
        String clientPassword = emailDTO.password();
        List<String> subjects ;

        try {
            List<MailMessage> mailMessageList =mailReader.fetchSince(email, clientPassword, Instant.now().minus(Duration.ofHours(24)));
            subjects = mailMessageList.stream()
                    .map(MailMessage::subject)
                    .filter(Objects::nonNull)
                    .toList();
            return ResponseEntity.ok(subjects);

        } catch (AuthenticationFailedException authEx) {
            // Specific error for wrong credentials
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar emails de: " + email, e);
        }
    }

    public void setClientAlarm(Email clientEmail,List<String> subjects,EmailSupervised emailSupervised){
        for(String subject : subjects){
//            System.out.println("email: "+subject);
//            if (subject.equalsIgnoreCase()){
            if (subject.contains(emailSupervised.getType())){
                clientEmail.setAlarm(true);
                emailSupervised.setActivationDate();
                emailRepository.save(clientEmail);
                emailSupervisorRepository.save(emailSupervised);
                System.out.println("O alarm do email "+ clientEmail.getEmail() + " foi acionado");
                return;
            }
        }
        System.out.println("Nenhum alarm acionado para o email"+ clientEmail.getEmail());
    }


}
