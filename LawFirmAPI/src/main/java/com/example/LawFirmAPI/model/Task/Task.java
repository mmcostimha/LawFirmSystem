package com.example.LawFirmAPI.model.Task;

import com.example.LawFirmAPI.model.User.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String task;

    @Column(nullable = false)
    private LocalDateTime creationDate;

    @Column(nullable = false)
    private boolean state; //false = n concluido e true = concuido

    @ManyToOne
    @JoinColumn(name= "user_id")
    @JsonBackReference
    private User user;

    public Task(){}
    public Task(User user,String task){
        this.user = user;
        this.task = task;
        this.state = false;
        this.creationDate = LocalDateTime.now();
    }
    //getters
    public LocalDateTime getCreationDate() {
        return creationDate;
    }
    public String getTask() {
        return task;
    }
    public User getUser() {
        return user;
    }

    public Long getId() {
        return id;
    }
    public Boolean getState(){
        return state;
    }

    //setters
    public void setTask(String task) {
        this.task = task;
    }
    public void setState(boolean state) {
        this.state = state;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
