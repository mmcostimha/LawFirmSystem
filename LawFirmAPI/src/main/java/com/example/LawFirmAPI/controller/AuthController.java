package com.example.LawFirmAPI.controller;

import com.example.LawFirmAPI.model.User;
import com.example.LawFirmAPI.security.JwtUtil;
import com.example.LawFirmAPI.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService us){
        this.userService = us;
    }

    @PostMapping("/register")
    public ResponseEntity<?> postMethodName(@RequestBody Map<String,String> request){
        String username = request.get("username");
        String password = request.get("password");
        String name = request.get("name");
        String email = request.get("email");
        String phone = request.get("phone");
        boolean isAdmin = Boolean.parseBoolean(request.get("isAdmin"));

        User user = userService.newUser(username ,password ,name ,email ,phone,isAdmin);
        return ResponseEntity.ok(user);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> request){
        Optional<User> user = userService.getByUsername(request.get("username"));
        if(user.isPresent() && user.get().getPassword().equals(request.get("password"))){
            String token = JwtUtil.generateToken(user.get().getUsername());
            return ResponseEntity.ok(Map.of("token",token));
        }
        return ResponseEntity.status(401).body("Invalid Credentials");
    }


}
