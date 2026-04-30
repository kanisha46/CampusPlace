package com.campusplace.service;

import com.campusplace.dto.ProgressResponse;
import com.campusplace.dto.TestSummary;
import com.campusplace.entity.StudentResult;
import com.campusplace.entity.User;
import com.campusplace.repository.StudentResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final StudentResultRepository repo;

    public ProgressResponse getProgress(User student){

        List<StudentResult> results = repo.findByStudentOrderBySubmittedAtDesc(student);

        ProgressResponse res = new ProgressResponse();

        if(results.isEmpty()) return res;

        res.setTotalTests(results.size());

        double avgScore = results.stream()
                .mapToInt(StudentResult::getScore)
                .average()
                .orElse(0);

        int highest = results.stream()
                .mapToInt(StudentResult::getScore)
                .max()
                .orElse(0);

        int lowest = results.stream()
                .mapToInt(StudentResult::getScore)
                .min()
                .orElse(0);

        res.setAverageScore(avgScore);
        res.setHighestScore(highest);
        res.setLowestScore(lowest);

        List<TestSummary> recent = new ArrayList<>();

        results.stream().limit(5).forEach(r -> {

            TestSummary t = new TestSummary();

            t.setId(r.getId());
            t.setQuizTitle(r.getQuiz().getTitle());
            t.setScore(r.getScore());
            t.setSubject(r.getQuiz().getSubject());
            t.setDate(r.getSubmittedAt().toString());

            recent.add(t);

        });

        res.setRecentTests(recent);

        // ✅ Strong & Weak topic from actual results
        results.stream()
                .max(Comparator.comparingInt(StudentResult::getScore))
                .ifPresent(r -> res.setStrongTopic(r.getQuiz().getTitle()));

        results.stream()
                .min(Comparator.comparingInt(StudentResult::getScore))
                .ifPresent(r -> res.setWeakTopic(r.getQuiz().getTitle()));

        return res;
    }
}