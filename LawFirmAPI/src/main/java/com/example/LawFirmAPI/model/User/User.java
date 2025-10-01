package com.example.LawFirmAPI.model.User;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true,nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private boolean isAdmin;

    public User(){}

    public User(String username ,String password ,String name ,String email ,String phone,boolean isAdmin){
        this.username=username;
        this.password=password;
        this.name=name;
        this.email=email;
        this.phone=phone;
        this.isAdmin= isAdmin;
    }
    //get functions

    public Long getId() {
        return id;
    }

    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return username;
    }

    //Set functions

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
