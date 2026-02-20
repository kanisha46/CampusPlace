package com.campusplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String industry;
    private String location;
    private String branch;
    private String website;

    @Column(length = 1000)
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "total_openings")
    private int totalOpenings;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Job> jobs;
}