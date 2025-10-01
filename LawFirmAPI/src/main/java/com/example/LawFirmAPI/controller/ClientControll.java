package com.example.LawFirmAPI.controller;

import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ClientControll {

    private final UserService userService;

    public  ClientControll(UserService userService){


        this.userService = userService;
    }

    @GetMapping("/client")
    public List<User> getClientsList(){

        return userService.getClientsList();
    }
    @GetMapping("/admin")
    public List<User> getAdminList(){

        return userService.getAdminsList();
    }

}
