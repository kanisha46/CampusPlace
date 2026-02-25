package com.campusplace.repository;

import com.campusplace.entity.McqQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface McqQuestionRepository extends JpaRepository<McqQuestion, Long> {
}