package com.campusplace.service;

import com.campusplace.dto.*;
import com.campusplace.entity.*;
import com.campusplace.repository.McqQuestionRepository;
import com.campusplace.repository.QuizRepository;
import com.campusplace.repository.StudentResultRepository;
import com.campusplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final McqQuestionRepository questionRepository;
    private final StudentResultRepository studentResultRepository;
    private final UserRepository userRepository;

    // ✅ CREATE QUIZ
    public void createQuiz(CreateQuizRequest request) {

        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setBranch(request.getBranch());
        quiz.setSubject(request.getSubject());
        quiz.setDurationMinutes(request.getDurationMinutes());
        quiz.setActive(true);

        quizRepository.save(quiz);

        for (QuestionRequest q : request.getQuestions()) {

            McqQuestion question = new McqQuestion();
            question.setQuiz(quiz);
            question.setQuestion(q.getQuestion());
            question.setOptionA(q.getOptionA());
            question.setOptionB(q.getOptionB());
            question.setOptionC(q.getOptionC());
            question.setOptionD(q.getOptionD());
            question.setCorrectAnswer(q.getCorrectAnswer());

            questionRepository.save(question);
        }
    }

    public int evaluateQuiz(SubmitQuizRequest request, Authentication authentication) {

        User student = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        Quiz quiz = quizRepository
                .findById(request.getQuizId())
                .orElseThrow();

        // 🔥 PREVENT MULTIPLE ATTEMPTS
        if (studentResultRepository.findByStudentAndQuiz(student, quiz).isPresent()) {
            throw new RuntimeException("You already attempted this quiz");
        }

        int score = 0;

        for (AnswerRequest ans : request.getAnswers()) {

            McqQuestion question = questionRepository
                    .findById(ans.getQuestionId())
                    .orElseThrow();

            if (question.getCorrectAnswer()
                    .equalsIgnoreCase(ans.getSelectedAnswer())) {
                score++;
            }
        }

        // 🔥 SAVE RESULT
        StudentResult result = StudentResult.builder()
                .student(student)
                .quiz(quiz)
                .score(score)
                .submittedAt(LocalDateTime.now())
                .build();

        studentResultRepository.save(result);

        return score;
    }
    public List<QuizListResponse> getActiveQuizzesByBranch(Branch branch) {

        return quizRepository.findByBranchAndActiveTrue(branch)
                .stream()
                .map(q -> new QuizListResponse(
                        q.getId(),
                        q.getTitle(),
                        q.getSubject(),
                        q.getDurationMinutes()
                ))
                .toList();
    }

    public Quiz getQuizWithQuestions(Long quizId) {
        return quizRepository.findQuizWithQuestions(quizId)
                .orElseThrow();
    }

    public List<StudentResult> getLeaderboard(Long quizId) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        return studentResultRepository.findByQuizOrderByScoreDesc(quiz);
    }

    public StudentResult getStudentResultForQuiz(Long quizId, Authentication auth) {

        User student = userRepository
                .findByEmail(auth.getName())
                .orElseThrow();

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow();

        return studentResultRepository
                .findByStudentAndQuiz(student, quiz)
                .orElseThrow(() -> new RuntimeException("Not attempted"));
    }

}