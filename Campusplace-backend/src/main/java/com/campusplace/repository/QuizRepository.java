package com.campusplace.repository;

import com.campusplace.entity.Branch;
import com.campusplace.entity.Quiz;
import com.campusplace.entity.StudentResult;
import com.campusplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByBranchAndActiveTrue(Branch branch);
    @Query("SELECT q FROM Quiz q LEFT JOIN FETCH q.questions WHERE q.id = :id")
    Optional<Quiz> findQuizWithQuestions(@Param("id") Long id);
}