package com.campusplace.repository;

import com.campusplace.entity.Branch;
import com.campusplace.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByBranchAndActiveTrue(Branch branch);
}