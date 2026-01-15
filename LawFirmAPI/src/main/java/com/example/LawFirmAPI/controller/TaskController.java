package com.example.LawFirmAPI.controller;


import com.example.LawFirmAPI.model.Task.Task;
import com.example.LawFirmAPI.model.Task.TaskDTO;
import com.example.LawFirmAPI.service.Task.TaskService;
import com.example.LawFirmAPI.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {
    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService){
        this.taskService=taskService;
        this.userService = userService;
    }

    @PostMapping("/task")
    public TaskDTO newClientTask(@RequestBody TaskDTO taskDTO){
        System.out.println("Creating Task: "+ taskDTO.task() + " for client "+ taskDTO.clientId());
        System.out.println(".>"+ taskDTO.toString());
        return taskService.newClientTask(taskDTO);
    }

    @GetMapping("/task/{clientId}")
    public List<Task> getClientTasks(@PathVariable Long clientId){
        System.out.println("Getting Tasks of client:"+ clientId);
        return taskService.getClientTask(clientId);
    }
    @PutMapping("/task")
    public TaskDTO setTask(@RequestBody TaskDTO taskDTO){
        System.out.println("Setting Tasks of client:");
        return taskService.setTaskById(taskDTO);
    }

    @DeleteMapping("/task")
    public ResponseEntity<Task> deleteTask(@RequestBody TaskDTO taskDTO){
        System.out.println("Deleting Tasks :"+ taskDTO);
        return taskService.deleteTask(taskDTO);
    }
}
