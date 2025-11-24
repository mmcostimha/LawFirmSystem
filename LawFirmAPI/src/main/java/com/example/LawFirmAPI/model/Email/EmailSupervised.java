package com.example.LawFirmAPI.model.Email;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name= "emailSupervised")
public class EmailSupervised {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name= "email_id")
    private Email email;

    @Column(updatable = false)
    private LocalDateTime creationDate;

    @Column(updatable = false)
    private String type;



    public EmailSupervised(){}
    public EmailSupervised(Email email,String type){
        this.email=email;
        this.type=type;
        this.creationDate = LocalDateTime.now();
    }

    //getter
    public String getType() {
        return type;
    }
    public Email getEmail() {
        return email;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }
}
