package com.campusplace.dto;

import com.campusplace.entity.Branch;
import lombok.Data;
import java.util.List;

@Data
public class CreateQuizRequest {

    private String title;
    private Branch branch;
    private String subject;
    private int durationMinutes;

    private List<QuestionRequest> questions;
}