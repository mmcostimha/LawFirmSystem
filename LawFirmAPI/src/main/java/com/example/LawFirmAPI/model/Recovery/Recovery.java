package com.example.LawFirmAPI.model.Recovery;

import com.example.LawFirmAPI.model.User.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recovery")
public class Recovery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private boolean active;

    @Column(nullable = false)
    private LocalDateTime creationDate;

    @ManyToOne
    @JoinColumn(name= "user_id")
    @JsonBackReference
    private User user;

    public Recovery(){}
    public Recovery(User user, String code){
        this.user = user;
        this.active = true;
        this.code = code;
        this.creationDate = LocalDateTime.now();
    }
    //getters
    public User getUser() {
        return user;
    }
    public String getCode() {
        return code;
    }
    public boolean getActive(){
        return active;
    }
    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public Long getId() {
        return id;
    }

    //Setters
    public void setActive(boolean active) {
        this.active = active;
    }
}
