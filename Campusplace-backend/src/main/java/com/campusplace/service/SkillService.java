package com.campusplace.service;

import com.campusplace.entity.StudentResult;
import com.campusplace.entity.User;
import com.campusplace.repository.StudentResultRepository;
import com.campusplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final StudentResultRepository resultRepo;
    private final UserRepository userRepo;

    public Map<String, Double> getStudentSkills(Authentication auth) {

        User student = userRepo.findByEmail(auth.getName()).orElseThrow();

        List<StudentResult> results = resultRepo.findByStudentOrderBySubmittedAtDesc(student);

        Map<String, List<Integer>> subjectScores = new HashMap<>();

        // Group scores by subject
        for (StudentResult r : results) {
            String subject = r.getQuiz().getSubject();
            subjectScores.putIfAbsent(subject, new ArrayList<>());
            subjectScores.get(subject).add(r.getScore());
        }

        // Convert to avg and scale to /10
        Map<String, Double> finalSkills = new HashMap<>();

        for (String subject : subjectScores.keySet()) {

            List<Integer> scores = subjectScores.get(subject);

            double avg = scores.stream().mapToInt(i -> i).average().orElse(0);

            // assuming total questions = 10 (adjust if needed)
            double percentage = (avg / 10.0) * 100;

            double outOf10 = (percentage / 100.0) * 10;

            finalSkills.put(subject, Math.round(outOf10 * 10.0) / 10.0);
        }

        return finalSkills;
    }
}