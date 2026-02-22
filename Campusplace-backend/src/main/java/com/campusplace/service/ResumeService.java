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

        String text = extractText(file);

        JsonNode aiResult = openAIService.analyzeResume(text);

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        ResumeAnalysis analysis = ResumeAnalysis.builder()
                .fileName(file.getOriginalFilename())
                .extractedText(text)
                .overallScore(aiResult.get("overallScore").asInt())
                .atsScore(aiResult.get("atsScore").asInt())
                .contentScore(aiResult.get("contentScore").asInt())
                .skillsScore(aiResult.get("skillsScore").asInt())
                .formatScore(aiResult.get("formatScore").asInt())
                .styleScore(aiResult.get("styleScore").asInt())
                .aiFeedback(aiResult.get("feedback").asText())
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