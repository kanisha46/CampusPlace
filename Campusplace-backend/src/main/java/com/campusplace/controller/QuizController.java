package com.campusplace.controller;

import com.campusplace.dto.CreateQuizRequest;
import com.campusplace.dto.QuizListResponse;
import com.campusplace.dto.SubmitQuizRequest;
import com.campusplace.entity.Quiz;
import com.campusplace.entity.StudentProfile;
import com.campusplace.entity.StudentResult;
import com.campusplace.entity.User;
import com.campusplace.repository.StudentProfileRepository;
import com.campusplace.service.QuizService;
import com.campusplace.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    private final QuizService quizService;
    private final UserService userService;
    private final StudentProfileRepository studentProfileRepository;

    @GetMapping("/student/list")
    public List<QuizListResponse> getBranchQuizzes(Authentication authentication) {
        User user = userService.getLoggedInUser(authentication);
        StudentProfile profile = studentProfileRepository
                .findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        return quizService.getActiveQuizzesByBranch(profile.getSpecialization());
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

    @GetMapping("/student/{quizId}/result")
    public ResponseEntity<?> getStudentResult(
            @PathVariable Long quizId,
            Authentication authentication
    ) {
        StudentResult result = quizService.getStudentResultForQuiz(quizId, authentication);
        if (result == null) {
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{quizId}/leaderboard")
    public List<StudentResult> getLeaderboard(@PathVariable Long quizId) {
        return quizService.getLeaderboard(quizId);
    }

    @GetMapping("/student/{quizId}/attempts")
    public long getAttemptCount(@PathVariable Long quizId, Authentication auth) {
        return quizService.getAttemptCount(quizId, auth);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createQuiz(@RequestBody CreateQuizRequest request) {
        quizService.createQuiz(request);
        return ResponseEntity.ok("Quiz created successfully");
    }

    @DeleteMapping("/delete/{quizId}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long quizId) {
        quizService.deleteQuiz(quizId);
        return ResponseEntity.ok("Quiz deleted successfully");
    }

    @PutMapping("/update/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable Long quizId, @RequestBody CreateQuizRequest request) {
        quizService.updateQuiz(quizId, request);
        return ResponseEntity.ok("Quiz updated successfully");
    }

    @GetMapping("/faculty/list")
    public List<QuizListResponse> getFacultyQuizzes(@RequestParam String dept) {
        return quizService.getActiveQuizzesByBranch(dept);
    }
}