package com.campusplace.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;   // ✅ REQUIRED FOR LOGIN

    @Column(nullable = false)
    private String password; // ✅ REQUIRED FOR JWT LOGIN

    private String branch;

    private double cgpa;

    private int backlogs;
}