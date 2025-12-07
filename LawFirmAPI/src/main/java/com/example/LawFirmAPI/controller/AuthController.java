package com.example.LawFirmAPI.controller;

import com.example.LawFirmAPI.model.User.*;
import com.example.LawFirmAPI.model.User.UserDTO.UserAccountCreatedDTO;
import com.example.LawFirmAPI.model.User.UserDTO.UserDTO;
import com.example.LawFirmAPI.model.User.UserDTO.UserRequestedDTO;
import com.example.LawFirmAPI.security.JwtUtil;
import com.example.LawFirmAPI.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.Random;

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

    //Regit a new Client
    @PostMapping("/register")
    public ResponseEntity<?> postMethodName(@RequestBody UserRequestedDTO request){
//        System.out.println("Tried access point"+ request.name());
        Random random = new Random();
        int numero = random.nextInt(6);
        //User Criation logic
        String[] names= request.name().split(" ");

        String userName = names[0] + names[names.length - 1] + request.phone().substring(numero,numero+3);
        String password = names[0] + names[names.length - 1];
        System.out.println(userName);
        UserDTO newUser = new UserDTO(
                request.name(),
                request.email(),
                request.phone(),
                request.role(),
                userName,
                password
        );
        User user = userService.newUser(newUser);
        System.out.println(user.getCreationDate());
        UserAccountCreatedDTO reponce = new UserAccountCreatedDTO(
                userName,
                password,
                user.getId(),
                user.getCreationDate()
        );
        return ResponseEntity.ok(reponce);
    }

    //Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated AuthenticationDTO request){

        var usernamePassword = new UsernamePasswordAuthenticationToken(request.username(),request.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = JwtUtil.generateToken(request.username());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

}
