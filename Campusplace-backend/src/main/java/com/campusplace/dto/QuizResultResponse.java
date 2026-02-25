package com.campusplace.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class QuizResultResponse {
    private int score;
    private int totalQuestions;
    private List<Long> correctQuestionIds;
}