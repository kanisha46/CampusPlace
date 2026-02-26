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

    public List<Question> getFilteredQuestions(
            Long companyId,
            String branch,
            String round,
            String type,
            String difficulty,
            String search) {

        return repository.findAll((root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            root.fetch("company", jakarta.persistence.criteria.JoinType.LEFT);

            if (companyId != null) {
                predicates.add(
                        cb.equal(root.get("company").get("id"), companyId)
                );
            }

            if (branch != null && !branch.isEmpty()) {
                predicates.add(cb.equal(root.get("branch"), branch));
            }

            if (round != null && !round.isEmpty()) {
                predicates.add(cb.equal(root.get("roundName"), round));
            }

            if (type != null && !type.isEmpty()) {
                predicates.add(cb.equal(root.get("questionType"), type));
            }

            if (difficulty != null && !difficulty.isEmpty()) {
                predicates.add(cb.equal(root.get("difficulty"), difficulty));
            }

            if (search != null && !search.isEmpty()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("questionText")),
                                "%" + search.toLowerCase() + "%"
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        });
    }
}