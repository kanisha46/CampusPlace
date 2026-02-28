package com.campusplace.controller;

import com.campusplace.entity.ResumeAnalysis;
import com.campusplace.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;   // ✅ CORRECT IMPORT
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(resumeService.analyze(file, email));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(resumeService.getHistory(email));
    }
}