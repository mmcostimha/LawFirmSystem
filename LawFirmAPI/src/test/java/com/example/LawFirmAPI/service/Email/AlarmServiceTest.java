package com.example.LawFirmAPI.service.Email;

import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailSupervised;
import com.example.LawFirmAPI.repository.EmailRepository;
import com.example.LawFirmAPI.repository.EmailSupervisorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class AlarmServiceTest {

    @Mock
    private  EmailRepository emailRepository;

    @Mock
    private EmailSupervisorRepository emailSupervisorRepository;

    @InjectMocks
    private AlarmService alarmService;


    private EmailSupervised supervisedFor(String address, boolean alarmOn){
        Email email = new Email();
        email.setEmail(address);
        email.setAlarm(alarmOn);

        return new EmailSupervised(email,"type");
    }

    @Test
    public void AlarmService_ActivateAlarm_SetsAlarmToTrue(){
        //Arrange
        EmailSupervised emailSupervised = supervisedFor("client1@teste.com",false);

        //Act
        alarmService.activateAlarm(emailSupervised);

        //Assert
        assertThat(emailSupervised.getEmail().getAlarm()).isTrue();
    }

    @Test
    public void AlarmService_ActivateAlarm_SetsActivationDate(){
        //Arrange
        EmailSupervised emailSupervised = supervisedFor("client1@teste.com",false);
        LocalDateTime before = LocalDateTime.now();

        //Act
        alarmService.activateAlarm(emailSupervised);
        LocalDateTime after = LocalDateTime.now();

        //Assert
        // Verifica o objeto em memória. Na BD a data ainda não é gravada (updatable=false, issue #11).
        assertThat(emailSupervised.getActivationDate())
                .isBetween(before,after);
    }

    @Test
    public void AlarmService_ActivateAlarm_SavesEmailAndSupervisedEmail(){
        //Arrange
        EmailSupervised emailSupervised = supervisedFor("client1@teste.com",false);

        //Act
        alarmService.activateAlarm(emailSupervised);

        //Assert
        verify(emailRepository).save(emailSupervised.getEmail());
        verify(emailSupervisorRepository).save(emailSupervised);
    }


}
