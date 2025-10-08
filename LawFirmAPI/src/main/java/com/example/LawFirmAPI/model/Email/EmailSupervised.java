package com.example.LawFirmAPI.model.Email;


import jakarta.persistence.*;

import java.lang.reflect.Type;

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
    private String type;

    public EmailSupervised(){}
    public EmailSupervised(Email email,String type){
        this.email=email;
        this.type=type;
    }

    //getter
    public String getType() {
        return type;
    }
    public Email getEmail() {
        return email;
    }
}
