package com.campusplace.service;

import com.campusplace.entity.Question;
import com.campusplace.repository.QuestionBankRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionBankService {

    @Autowired
    private QuestionBankRepository repository;

    public List<Question> getFilteredQuestions(Long companyId, String branch, String round, String type, String difficulty, String search) {
        return repository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Efficiently join the Company table to get names
            root.fetch("company", jakarta.persistence.criteria.JoinType.LEFT);

            // Filter by Company
            if (companyId != null) {
                predicates.add(cb.equal(root.get("companyId"), companyId));
            }
            // Filter by Branch (IT, CE, MECHANICAL, etc.)
            if (branch != null && !branch.isEmpty()) {
                predicates.add(cb.equal(root.get("branch"), branch));
            }
            // Filter by Round (Technical, HR, etc.)
            if (round != null && !round.isEmpty()) {
                predicates.add(cb.equal(root.get("roundName"), round));
            }
            // Filter by Question Type (MCQ, Coding)
            if (type != null && !type.isEmpty()) {
                predicates.add(cb.equal(root.get("questionType"), type));
            }
            // Filter by Difficulty (Easy, Medium, Hard)
            if (difficulty != null && !difficulty.isEmpty()) {
                predicates.add(cb.equal(root.get("difficulty"), difficulty));
            }
            // Filter by Search Text (Matches keywords inside the question)
            if (search != null && !search.isEmpty()) {
                predicates.add(cb.like(root.get("questionText"), "%" + search + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        });
    }
}