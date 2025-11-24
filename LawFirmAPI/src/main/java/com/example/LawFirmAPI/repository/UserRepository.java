package com.example.LawFirmAPI.repository;

import com.example.LawFirmAPI.model.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface  UserRepository extends JpaRepository<User,Long> {

    User findByUsername(String username);
    List<User> findByRole(String role);
    
}
