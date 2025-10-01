package com.example.LawFirmAPI.service;

import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository){
        this.userRepository=userRepository;
        this.passwordEncoder=new BCryptPasswordEncoder();
    }


    public User newUser(String username ,String password ,String name ,String email ,String phone,boolean is_admin){
        String encryptedPassword = passwordEncoder.encode(password);
        User user = new User(username ,encryptedPassword ,name ,email ,phone, is_admin);
        return userRepository.save(user);
    }

    public Optional<User> getByUsername(String username){
        return userRepository.findByUsername(username);
    }

    public
    List<User> getClientsList(){
        return userRepository.findByIsAdmin(false);
    }

    public
    List<User> getAdminsList() {
        return userRepository.findByIsAdmin(true);
    }

    public void deleteUserById(Long id){
        if(!userRepository.existsById(id)){
            throw new ResourceNotFound("User "+id+" not found.");
        }
        userRepository.deleteById(id);
    }
}
