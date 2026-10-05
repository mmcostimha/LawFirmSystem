package com.example.LawFirmAPI.repository;

import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.model.User.UserDTO.UserDTO;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void UserRepository_Save_ReturnSavedUser(){
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
        User savedUser = userRepository.save(user);

        //Assert
        Assertions.assertThat(savedUser).isNotNull();
        Assertions.assertThat(savedUser.getId()).isGreaterThan(0);
    }

}
