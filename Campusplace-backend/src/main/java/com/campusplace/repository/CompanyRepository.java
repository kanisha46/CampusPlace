package com.campusplace.repository;

import com.campusplace.entity.Company; // Resolves the 'Company' symbol
import org.springframework.data.jpa.repository.JpaRepository; // Resolves the 'JpaRepository' symbol
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    // Your existing methods here
}