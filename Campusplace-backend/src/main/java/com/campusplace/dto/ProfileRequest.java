package com.campusplace.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProfileRequest {

    private String firstName;
    private String lastName;
    private String username;
    private String mobile;
    private String gender;
    private String userType;

    private String course;
    private String specialization;
    private String startYear;   // MUST BE STRING
    private String endYear;     // MUST BE STRING

    private String facultyDept;
    private String designation;
    private String experience;
    private String qualification;

    private String about;
    private List<String> skills;

    private String currentCgpa;
    private String twelfthPercentile;

    private String hasInternship;
    private String hasHackathon;
    private String hackathonDetails;
    private String hasBacklogs;
    private String backlogCount;

    private String leetcodePercentile;
    private String leetcodeAccLink;
    private String leetcodeRank;

    private String githubLink;
    private String linkedinLink;
}