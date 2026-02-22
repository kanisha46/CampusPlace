package com.campusplace.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProfileResponse {

    private String username;
    private String email;

    private String firstName;
    private String lastName;
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

    private String about;
    private List<String> skills;

    private String resumeFileName;
}