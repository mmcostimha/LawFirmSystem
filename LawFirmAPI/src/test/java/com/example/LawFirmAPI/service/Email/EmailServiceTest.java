package com.example.LawFirmAPI.service.Email;
import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.Email.EmailDTO;
import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.model.User.UserDTO.UserDTO;
import com.example.LawFirmAPI.repository.EmailRepository;
import com.example.LawFirmAPI.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessResourceFailureException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock
    private EmailRepository emailRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EmailService emailService;

    private User client(){
        UserDTO userDTO = new UserDTO(
                "Teste Name",
                "teste@gmail.com",
                "988888888",
                "+135",
                "admin",
                "TesteUsernamer",
                "12345678"
        );
        return new User(userDTO);
    }

    @Test
    public void EmailService_SaveClientEmail_UpdatesEmail_WhenClientAlreadyHasOne(){
        //Arrange
        Email existing = new Email();
        existing.setEmail("old@test.pt");
        EmailDTO request = new EmailDTO("novo@test.pt","irrelevante",1L);

        when(emailRepository.existsByUser_Id(1L)).thenReturn(true);
        when(emailRepository.findByUser_Id(1L)).thenReturn(existing);

        //Act
        emailService.saveClientEmail(request);

        //Assert
        assertThat(existing.getEmail()).isEqualTo("novo@test.pt");
        verify(emailRepository).save(existing);
        verify(userRepository, never()).findById(any());
    }

    @Test
    public void EmailService_SaveClientEmail_CreatesEmail_WhenClientHasNone(){
        //Arrange
        User user = client();
        EmailDTO request = new EmailDTO("novo@test.pt","irrelevante",1L);

        when(emailRepository.existsByUser_Id(1L)).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        //Act
        emailService.saveClientEmail(request);

        //Assert
        ArgumentCaptor<Email> captor = ArgumentCaptor.forClass(Email.class);
        verify(emailRepository).save(captor.capture());

        Email saved = captor.getValue();
        assertThat(saved.getEmail()).isEqualTo("novo@test.pt");
        assertThat(saved.getUser()).isSameAs(user);

    }
    @Test
    public void EmailService_SaveClientEmail_DoesNotCreateEmail_WhenDatabaseFails() {
        //Arrange
        EmailDTO request = new EmailDTO("novo@test.pt", "irrelevante", 1L);
        when(emailRepository.existsByUser_Id(1L))
                .thenThrow(new DataAccessResourceFailureException("BD em baixo"));

        //Act + Assert
        assertThatThrownBy(() -> emailService.saveClientEmail(request))
                .isInstanceOf(DataAccessResourceFailureException.class);

        verify(emailRepository, never()).save(any());
    }

}
