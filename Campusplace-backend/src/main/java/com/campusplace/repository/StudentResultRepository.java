package com.campusplace.repository;

import com.campusplace.entity.Quiz;
import com.campusplace.entity.StudentResult;
import com.campusplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentResultRepository extends JpaRepository<StudentResult, Long> {

    long countByStudentAndQuiz(User student, Quiz quiz);

    List<StudentResult> findByStudentAndQuizOrderBySubmittedAtDesc(User student, Quiz quiz);

    List<StudentResult> findByQuizOrderByScoreDesc(Quiz quiz);

    Optional<StudentResult> findByStudentAndQuiz(User student, Quiz quiz);
}