package com.example.LawFirmAPI.service.Email;

import java.time.Instant;
import java.util.*;

import com.example.LawFirmAPI.exceptions.MailServerException;
import com.example.LawFirmAPI.exceptions.MailboxAuthenticationException;
import com.example.LawFirmAPI.exceptions.UnsupportedMailProviderException;
import jakarta.mail.*;
import jakarta.mail.search.ComparisonTerm;
import jakarta.mail.search.ReceivedDateTerm;
import jakarta.mail.search.SearchTerm;
import org.springframework.stereotype.Component;

@Component
public class ImapMailReader {
    private static final String GMAIL_HOST = "imap.gmail.com";

    public List<MailMessage> fetchSince(String email, String password, Instant since) {

        String provider = resolveHost( email);
        Properties props = new Properties();
        IMAPConfig(props, provider);
        Session session = Session.getInstance(props);

        try (Store store = session.getStore("imaps")) {
            store.connect(provider, email, password);
            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_ONLY);

            SearchTerm recent = new ReceivedDateTerm(ComparisonTerm.GE, Date.from(since));

            Message[] messages = inbox.search(recent);
            List<MailMessage> result = new ArrayList<>();
            for (Message m : messages) {
                result.add(new MailMessage(extractFrom(m), m.getSubject()));
            }
            inbox.close(false);
            return result;
        } catch (AuthenticationFailedException e) {
            throw new MailboxAuthenticationException("Credenciais inválidas para " + email, e);
        } catch (MessagingException e) {
            throw new MailServerException("Falha ao ler a caixa " + email, e);
        }
    }
    private void IMAPConfig(Properties props, String provider){
        // Configuração IMAP
        props.put("mail.store.protocol", "imaps");
        props.put("mail.imaps.host", provider);
        props.put("mail.imaps.port", "993");
        props.put("mail.imaps.ssl.enable", "true");
        props.put("mail.imaps.connectiontimeout", "2000");
        props.put("mail.imaps.timeout", "2000");
    }
    private String extractFrom(Message msg) throws MessagingException {
        Address[] from = msg.getFrom();
        if (from == null || from.length == 0) {
            return null;                 // o EmailClassifier já ignora nulos
        }
        return from[0].toString();
    }
    private String resolveHost(String email) {
        if (email.toLowerCase().endsWith("@gmail.com")) {
            return GMAIL_HOST;
        }
        throw new UnsupportedMailProviderException("Fornecedor de e-mail não suportado: só Gmail");
    }
}
