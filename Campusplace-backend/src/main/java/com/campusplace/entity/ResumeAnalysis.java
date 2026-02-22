package com.campusplace.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Column(length = 10000)
    private String extractedText;

    private int overallScore;

    private int atsScore;
    private int contentScore;
    private int skillsScore;
    private int formatScore;
    private int styleScore;

    @Column(length = 5000)
    private String aiFeedback;

    private LocalDateTime analyzedAt;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}