package com.example.LawFirmAPI.controller;

import com.example.LawFirmAPI.model.User.AuthenticationDTO;
import com.example.LawFirmAPI.model.User.LoginResponseDTO;
import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.model.User.UserDTO;
import com.example.LawFirmAPI.security.JwtUtil;
import com.example.LawFirmAPI.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthController(UserService us){
        this.userService = us;
    }

    @PostMapping("/register")
    public ResponseEntity<?> postMethodName(@RequestBody UserDTO request){

        User user = userService.newUser(request);
        return ResponseEntity.ok(user);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated AuthenticationDTO request){

        var usernamePassword = new UsernamePasswordAuthenticationToken(request.username(),request.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = JwtUtil.generateToken(request.username());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

}
