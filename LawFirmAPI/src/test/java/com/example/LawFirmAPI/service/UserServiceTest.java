package com.example.LawFirmAPI.service;

import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.model.User.UserDTO.UserDTO;
import com.example.LawFirmAPI.repository.UserRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void UserService_NewUser_ReturnsUser(){
        //Arrange
        UserDTO userDTO = new UserDTO(
                "Teste Name",
                "teste@gmail.com",
                "988888888",
                "+135",
                "admin",
                "TesteUsernamer",
                "12345678"
        );
        User user = new User(userDTO);

        //Act
        when(userRepository.save(Mockito.any(User.class))).thenReturn(user);
        User savedUser = userService.newUser(userDTO);

        //Assert
        Assertions.assertThat(savedUser).isNotNull();
    }

    @Test
    public void UserService_GetClientsList_ReturnsListOfUsers(){
        //Arrange
        UserDTO userDTO1 = new UserDTO(
            "Teste Name2",
            "teste@gmail.com",
            "988888888",
            "+135",
            "client",
            "TesteUsernamer",
            "12345678"
        );
        UserDTO userDTO2 = new UserDTO(
            "Teste Name1",
            "teste@gmail.com",
            "988888888",
            "+135",
            "client",
            "TesteUsernamer",
            "12345678"
        );
        User user1 = new User(userDTO1);
        User user2 = new User(userDTO2);
        List<User> expectedClients = Arrays.asList(user1,user2);

        //Act
        when(userRepository.findByRole("client")).thenReturn(expectedClients);
        List<User> actualClients = userService.getClientsList();

        //Assert
        Assertions.assertThat(actualClients)
                .isNotNull()
                .hasSize(2)
                .allMatch(user -> user.getRole().equals("client"));
    }

    @Test
    public void UserService_GetClientsList_ReturnsListOfUsers_WhenNoClientsExist(){
        when(userRepository.findByRole("client")).thenReturn(List.of());

        List<User> result = userService.getClientsList();

        Assertions.assertThat(result).isEmpty();
    }

    @Test
    public void UserService_DeleteUser_ReturnsOK(){
        //Arrange
        Long userID = 1L;
        UserDTO userDTO = new UserDTO(
                "Teste Name",
                "teste@gmail.com",
                "988888888",
                "+135",
                "admin",
                "TesteUsernamer",
                "12345678"
        );
        User user = new User(userDTO);
        when(userRepository.findById(userID)).thenReturn(Optional.of(user));

        //Act
        ResponseEntity<User> responce = userService.deleteUser(userID);

        //Assert
        Assertions.assertThat(responce.getStatusCode().is2xxSuccessful()).isTrue();
        verify(userRepository).delete(user);
    }

    @Test
    public void UserService_DeleteUser_ThrowException_WhenUserDoesNotExist(){
        //Arrange
        Long userID = 99L;
        when(userRepository.findById(userID)).thenReturn(Optional.empty());

        //Act and Assert
        Assertions.assertThatThrownBy(()->userService.deleteUser(userID))
            .isInstanceOf(ResourceNotFound.class)
            .hasMessageContaining("User " +userID+" dont exist.");

        verify(userRepository, never()).delete(any(User.class));
    }

    @Test
    public void UserService_ChangeUser_ReturnsOK(){
        //Arrange
        Long userID = 1L;
        String username = "TesteUsernamer";
        UserDTO userDTO = new UserDTO(
                "Teste Name",
                "teste@gmail.com",
                "988888888",
                "+351",
                "admin",
                username,
                "12345678"
        );
        User user = new User(userDTO);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        //Act
        User updatedUser= userService.changeUser(userDTO);

        //Assert
        Assertions.assertThat(updatedUser).isNotNull().satisfies(
                user1 -> {
                    Assertions.assertThat(user1.getName()).isEqualTo("Teste Name");
                    Assertions.assertThat(user1.getEmail()).isEqualTo("teste@gmail.com");
                    Assertions.assertThat(user1.getPhone()).isEqualTo("988888888");
                    Assertions.assertThat(user1.getPrefix()).isEqualTo("+351");
                    Assertions.assertThat(user1.getRole()).isEqualTo("admin");
                }
        );
        verify(userRepository).save(user);
    }

    @Test
    public void UserService_ChangeUser_ThrowException_WhenUserDoesNotExist(){
        //Arrange
        Long userID = 99L;
        String username = "TesteUsernamer";
        UserDTO userDTO = new UserDTO(
                "Teste Name",
                "teste@gmail.com",
                "988888888",
                "+351",
                "admin",
                username,
                "12345678"
        );

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        Assertions.assertThatThrownBy(()-> userService.changeUser(userDTO))
                .isInstanceOf(ResourceNotFound.class)
                .hasMessageContaining("User "+ username +" dont exist.");

    }
}
