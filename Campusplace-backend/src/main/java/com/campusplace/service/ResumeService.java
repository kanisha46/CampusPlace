package com.campusplace.service;

import com.campusplace.entity.ResumeAnalysis;
import com.campusplace.entity.Student;
import com.campusplace.repository.ResumeAnalysisRepository;
import com.campusplace.repository.StudentRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "feature.resume.enabled", havingValue = "true")
public class ResumeService {

    // Optional so app doesn't fail if OpenAIService bean doesn't exist
    private final Optional<OpenAIService> openAIService;

    private final ResumeAnalysisRepository repository;
    private final StudentRepository studentRepository;

    public ResumeAnalysis analyze(MultipartFile file, String email) {

        String text = extractText(file);

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // If OpenAI is disabled, save a "disabled" analysis (no crash)
        if (openAIService.isEmpty()) {
            ResumeAnalysis analysis = ResumeAnalysis.builder()
                    .fileName(file.getOriginalFilename())
                    .extractedText(text)
                    .overallScore(0)
                    .atsScore(0)
                    .contentScore(0)
                    .skillsScore(0)
                    .formatScore(0)
                    .styleScore(0)
                    .aiFeedback("OpenAI analysis is currently disabled.")
                    .analyzedAt(LocalDateTime.now())
                    .student(student)
                    .build();

            return repository.save(analysis);
        }

        // OpenAI enabled
        JsonNode aiResult = openAIService.get().analyzeResume(text);

        ResumeAnalysis analysis = ResumeAnalysis.builder()
                .fileName(file.getOriginalFilename())
                .extractedText(text)
                .overallScore(aiResult.path("overallScore").asInt(0))
                .atsScore(aiResult.path("atsScore").asInt(0))
                .contentScore(aiResult.path("contentScore").asInt(0))
                .skillsScore(aiResult.path("skillsScore").asInt(0))
                .formatScore(aiResult.path("formatScore").asInt(0))
                .styleScore(aiResult.path("styleScore").asInt(0))
                .aiFeedback(aiResult.path("feedback").asText("No feedback"))
                .analyzedAt(LocalDateTime.now())
                .student(student)
                .build();

        return repository.save(analysis);
    }

    public List<ResumeAnalysis> getHistory(String email) {

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return repository.findByStudentId(student.getId());
    }

    public String extractText(MultipartFile file) {
        try (PDDocument document = PDDocument.load(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (Exception e) {
            throw new RuntimeException("Error extracting PDF", e);
        }
    }
}