package com.example.LawFirmAPI.service;

import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.Recovery.Recovery;
import com.example.LawFirmAPI.model.Recovery.RecoveryDTO;
import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.repository.RecoveryRepository;
import com.example.LawFirmAPI.repository.UserRepository;
import jakarta.mail.*;
import jakarta.mail.internet.*;
import java.util.Random;
import java.util.Optional;
import java.util.Properties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class RecoveryService {

    private final UserRepository userRepository;
    private final RecoveryRepository recoveryRepository;
    @Value("${EMAIL_PASSWORD:}")
    private String emailPassword;

    public RecoveryService (UserRepository userRepository,RecoveryRepository recoveryRepository){
        this.userRepository = userRepository;
        this.recoveryRepository = recoveryRepository;
    }

    public RecoveryDTO codeCreator(String email){
        //System.out.println("Entrei na criacao");
        User user = userRepository.findByEmail(email);
        if (user == null)
            throw new ResourceNotFound("User associado ao email "+email+" não encontrado");
        Recovery newCode = new Recovery(user,sixDigitCodeGenerator());



        // 1. Configurações do servidor SMTP
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.sapo.pt");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true"); // TLS obrigatório

        // 2. Autenticação
        String myEmail = "testeddd@sapo.pt";
        String myPass = emailPassword;

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(myEmail, myPass);
            }
        });

        try {
            // 3. Criação da mensagem
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(myEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("Código de Recuperação");
            message.setText("Olá"+user.getUsername()+"! Seu código de segurança é: "+newCode.getCode());

            // 4. Envio
            Transport.send(message);
            //System.out.println("E-mail enviado com sucesso!");

        } catch (MessagingException e) {
            e.printStackTrace();
        }

        Recovery codeCreated = recoveryRepository.save(newCode);

        return new RecoveryDTO(codeCreated.getId(),codeCreated.getCreationDate(),null);
    }

    public Long codeConfirmation(RecoveryDTO request){

        Optional<Recovery> recoveryOptional=recoveryRepository.findById(request.codeId());

        if (recoveryOptional.isEmpty())
            throw  new ResourceNotFound("Recovery "+request.codeId()+" n existe;");

        if (recoveryOptional.get().getCode().equals(request.code()))
            return recoveryOptional.get().getUser().getId();

        return null;
    }
    private String sixDigitCodeGenerator(){

        Random random = new Random();
        // Gera um número entre 0 e 999999
        int numero = random.nextInt(1000000);

        // %06d format para ter sempre 6 algarismos, preenchendo com 0 à esquerda
        return String.format("%06d", numero);
    }
;}
