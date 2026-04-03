package com.campusplace.service;

import com.campusplace.entity.ResumeAnalysis;
import com.campusplace.entity.Student;
import com.campusplace.repository.ResumeAnalysisRepository;
import com.campusplace.repository.StudentRepository;
import com.campusplace.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import com.campusplace.entity.User;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class ResumeService {
    private final OpenAIService openAIService;
    private final ResumeAnalysisRepository repository;
    private final UserRepository userRepository;

    public Map<String, Object> analyze(MultipartFile file, String email) {
        try (PDDocument doc = PDDocument.load(file.getBytes())) {
            String text = new PDFTextStripper().getText(doc);

            // 1️⃣ Find user (This exists in your DB!)
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));

            // 2️⃣ AI analysis
            JsonNode ai = openAIService.analyzeResume(text);

            // 3️⃣ Build with User instead of Student
            ResumeAnalysis analysis = ResumeAnalysis.builder()
                    .user(user) // ⬅️ Changed from .student(student)
                    .fileName(file.getOriginalFilename())
                    .extractedText(text)
                    .overallScore(ai.path("overallScore").asInt(0))
                    .atsScore(ai.path("atsScore").asInt(0))
                    .aiFeedback(ai.path("feedback").asText())
                    .analyzedAt(LocalDateTime.now())
                    .build();

            // Set the Transient detailedAnalysis so the frontend receives the full parsed JSON
            analysis.setDetailedAnalysis(ai);

            ResumeAnalysis saved = repository.save(analysis);

            // Create a Map to guarantee Jackson serializes everything properly
            Map<String, Object> response = new HashMap<>();
            response.put("id", saved.getId());
            response.put("overallScore", saved.getOverallScore());
            response.put("atsScore", saved.getAtsScore());
            response.put("detailedAnalysis", ai);

            System.out.println("🤖 AI RETURNED ATS SCORE: " + saved.getAtsScore());

            return response;

        } catch (Exception e) {
            System.err.println("Analysis Error: " + e.getMessage());
            throw new RuntimeException("Service Error: " + e.getMessage());
        }
    }
}