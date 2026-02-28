package com.campusplace.service;

import com.campusplace.entity.ResumeAnalysis;
import com.campusplace.entity.Student;
import com.campusplace.repository.ResumeAnalysisRepository;
import com.campusplace.repository.StudentRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeService {
    private final OpenAIService openAIService;
    private final ResumeAnalysisRepository repository;
    private final StudentRepository studentRepository;

    public ResumeAnalysis analyze(MultipartFile file, String email) {
        // Use try-with-resources to ensure the PDF is ALWAYS closed
        try (PDDocument doc = PDDocument.load(file.getBytes())) {
            // 1. Extract Text
            String text = new PDFTextStripper().getText(doc);

            // 2. Identify Student
            Student student = studentRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User record not found for: " + email));

            // 3. AI Analysis via Groq
            JsonNode ai = openAIService.analyzeResume(text);

            // 4. Build and Save
            ResumeAnalysis analysis = ResumeAnalysis.builder()
                    .student(student)
                    .fileName(file.getOriginalFilename())
                    .extractedText(text)
                    .overallScore(ai.path("overallScore").asInt(0))
                    .atsScore(ai.path("atsScore").asInt(0))
                    .aiFeedback(ai.path("feedback").asText())
                    .analyzedAt(LocalDateTime.now())
                    .build();

            return repository.save(analysis);
        } catch (Exception e) {
            // Log for debugging loop failures
            System.err.println("Analysis Loop Error: " + e.getMessage());
            throw new RuntimeException("Service Error: " + e.getMessage());
        }
    }

    public List<ResumeAnalysis> getHistory(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return repository.findByStudentIdOrderByAnalyzedAtDesc(student.getId());
    }
}