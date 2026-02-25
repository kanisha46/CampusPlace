package com.campusplace.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "question_bank")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id")
    private Long companyId;

    // --- CRITICAL MAPPING FOR COMPANY NAME ---
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", insertable = false, updatable = false)
    private Company company;

    @JsonProperty("companyName")
    public String getCompanyName() {
        return company != null ? company.getName() : "N/A";
    }
    // -----------------------------------------

    private String branch;
    private String roundName;
    private String questionType;
    private String difficulty;

    @Column(columnDefinition = "TEXT")
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String answerText;

    private Long createdBy; // Keeps numeric ID to avoid Error 1366

    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;
}