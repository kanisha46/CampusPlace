package com.campusplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizListResponse {

    private Long id;
    private String title;
    private String subject;
    private int durationMinutes;
}