package com.campusplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Link with User
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String firstName;
    private String lastName;
    private String mobile;
    private String gender;
    private String userType;

    // Student
    private String course;
    private String specialization;
    private Integer startYear;
    private Integer endYear;

    // Faculty
    private String facultyDept;
    private String designation;
    private Integer experience;
    private String qualification;

    @Column(length = 1000)
    private String about;

    @ElementCollection
    private List<String> skills;

    private String resumeFileName;
}