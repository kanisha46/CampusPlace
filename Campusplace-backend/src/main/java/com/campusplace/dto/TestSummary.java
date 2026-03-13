package com.campusplace.dto;

import lombok.Data;

@Data
public class TestSummary {

    private Long id;
    private String quizTitle;
    private int score;
    private String subject;
    private String date;
}