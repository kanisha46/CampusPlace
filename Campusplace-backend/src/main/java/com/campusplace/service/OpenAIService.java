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

        // Updated prompt to include ATS Score, Actionable Improvements mapping, and precise tracking arrays
        String prompt = "Analyze this resume text strictly. " +
                "1. Identify specific projects (projectsFound). If no projects are found, the overallScore MUST be below 50. " +
                "2. Identify technical skills (skills) and specifically point out missing baseline skills (missingSkills). " +
                "3. Based ONLY on the evidence in the text, calculate a unique overallScore and a separate atsScore (0-100). " +
                "4. Suggest 3 concrete actionable improvements as array of strings like 'Change X to Y' or 'Modify Z to highlight Q' (improvements). " +
                "5. Suggest a concise study focus area (studyFocus) and 3 suitable roles with match percentage (suitableRoles: [{role, match}]). " +
                "Return JSON ONLY: { \"overallScore\": 0, \"atsScore\": 0, \"projectsFound\": [], \"skills\": [], \"missingSkills\": [], \"suitableRoles\": [{\"role\":\"\",\"match\":0}], \"studyFocus\": \"\", \"improvements\": [], \"feedback\": \"\" } " +
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