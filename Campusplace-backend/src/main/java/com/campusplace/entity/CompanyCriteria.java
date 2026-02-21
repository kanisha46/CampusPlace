package com.campusplace.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyCriteria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double minCgpa;
    private boolean noActiveBacklogs;
    private String allowedBranches;

    @OneToOne
    @JoinColumn(name = "company_id")
    @JsonBackReference   // ✅ ADD THIS
    private Company company;
}