package com.campusplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Basic
    private String firstName;
    private String lastName;
    private String username;
    private String mobile;
    private String gender;
    private String userType;

    private String course;
    private String specialization;
    private String startYear;
    private String endYear;

    private String facultyDept;
    private String designation;
    private String experience;
    private String qualification;

    @Column(length = 2000)
    private String about;

    // Education
    private String currentCgpa;
    private String twelfthPercentile;

    private String hasInternship;
    private String internshipCertFileName;

    private String hasHackathon;
    private String hackathonDetails;

    private String hasBacklogs;
    private String backlogCount;

    private String leetcodePercentile;
    private String leetcodeAccLink;
    private String leetcodeRank;

    private String githubLink;
    private String linkedinLink;

    private String resumeFileName;

    private String skills;

    @ElementCollection
    private List<String> semResultsFileNames;

    // ✅ IMPORTANT FIELD
    private boolean profileCompleted = false;
}