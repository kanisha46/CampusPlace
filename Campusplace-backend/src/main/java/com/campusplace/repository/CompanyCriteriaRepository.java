package com.campusplace.repository;

import com.campusplace.entity.CompanyCriteria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyCriteriaRepository
        extends JpaRepository<CompanyCriteria, Long> {

    Optional<CompanyCriteria> findByCompany_Id(Long companyId);
}