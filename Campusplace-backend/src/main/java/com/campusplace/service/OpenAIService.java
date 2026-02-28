package com.campusplace.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OpenAIService {

    @Value("${groq.api.key}") // Add groq.api.key=gsk_... to application.properties
    private String apiKey;

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    public JsonNode analyzeResume(String resumeText) {
        // Groq is OpenAI-compatible
        String url = "https://api.groq.com/openai/v1/chat/completions";

        // Updated prompt to include projects, missing skills, and study focus
        String prompt = "Analyze this resume text strictly. " +
                "1. Identify specific projects. If no projects are found, the score MUST be below 50. " +
                "2. Identify technical skills. " +
                "3. Based ONLY on the evidence in the text, calculate a unique overallScore. " +
                "DO NOT return 85 unless it is perfectly earned. " +
                "Return JSON: { \"overallScore\": 0, \"projectsFound\": [], \"skills\": [], \"feedback\": \"\" } " +
                "Resume text: " + resumeText;

        Map<String, Object> body = Map.of(
                "model", "llama-3.3-70b-versatile", // High-performance free model
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "response_format", Map.of("type", "json_object")
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey); // Fixes authentication error
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            String content = root.path("choices").get(0).path("message").path("content").asText();
            return objectMapper.readTree(content);
        } catch (Exception e) {
            throw new RuntimeException("AI Analysis Failed: " + e.getMessage());
        }
    }
}