package com.example.LawFirmAPI.controller;

import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;


    public  UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/clients")
    public List<User> getClientsList(){

        return userService.getClientsList();
    }
    @GetMapping("/admins")
    public List<User> getAdminList(){
        return userService.getAdminsList();
    }
    @GetMapping("user/{username}")
    public User getByUsername(@PathVariable String username){
        return userService.getByUsername(username);
    }

    @DeleteMapping("user/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable Long id){

        return userService.deleteEmail(id);
    }

}
