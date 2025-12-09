package com.example.LawFirmAPI.model.Email;

import com.example.LawFirmAPI.model.User.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "emails")
public class Email {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "email", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmailSupervised> emailSupervised;

    @Column
    private boolean alarm;

    @Column(nullable = false)
    private boolean valid;

    @Column(nullable = false)
    private LocalDateTime creationDate;

    @OneToOne
    @JoinColumn(name = "client_id", unique = true)
    private User user;

    public Email(){};
    public Email(EmailDTO email, User user){
        this.email= email.email();
        this.user = user;
        this.alarm = false;
        this.password= email.password();
        this.creationDate = LocalDateTime.now();
        this.valid = true;
    }

    //getters
    public String getEmail() {
        return email;
    }
    public Long getClient_id() {
        return user.getId();
    }
    public Long getId() {
        return id;
    }
    public boolean getAlarm(){
        return this.alarm;
    }
    public boolean getValid(){
        return this.valid;
    }
    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public String getPassword() {
        return password;
    }

    //setter
    public void setEmail(String email) {
        this.email = email;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setAlarm(boolean alarm) {
        this.alarm = alarm;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
