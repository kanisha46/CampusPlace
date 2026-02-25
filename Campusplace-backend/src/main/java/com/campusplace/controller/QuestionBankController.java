package com.campusplace.controller;

import com.campusplace.entity.Question;
import com.campusplace.service.QuestionBankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionBankController {
    @Autowired
    private QuestionBankService service;

    @GetMapping("/filter")
    public List<Question> filter(
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String round,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String difficulty) {
        return service.getFilteredQuestions(companyId, branch, round, type, difficulty);
    }
}