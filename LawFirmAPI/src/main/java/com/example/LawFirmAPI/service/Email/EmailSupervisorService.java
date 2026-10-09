package com.example.LawFirmAPI.service.Email;

import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import com.example.LawFirmAPI.repository.EmailSupervisorRepository;
import jakarta.mail.AuthenticationFailedException;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
public class EmailSupervisorService {

    private final EmailSupervisorRepository emailSupervisorRepository;
    private final ImapMailReader imapMailReader;
    private final AlarmService alarmService;
    private final EmailClassifier emailClassifier;
    private static final Logger log = LoggerFactory.getLogger(EmailSupervisorService.class);

    public EmailSupervisorService(EmailSupervisorRepository emailSupervisorRepository,
                                  ImapMailReader imapMailReader,
                                  AlarmService alarmService,
                                  EmailClassifier emailClassifier){
        this.emailSupervisorRepository = emailSupervisorRepository;
        this.imapMailReader = imapMailReader;
        this.alarmService = alarmService;
        this.emailClassifier =emailClassifier;
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
    public Optional<EmailSupervised> getAlarmById(Long id ){
        return  emailSupervisorRepository.findById(id);
    }
    public ResponseEntity<EmailSupervised> deleteEmailSupervisedById(Long id){

        Optional<EmailSupervised> alarm_aux = emailSupervisorRepository.findById(id);

        // Opção 1: Lançar exceção se não encontrar (Melhor prática)
        EmailSupervised alarm = alarm_aux.orElseThrow(() -> new RuntimeException("Alarme não encontrado"));

        Email email = alarm.getEmail();

        email.setAlarm(false);

        // Delete
        emailSupervisorRepository.delete(alarm);
        return ResponseEntity.ok(alarm);
    }

    @Scheduled(cron = "${spring.task2.scheduling.cron}")
    public void runCheck(){
        List<EmailSupervised> listSupervisedEmail = emailSupervisorRepository.findAll();

        if(!listSupervisedEmail.isEmpty()){
            for(EmailSupervised emailSupervised : listSupervisedEmail){
                try{
                    checkMailbox(emailSupervised);

                }catch (Exception e){
                    log.error("Falha ao verificar a caixa {}", emailSupervised.getEmail().getEmail(), e);
                }
            }
        }
    }
    private void checkMailbox(EmailSupervised emailSupervised) throws MessagingException{

        Email email = emailSupervised.getEmail();

        if (email.getAlarm()){
            return;
        }

        Instant since = Instant.now().minus(Duration.ofHours(24));
        List<MailMessage> messages =imapMailReader.fetchSince(email.getEmail(),email.getPassword(), since);

        List<String> sender = messages.stream()
                .map(MailMessage :: from)
                .toList();

        if(emailClassifier.shouldTriggerAlarm(sender,emailSupervised.getType()))
            alarmService.activateAlarm(emailSupervised);
    }

    public List<String> fetchRecentSubjects(String email, String password) throws AuthenticationFailedException, MessagingException{

        Instant since = Instant.now().minus(Duration.ofHours(24));
        List<MailMessage> messages =imapMailReader.fetchSince(email,password, since);

        return messages.stream()
                .map(MailMessage :: subject)
                .toList();
    }
}
