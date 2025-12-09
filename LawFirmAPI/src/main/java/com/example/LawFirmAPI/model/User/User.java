package com.example.LawFirmAPI.model.User;

import com.example.LawFirmAPI.model.Email.Email;
import com.example.LawFirmAPI.model.User.UserDTO.UserDTO;
import com.example.LawFirmAPI.model.User.UserDTO.UserRequestedDTO;
import jakarta.persistence.*;
import java.time.LocalDateTime;


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
    private String role;

    @Column(nullable = false)
    private LocalDateTime creationDate;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Email emailEntity;

    public User(){}

    public User(UserDTO user){
        this.username=user.username();
        this.password=user.password();
        this.name=user.name();
        this.email=user.email();
        this.phone=user.phone();
        this.role= user.role();
        this.creationDate = LocalDateTime.now();
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
    public String getEmail() {
        return email;
    }
    public String getPhone() {
        return phone;
    }
    public String getName() {
        return name;
    }
    public String getRole() {
        return role;
    }

    //Set functions
    public void setUser(UserDTO newUser){
        setEmail(newUser.email());
        setName(newUser.name());
        setPhone(newUser.phone());
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public LocalDateTime getCreationDate() {
        return creationDate;
    }
}
