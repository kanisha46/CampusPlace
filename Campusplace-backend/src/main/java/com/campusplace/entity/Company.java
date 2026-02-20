package com.campusplace.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

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

    private String salaryPackage;
    private String driveDate;
    private String roles;

    @Column(length = 1000)
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "total_openings")
    private int totalOpenings;

    /* 🔥 IMPORTANT PART */
    @OneToOne(mappedBy = "company", cascade = CascadeType.ALL)
    @JsonManagedReference
    private CompanyCriteria criteria;
}