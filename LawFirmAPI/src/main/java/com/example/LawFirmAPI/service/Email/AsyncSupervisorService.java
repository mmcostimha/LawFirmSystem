package com.example.LawFirmAPI.service.Email;

import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailDTO;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import com.example.LawFirmAPI.repository.EmailRepository;
//import com.example.LawFirmAPI.service.VaultPasswordService;
import com.example.LawFirmAPI.repository.EmailSupervisorRepository;
import jakarta.mail.*;
import jakarta.mail.search.ComparisonTerm;
import jakarta.mail.search.ReceivedDateTerm;
import jakarta.mail.search.SearchTerm;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class AsyncSupervisorService {

    //private final VaultPasswordService vaultPasswordService;
    private EmailRepository emailRepository;
    private EmailSupervisorRepository emailSupervisorRepository;

    public AsyncSupervisorService(EmailRepository emailRepository,EmailSupervisorRepository emailSupervisorRepository){
        this.emailRepository=emailRepository;
        this.emailSupervisorRepository=emailSupervisorRepository;
        //this.vaultPasswordService = vaultPasswordService;
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
        //String clientPassword = vaultPasswordService.getEmailPassword(clientEmail.getClient_id());

        List<String> subjects = new ArrayList<>();

        String provider = "";
        if (email.contains("gmail")) {
            provider = "imap.gmail.com";
        }
        else if (email.contains("sapo")) {
            provider = "imap.sapo.pt";
        }
        else {
            throw new RuntimeException("Provedor não suportado");
        }

        try {
            Properties props = new Properties();
            IMAPConfig(props,provider);

            Session session = Session.getInstance(props);
            Store store = session.getStore("imaps");
//            System.out.println("Email: "+clientEmail.getEmail()+" Pass: "+clientPassword);
            store.connect(provider, clientEmail.getEmail(), clientPassword);

//            System.out.println("Email: "+clientEmail.getEmail()+" Pass: "+clientPassword);
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

        }
        catch (jakarta.mail.AuthenticationFailedException authEx) {
            throw new RuntimeException("Erro na autenticaçao do email " + clientEmail.getEmail(), authEx);
        }
        catch (Exception e) {
            throw new RuntimeException("Erro ao buscar emails do email " + clientEmail.getEmail(), e);
        }
        setClientAlarm(clientEmail, subjects, emailSupervised);
        return CompletableFuture.completedFuture(null);
    }

    public ResponseEntity<List<String>> fetchSubjectsEmailValidation(EmailDTO emailDTO) {
        String email = emailDTO.email();
        String clientPassword = emailDTO.password();
        List<String> subjects = new ArrayList<>();

        // 1. Determine Provider
        String provider = determineProvider(email);

        try {
            Properties props = new Properties();
            IMAPConfig(props, provider); // Assuming this sets imaps.host, port, etc.

            Session session = Session.getInstance(props);

            // Using try-with-resources isn't directly possible with Store/Folder,
            // so we use a finally block for safety.
            Store store = session.getStore("imaps");
            store.connect(provider, email, clientPassword);

            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_ONLY);

            // 2. Define Time Range (Last 24 Hours)
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.HOUR_OF_DAY, -24);
            Date sinceDate = cal.getTime();

            // 3. Search and Collect
            SearchTerm recent = new ReceivedDateTerm(ComparisonTerm.GE, sinceDate);
            Message[] messages = inbox.search(recent);

            for (Message msg : messages) {
                subjects.add(msg.getSubject());
            }

            // Clean up
            inbox.close(false);
            store.close();

            return ResponseEntity.ok(subjects);

        } catch (AuthenticationFailedException authEx) {
            // Specific error for wrong credentials
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar emails de: " + email, e);
        }
    }

    private String determineProvider(String email) {
        if (email.contains("gmail")) return "imap.gmail.com";
        if (email.contains("sapo")) return "imap.sapo.pt";
        throw new IllegalArgumentException("Provedor não suportado");
    }

    public void IMAPConfig(Properties props, String provider){
        // Configuração IMAP
        props.put("mail.store.protocol", "imaps");
        props.put("mail.imaps.host", provider);
        props.put("mail.imaps.port", "993");
        props.put("mail.imaps.ssl.enable", "true");
        props.put("mail.imaps.connectiontimeout", "2000");
        props.put("mail.imaps.timeout", "2000");
    }

    public void setClientAlarm(Email clientEmail,List<String> subjects,EmailSupervised emailSupervised){
        for(String subject : subjects){
            if (subject.equalsIgnoreCase(emailSupervised.getType())){
                clientEmail.setAlarm(true);
                emailSupervised.setActivationDate();
                System.out.println("hsiadfbaslkjb"+emailSupervised.getActivationDate());
                emailRepository.save(clientEmail);
                emailSupervisorRepository.save(emailSupervised);
                //System.out.println("O alarm do email "+ clientEmail.getEmail() + " foi acionado");
                return;
            }
        }
        //System.out.println("Nenhum alarm acionado para o email"+ clientEmail.getEmail());
    }


}
