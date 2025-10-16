package com.example.LawFirmAPI.service;

import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.model.User.UserDTO;
import com.example.LawFirmAPI.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VaultPasswordService vaultPasswordService;

    public UserService(UserRepository userRepository,VaultPasswordService vaultPasswordService){
        this.userRepository=userRepository;
        this.passwordEncoder=new BCryptPasswordEncoder();
        this.vaultPasswordService=vaultPasswordService;
    }


    public User newUser(UserDTO userRequest){
        String encryptedPassword = passwordEncoder.encode(userRequest.password());
        UserDTO newUser = new UserDTO(userRequest.name(),userRequest.email(),userRequest.phone(),userRequest.role(),userRequest.username(),encryptedPassword);
        User user = new User(newUser);
        return userRepository.save(user);
    }

    public User getByUsername(String username){
        return userRepository.findByUsername(username);
    }
    public List<User> getClientsList(){
        return userRepository.findByRole("client");
    }
    public List<User> getAdminsList() {
        return userRepository.findByRole("admin");
    }

    public User changeUser(UserDTO newUser){
        User user = userRepository.findByUsername(newUser.username());

        user.setUser(newUser);

        return userRepository.save(user);
    }

    public ResponseEntity<User> deleteUser(Long userId){

        Optional<User> op_user = userRepository.findById(userId);
        if (op_user.isEmpty())
            throw  new ResourceNotFound("User "+ userId +" dont exist.");

        vaultPasswordService.deleteEmailPassword(userId);
        User user = op_user.get();
        userRepository.delete(user);

        return ResponseEntity.ok().build();
    }

}
