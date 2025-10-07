package com.example.LawFirmAPI.model.Email;

import com.example.LawFirmAPI.model.User.User;
import jakarta.persistence.*;

@Entity
@Table(name = "emails")
public class Email {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @OneToOne
    @JoinColumn(name = "client_id", unique = true)
    private User user;

    public Email(){};
    public Email(EmailDTO email, User user){
        this.email= email.email();
        this.user = user;
    }

    //getters
    public String getEmail() {
        return email;
    }
    public Long getClient_id() {
        return user.getId();
    }
    //setter
    public void setEmail(String email) {
        this.email = email;
    }
}
