package com.campusplace.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Value("${groq.api.key}")
    private String apiKey;

    public String generateAnswer(String question) {

        try {

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String,Object> message = Map.of(
                    "role","user",
                    "content","Explain this technical interview question clearly with example:\n" + question
            );

            Map<String,Object> requestBody = Map.of(
                    "model","llama3-8b-8192",
                    "messages", List.of(message)
            );

            HttpEntity<Map<String,Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://api.groq.com/openai/v1/chat/completions",
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            Map responseBody = response.getBody();

            List choices = (List) responseBody.get("choices");
            Map choice = (Map) choices.get(0);
            Map messageRes = (Map) choice.get("message");

            return messageRes.get("content").toString();

        } catch(Exception e) {

            e.printStackTrace();
            return "AI generation failed. Check backend logs.";
        }
    }
}