package com.example.LawFirmAPI.controller;

import com.example.LawFirmAPI.model.Recovery.RecoveryDTO;
import com.example.LawFirmAPI.model.User.*;
import com.example.LawFirmAPI.model.User.UserDTO.UserAccountCreatedDTO;
import com.example.LawFirmAPI.model.User.UserDTO.UserDTO;
import com.example.LawFirmAPI.model.User.UserDTO.UserRequestedDTO;
import com.example.LawFirmAPI.repository.RecoveryRepository;
import com.example.LawFirmAPI.security.JwtUtil;
import com.example.LawFirmAPI.service.RecoveryService;
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
    private final RecoveryService recoveryService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthController(UserService us,RecoveryService recoveryService){

        this.userService = us;
        this.recoveryService = recoveryService;
    }

    //Regit a new Client
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequestedDTO request) {
        // 1. Generate a random offset safely
        Random random = new Random();
        int phoneLength = request.phone().length();
        // Ensure we don't go out of bounds (assuming phone is at least 3 chars)
        int numero = (phoneLength > 3) ? random.nextInt(phoneLength - 3) : 0;

        // 2. Logic for Username and Password
        String[] names = request.name().split(" ");
        String firstName = names[0];
        String lastName = names[names.length - 1];



        String userName = firstName + lastName + request.phone().substring(numero, numero + 3);
        // Fixed the syntax error here
        String password = userService.generateSecurePassword(names);
        //System.out.println("Prefixo "+request.prefix());
        // 3. Mapping and Service Call
        UserDTO newUserDto = new UserDTO(
                request.name(),
                request.email(),
                request.phone(),
                request.prefix(),
                request.role(),
                userName,
                password
        );

        User user = userService.newUser(newUserDto);

        // 4. Return the response
        UserAccountCreatedDTO response = new UserAccountCreatedDTO(
                userName,
                password,
                user.getId(),
                user.getCreationDate()
        );

        return ResponseEntity.ok(response);
    }

    //Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated AuthenticationDTO request){

        var usernamePassword = new UsernamePasswordAuthenticationToken(request.username(),request.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = JwtUtil.generateToken(request.username());
        User user = userService.getByUsername(request.username());
        return ResponseEntity.ok(new LoginResponseDTO(token,user.getId()));
    }

    @PostMapping("/recovery/{email}")
    public RecoveryDTO recoveryCodeProvider(@PathVariable String email){

        return recoveryService.codeCreator(email);
    }

    @PostMapping("/recovery")
    public Long recoveryCodeConfirmation(@RequestBody RecoveryDTO request){
        return recoveryService.codeConfirmation(request);
    }
    @PutMapping("/recovery/password/{id}/{pass}")
    public ResponseEntity<User> recoveryCodeConfirmation(@PathVariable Long id,@PathVariable String pass){
        return userService.newUserPassword(id,pass);
    }

}
