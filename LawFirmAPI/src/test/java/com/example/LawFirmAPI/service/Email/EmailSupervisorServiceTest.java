package com.example.LawFirmAPI.service.Email;

import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import com.example.LawFirmAPI.repository.EmailSupervisorRepository;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailSupervisorServiceTest {

    @Mock
    private EmailSupervisorRepository emailSupervisorRepository;

    @Mock
    private ImapMailReader imapMailReader;

    @Mock
    private AlarmService alarmService;

    private EmailClassifier emailClassifier;

    private EmailSupervisorService emailSupervisorService;

    @BeforeEach
    void setUp(){
        emailSupervisorService = new EmailSupervisorService(emailSupervisorRepository,imapMailReader,alarmService,new EmailClassifier());
    }

    //funcao contrutora de um Email em supervisao
    private EmailSupervised supervisedFor(String address, String type, boolean alarmOn){
        Email email = new Email();
        email.setEmail(address);
        email.setPassword("notRelevant");
        email.setAlarm(alarmOn);

        return new EmailSupervised(email,type);

    }

    @Test
    public void EmailSupervisorService_RunCheck_ActivateAlarm_WhenSenderMatchesType() throws Exception{
        //Arrange
        EmailSupervised emailSupervised = supervisedFor("client@gmail.com", "tribunal",false);
        when(emailSupervisorRepository.findAll())
                .thenReturn(List.of(emailSupervised));
        when(imapMailReader.fetchSince(eq("client@gmail.com"), any(),any()))
                .thenReturn(List.of(new MailMessage("notificacoes@tribunal.com","Citacoes")));

        //Act
        emailSupervisorService.runCheck();

        //Assert
        verify(alarmService).activateAlarm(emailSupervised);
    }

    @Test
    public void EmailSupervisorService_RunCheck_SkipMailBox_WhenAlarmAlreadyActive(){
        //Arrange
        EmailSupervised emailSupervised = supervisedFor("client@gmail.com", "tribunal",true);
        when(emailSupervisorRepository.findAll())
                .thenReturn(List.of(emailSupervised));
        //Act
        emailSupervisorService.runCheck();

        //Assert
        verifyNoInteractions(imapMailReader, alarmService);
    }

    @Test
    public void EmailSupervisorService_RunCheck_DoesNothing_WhenNoEmailsSupervised(){
        //Arrange
        when(emailSupervisorRepository.findAll())
                .thenReturn(List.of());
        //Act
        emailSupervisorService.runCheck();
        //Assert
        verifyNoInteractions(imapMailReader,alarmService);
    }

    @Test
    public void EmailSupervisorService_RunCheck_DoesNotActivateAlarm_WhenNoSenderMatchType() throws Exception{
        //Arrange
        EmailSupervised emailSupervised = supervisedFor("client@gmail.com", "tribunal",false);
        when(emailSupervisorRepository.findAll())
                .thenReturn(List.of(emailSupervised));
        when(imapMailReader.fetchSince(eq("client@gmail.com"), any(),any()))
                .thenReturn(List.of(new MailMessage("notificacoes@example.com","Citacoes")));

        //Act
        emailSupervisorService.runCheck();

        //Assert
        verifyNoInteractions(alarmService);
    }

    @Test
    public void EmailSupervisorService_RunCheck_ContinuesWithNextMailbox_WhenImapMailReaderFails() throws Exception{
        //Arrange
        EmailSupervised emailSupervised1 = supervisedFor("client1@gmail.com", "tribunal",false);
        EmailSupervised emailSupervised2 = supervisedFor("client2@gmail.com", "tribunal",false);

        when(emailSupervisorRepository.findAll())
                .thenReturn(List.of(emailSupervised1,emailSupervised2));

        when(imapMailReader.fetchSince(eq("client1@gmail.com"), any(), any()))
                .thenThrow(new MessagingException("servidor em baixo"));

        when(imapMailReader.fetchSince(eq("client2@gmail.com"), any(), any()))
                .thenReturn(List.of(new MailMessage("notificacoes@tribunal.com","Citacoes")));

        //Act
        emailSupervisorService.runCheck();

        //Assert
        verify(alarmService, never()).activateAlarm(emailSupervised1);
        verify(alarmService).activateAlarm(emailSupervised2);

    }
}