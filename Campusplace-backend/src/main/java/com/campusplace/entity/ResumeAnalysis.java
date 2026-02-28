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

    @Lob
    @Column(columnDefinition = "MEDIUMTEXT")
    private String extractedText;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String aiFeedback;


    private int overallScore;

    private int atsScore;
    private int contentScore;
    private int skillsScore;
    private int formatScore;
    private int styleScore;

    private LocalDateTime analyzedAt;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}