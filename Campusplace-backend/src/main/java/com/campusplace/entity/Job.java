package com.campusplace.entity;

import jakarta.persistence.*;

@Entity
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;

    private String packageOffered;

    @Column(length = 1500)
    private String description;

    private int totalOpenings;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    // getters and setters
}