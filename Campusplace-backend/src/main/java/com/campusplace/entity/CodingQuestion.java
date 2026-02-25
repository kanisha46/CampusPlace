package com.campusplace.entity;


import jakarta.persistence.*;

@Entity
public class CodingQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Quiz quiz;

    private String title;

    @Column(length = 5000)
    private String problemStatement;

    private String expectedOutput;
}