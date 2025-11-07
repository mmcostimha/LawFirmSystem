package com.example.LawFirmAPI.controller;

import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.model.User.UserDTO;
import com.example.LawFirmAPI.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;


    public  UserController(UserService userService){
        this.userService = userService;
    }
    //get Clients List
    @GetMapping("user/clients")
    public List<User> getClientsList(){
        List<User> users = userService.getClientsList();
        if (!users.isEmpty())
            System.out.println("Endpoit accessed clients "+ users.get(0).getClass());

        return users;
    }
    //get Admin List
    @GetMapping("user/admins")
    public List<User> getAdminList(){
        System.out.println("Endpoit accessed admin");

        return userService.getAdminsList();
    }
    //Get User by username
    @GetMapping("user/{username}")
    public User getByUsername(@PathVariable String username){
        return userService.getByUsername(username);
    }

    //Change User
    @PutMapping("user")
    public User changeUser(@RequestBody UserDTO newUser){
       return userService.changeUser(newUser);
    }

//    //Reset Password User
//    @GetMapping("user/reset")
//    public User resetPassword(@RequestBody UserDTO newUser){
//        return userService.get;
//    }
    //Delete user By id
    @DeleteMapping("user/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable Long id){
        return userService.deleteUser(id);
    }

}
