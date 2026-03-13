package com.campusplace.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProgressResponse {

    private int totalTests;
    private double averageScore;
    private int highestScore;
    private int lowestScore;

    private List<TestSummary> recentTests;
}