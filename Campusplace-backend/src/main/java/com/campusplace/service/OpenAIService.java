package com.campusplace.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "feature.openai.enabled", havingValue = "true")
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper;

    public JsonNode analyzeResume(String resumeText) {

        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        if (resumeText != null && resumeText.length() > 10000) {
            resumeText = resumeText.substring(0, 10000);
        }

        String prompt = """
                Analyze this resume and return JSON only:
                {
                  "overallScore": number,
                  "atsScore": number,
                  "contentScore": number,
                  "skillsScore": number,
                  "formatScore": number,
                  "styleScore": number,
                  "feedback": "detailed feedback",
                  "missingKeywords": []
                }

                Resume:
                """ + (resumeText == null ? "" : resumeText);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4o-mini");
        body.put("messages", new Object[]{
                Map.of("role", "user", "content", prompt)
        });

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(url, entity, String.class);

        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            String content = root.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            return objectMapper.readTree(content);

        } catch (Exception e) {
            throw new RuntimeException("Error parsing OpenAI response", e);
        }
    }
}