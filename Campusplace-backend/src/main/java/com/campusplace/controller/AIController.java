package com.campusplace.controller;

import com.campusplace.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/generate-answer")
    public Map<String,String> generateAnswer(@RequestBody Map<String,String> req){

        String question = req.get("question");

        String answer = aiService.generateAnswer(question);

        return Map.of("answer", answer);
    }
}