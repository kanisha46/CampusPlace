package com.campusplace.controller;

import com.campusplace.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping("/skills")
    public Map<String, Double> getSkills(Authentication auth) {
        return skillService.getStudentSkills(auth);
    }
}