package com.example.LawFirmAPI.service;

import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.model.User.UserDTO.UserDTO;
import com.example.LawFirmAPI.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    //private final VaultPasswordService vaultPasswordService;

    public UserService(UserRepository userRepository){
        this.userRepository=userRepository;
        this.passwordEncoder=new BCryptPasswordEncoder();
        //this.vaultPasswordService=vaultPasswordService;
    }


    public User newUser(UserDTO userRequest){
        String encryptedPassword = passwordEncoder.encode(userRequest.password());
        //System.out.println("Prefixo "+userRequest.prefix());
        UserDTO newUser = new UserDTO(
                userRequest.name(),
                userRequest.email(),
                userRequest.phone(),
                userRequest.prefix(),
                userRequest.role(),
                userRequest.username(),
                encryptedPassword
        );
        User user = new User(newUser);
        return userRepository.save(user);
    }


    public User getByUsername(String username){
        return userRepository.findByUsername(username);
    }

    public User getById(Long id){
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty())
           throw  new ResourceNotFound("User "+ id +" dont exist.");
        return userOptional.get();
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

        //vaultPasswordService.deleteEmailPassword(userId);
        User user = op_user.get();
        userRepository.delete(user);

        return ResponseEntity.ok().build();
    }
    public String generateSecurePassword(String[] names ) {
        String fistPart ="";
        int length = 10 - names.length-1;
        for (String name : names){
            fistPart = fistPart.concat(name.substring(0, 1));
        }
        fistPart = fistPart.concat("_");
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) { // Senha de 12 caracteres
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }

        return fistPart + sb.toString();
    }

    public ResponseEntity<User> newUserPassword(Long userId, String passe){
        Optional<User> op_user = userRepository.findById(userId);
        if (op_user.isEmpty())
            throw  new ResourceNotFound("User "+ userId +" dont exist.");

        String encryptedPassword = passwordEncoder.encode(passe);
        User user = op_user.get();
        user.setPassword(encryptedPassword);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
