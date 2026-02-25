package com.campusplace.dto;

import lombok.Data;

@Data
public class QuestionRequest {

    private String question;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer;
}