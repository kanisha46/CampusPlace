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

    // 🔥 Link profile to user (very important)
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Basic Details
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

    // About
    @Column(length = 2000)
    private String about;

    // Skills (store as comma-separated string)
    @Column(length = 2000)
    private String skills;

    // Resume
    private String resumeFileName;

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

    @Column(length = 2000)
    private String semResultsFileNames;
}