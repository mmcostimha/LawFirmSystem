package com.example.LawFirmAPI.service.Task;


import com.example.LawFirmAPI.exceptions.ResourceNotFound;
import com.example.LawFirmAPI.model.Task.Task;
import com.example.LawFirmAPI.model.Task.TaskDTO;
import com.example.LawFirmAPI.model.User.User;
import com.example.LawFirmAPI.repository.TaskRepository;
import com.example.LawFirmAPI.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository){
        this.taskRepository = taskRepository;
        this.userRepository= userRepository;
    }

    public TaskDTO newClientTask(TaskDTO task){
        //System.out.println("Entrei no Service para criar");

        Long clientId = task.clientId();
        //Check client
        Optional<User> user = userRepository.findById(clientId);

        if(user.isEmpty())
            throw  new ResourceNotFound("User "+clientId+" not found: Cant create a Task");

        //Create Task
        Task newTask = new Task(user.get(),task.task());
        taskRepository.save(newTask);

        return new TaskDTO(
                newTask.getId(),
                user.get().getId(),
                newTask.getTask(),
                newTask.getCreationDate(),
                newTask.getState()
        );
    }
    public List<Task> getClientTask(Long clientId){
        //Check client
        Optional<User> user = userRepository.findById(clientId);
        if(user.isEmpty())
            throw  new ResourceNotFound("User "+clientId+" not found: Cant get the Tasks");

        return user.get().getTask();
    }

    public TaskDTO setTaskById(TaskDTO taskDTO){
        Optional<Task> taskOptional = taskRepository.findById(taskDTO.id());

        if(taskOptional.isEmpty())
            throw  new ResourceNotFound("Task "+taskDTO.id()+" not found: Cant change the Task");

        Task task= taskOptional.get();
        task.setState(taskDTO.state());
        taskRepository.save(task);
        //System.out.println("Task"+task.toString());
        return new TaskDTO(
            task.getId(),
            taskDTO.clientId(),
            task.getTask(),
            task.getCreationDate(),
            task.getState()
        );
    }
    public ResponseEntity<Task> deleteTask(TaskDTO taskDTO){
        Optional<Task> taskOptional = taskRepository.findById(taskDTO.id());
        if(taskOptional.isEmpty())
            throw  new ResourceNotFound("Task "+taskDTO.id()+" not found: Cant change the Task");

        Task task = taskOptional.get();
        taskRepository.delete(task);

        return ResponseEntity.ok(task);
    }
}
