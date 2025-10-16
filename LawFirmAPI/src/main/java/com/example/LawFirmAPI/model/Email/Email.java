package com.example.LawFirmAPI.model.Email;

import com.example.LawFirmAPI.model.User.User;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "emails")
public class Email {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @OneToMany(mappedBy = "email", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmailSupervised> emailSupervised;

    @Column
    private boolean alarm;

    @OneToOne
    @JoinColumn(name = "client_id", unique = true)
    private User user;

    public Email(){};
    public Email(EmailDTO email, User user){
        this.email= email.email();
        this.user = user;
        this.alarm = false;
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

    //setter
    public void setEmail(String email) {
        this.email = email;
    }
    public void setAlarm(boolean alarm) {
        this.alarm = alarm;
    }
}
