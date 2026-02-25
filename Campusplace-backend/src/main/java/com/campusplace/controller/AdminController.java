package com.campusplace.controller;

import com.campusplace.dto.SubmitQuizRequest;
import com.campusplace.service.AuthService;
import com.campusplace.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AuthService authService;
    private final QuizService quizService;  // ✅ ADD THIS

    @DeleteMapping("/delete/{email}")
    public String deleteUser(@PathVariable String email) {
        authService.deleteUser(email);
        return "User deleted successfully";
    }

    @PutMapping("/promote/{email}")
    public String promoteUser(@PathVariable String email) {
        authService.promoteUser(email);
        return "User promoted successfully";
    }

    @PostMapping("/student/submit")
    public int submitQuiz(@RequestBody SubmitQuizRequest request,
                          Authentication authentication) {

        return quizService.evaluateQuiz(request, authentication);
    }
}