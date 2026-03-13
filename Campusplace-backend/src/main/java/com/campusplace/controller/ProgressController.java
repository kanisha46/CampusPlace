package com.campusplace.controller;

import com.campusplace.dto.ProgressResponse;
import com.campusplace.entity.User;
import com.campusplace.repository.UserRepository;
import com.campusplace.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;
    private final UserRepository userRepository;

    @GetMapping
    public ProgressResponse getProgress(Authentication authentication){

        String email = authentication.getName();

        User student = userRepository.findByEmail(email)
                .orElseThrow();

        return progressService.getProgress(student);
    }
}