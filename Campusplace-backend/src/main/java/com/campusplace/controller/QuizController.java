package com.campusplace.controller;

import com.campusplace.dto.CreateQuizRequest;
import com.campusplace.entity.Quiz;
import com.campusplace.entity.StudentResult;
import com.campusplace.entity.User;
import com.campusplace.service.QuizService;
import com.campusplace.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    private final QuizService quizService;
    private final UserService userService;

    @GetMapping("/student/list")
    public List<Quiz> getBranchQuizzes(Authentication authentication) {
        User user = userService.getLoggedInUser(authentication);
        return quizService.getActiveQuizzesByBranch(user.getBranch());
    }

    @PostMapping("/faculty/create")
    public String createQuiz(@RequestBody CreateQuizRequest request) {
        quizService.createQuiz(request);
        return "Quiz created successfully";
    }

    @GetMapping("/student/{quizId}")
    public Quiz getQuiz(@PathVariable Long quizId) {
        return quizService.getQuizWithQuestions(quizId);
    }

    @GetMapping("/{quizId}/leaderboard")
    public List<StudentResult> getLeaderboard(@PathVariable Long quizId) {
        return quizService.getLeaderboard(quizId);
    }
}