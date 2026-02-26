package com.campusplace.controller;

import com.campusplace.dto.CreateQuizRequest;
import com.campusplace.dto.QuizListResponse;
import com.campusplace.dto.SubmitQuizRequest;
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
    public List<QuizListResponse> getBranchQuizzes(Authentication authentication) {
        User user = userService.getLoggedInUser(authentication);
        return quizService.getActiveQuizzesByBranch(user.getBranch());
    }

    @GetMapping("/student/{quizId}")
    public Quiz getQuiz(@PathVariable Long quizId) {
        return quizService.getQuizWithQuestions(quizId);
    }

    @PostMapping("/student/submit")
    public int submitQuiz(@RequestBody SubmitQuizRequest request,
                          Authentication authentication) {

        return quizService.evaluateQuiz(request, authentication);
    }

    @GetMapping("/{quizId}/leaderboard")
    public List<StudentResult> getLeaderboard(@PathVariable Long quizId) {
        return quizService.getLeaderboard(quizId);
    }
}