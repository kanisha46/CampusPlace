package com.campusplace.repository;

import com.campusplace.entity.Student;
import com.campusplace.entity.User; // Make sure to import your User entity
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);
}