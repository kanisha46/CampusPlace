package com.campusplace.repository;

import com.campusplace.entity.StudentResult;
import com.campusplace.entity.User;
import com.campusplace.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface StudentResultRepository extends JpaRepository<StudentResult, Long> {

    Optional<StudentResult> findByStudentAndQuiz(User student, Quiz quiz);

    List<StudentResult> findByQuizOrderByScoreDesc(Quiz quiz);
}