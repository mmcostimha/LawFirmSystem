package com.example.LawFirmAPI.service.Email;

import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import com.example.LawFirmAPI.repository.EmailRepository;
import com.example.LawFirmAPI.service.VaultPasswordService;
import jakarta.mail.Folder;
import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.Store;
import jakarta.mail.search.ComparisonTerm;
import jakarta.mail.search.ReceivedDateTerm;
import jakarta.mail.search.SearchTerm;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class AsyncSupervisorService {

    private final VaultPasswordService vaultPasswordService;
    private EmailRepository emailRepository;

    public AsyncSupervisorService(VaultPasswordService vaultPasswordService,EmailRepository emailRepository){
        this.emailRepository=emailRepository;
        this.vaultPasswordService = vaultPasswordService;
    }

    @Async
    public CompletableFuture<Void> fetchSubjectsFromLast24Hours(EmailSupervised emailSupervised){

        //posso vir a repetir essa funcao pois um email pode ser supervisionado por dois motivos(tipos)
        Email clientEmail = emailSupervised.getEmail();

        if(clientEmail.getAlarm()){
            System.out.println("Alarm ja acionado do email "+ clientEmail.getEmail());
            return CompletableFuture.completedFuture(null);
        }


        String email = clientEmail.getEmail();
        String clientPassword = vaultPasswordService.getEmailPassword(clientEmail.getClient_id());

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
                emailRepository.save(clientEmail);
                System.out.println("O alarm do email "+ clientEmail.getEmail() + " foi acionado");
                return;
            }
        }
        System.out.println("Nenhum alarm acionado para o email"+ clientEmail.getEmail());
    }

}
