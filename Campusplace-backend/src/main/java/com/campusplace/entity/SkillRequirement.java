package com.campusplace.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class SkillRequirement {

    private String name;     // Java, DSA, Spring Boot
    private double minScore; // out of 10
}