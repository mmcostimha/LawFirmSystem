package com.example.LawFirmAPI.service.Email;

import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import com.example.LawFirmAPI.repository.EmailSupervisorRepository;
import com.example.LawFirmAPI.service.VaultPasswordService;
import jakarta.mail.Folder;
import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.Store;
import jakarta.mail.search.ComparisonTerm;
import jakarta.mail.search.ReceivedDateTerm;
import jakarta.mail.search.SearchTerm;
import org.hibernate.annotations.DialectOverride;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.*;

@Service
public class EmailSupervisorService {

    private final EmailSupervisorRepository emailSupervisorRepository;
    private final EmailService emailService;
    private final VaultPasswordService vaultPasswordService;

    public EmailSupervisorService(EmailSupervisorRepository emailSupervisorRepository,VaultPasswordService vaultPasswordService,EmailService emailService){
        this.emailSupervisorRepository = emailSupervisorRepository;
        this.vaultPasswordService = vaultPasswordService;
        this.emailService=emailService;
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
       List<EmailSupervised> list= emailSupervisorRepository.findAll();

       System.out.println("Created Emails: " + list);
       return list;
    }

    @Scheduled(cron = "${spring.task1.scheduling.cron}")
    public void checkEmails() throws Exception {
        List<EmailSupervised> listEmail = emailSupervisorRepository.findAll();
        if(listEmail.isEmpty())
            System.out.println("Dont exist supervised emails");
        else
            for (EmailSupervised emailSupervised : listEmail){
                System.out.println(fetchSubjectsFromLast24Hours(emailSupervised));
            }
    }

    public List<String> fetchSubjectsFromLast24Hours(EmailSupervised emailSupervised) throws Exception {
        Email clientEmail = emailSupervised.getEmail();
        String email = clientEmail.getEmail();
        String clientPassword = vaultPasswordService.getEmailPassword(clientEmail.getClient_id());
        List<String> subjects = new ArrayList<>();
        String provider;
        if (email.contains("gmail"))
            provider = "gmail.com";
        else if (email.contains("yahoo")) {
            provider = "yahoo.com";
        } else if (email.contains("sapo")) {
            provider = "sapo.pt";
        }else {
            throw new Exception("provedor nao suportado");
        }

        try {
            Properties props = new Properties();
            IMAPConfig(props,provider);

            Session session = Session.getInstance(props);
            Store store = session.getStore("imap");
            store.connect("imap."+ provider, clientEmail.getEmail(), clientPassword);

            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_ONLY);


            // Calcular limite de tempo (últimas 24 horas)
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.HOUR_OF_DAY, -24);
            Date sinceDate = cal.getTime();

            // Filtro por data de recebimento
            SearchTerm recent = new ReceivedDateTerm(ComparisonTerm.GE, sinceDate);

            Message[] messages = inbox.search(recent);

            for (Message msg : messages) {
                subjects.add(msg.getSubject());
            }

            inbox.close(false);
            store.close();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar emails do email " + clientEmail.getEmail(), e);
        }

        return subjects;
    }
    public void IMAPConfig(Properties props, String provider){
        // Configuração IMAP
        props.put("mail.store.protocol", "imap");
        props.put("mail.imap.host", "imap."+provider); // trocar pelo servidor do cliente
        props.put("mail.imap.port", "993");
        props.put("mail.imap.ssl.enable", "true");
    }

}
