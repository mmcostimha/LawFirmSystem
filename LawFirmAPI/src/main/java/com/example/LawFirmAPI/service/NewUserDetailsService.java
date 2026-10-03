package com.example.LawFirmAPI.service;

import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NewUserDetailsService implements  UserDetailsService{

    private final UserRepository userRepository;

    public NewUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isEmpty())
               throw new UsernameNotFoundException("User not found");

        User user = optionalUser.get();
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }
}
