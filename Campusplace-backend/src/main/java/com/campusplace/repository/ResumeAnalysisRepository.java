package com.campusplace.repository;

import com.campusplace.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    // Update this to use 'UserId' instead of 'StudentId'
    List<ResumeAnalysis> findByUserIdOrderByAnalyzedAtDesc(Long userId);
}