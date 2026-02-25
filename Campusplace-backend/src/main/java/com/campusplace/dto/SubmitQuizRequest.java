package com.campusplace.dto;

import lombok.Data;

import java.util.List;

@Data
public class SubmitQuizRequest {

    private Long quizId;
    private List<AnswerRequest> answers;
}