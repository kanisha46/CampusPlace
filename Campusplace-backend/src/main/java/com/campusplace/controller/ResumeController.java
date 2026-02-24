package com.campusplace.controller;

import com.campusplace.entity.ResumeAnalysis;
import com.campusplace.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/analyze")
    public ResponseEntity<ResumeAnalysis> analyze(
            @RequestParam("file") MultipartFile file,
            Principal principal
    ) {
        return ResponseEntity.ok(
                resumeService.analyze(file, principal.getName())
        );
    }

    @GetMapping("/history")
    public ResponseEntity<List<ResumeAnalysis>> history(
            Principal principal
    ){
            System.out.println("Principal: " + principal);

        return ResponseEntity.ok(
                resumeService.getHistory(principal.getName())
        );
    }
}