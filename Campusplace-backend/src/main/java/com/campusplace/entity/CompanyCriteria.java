package com.campusplace.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "company_criteria")
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

    @Column(length = 200)
    private String allowedBranches;

    @OneToOne
    @JoinColumn(name = "company_id", nullable = false, unique = true)
    @JsonBackReference
    private Company company;
}