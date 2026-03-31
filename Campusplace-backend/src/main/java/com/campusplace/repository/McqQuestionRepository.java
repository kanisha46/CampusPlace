package com.campusplace.repository;

import com.campusplace.entity.McqQuestion;
import com.campusplace.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface McqQuestionRepository extends JpaRepository<McqQuestion, Long> {
    List<McqQuestion> findByQuiz(Quiz quiz);
}