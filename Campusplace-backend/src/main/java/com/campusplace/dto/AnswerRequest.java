package com.campusplace.dto;

import lombok.Data;

@Data
public class AnswerRequest {

    private Long questionId;
    private String selectedAnswer;
}