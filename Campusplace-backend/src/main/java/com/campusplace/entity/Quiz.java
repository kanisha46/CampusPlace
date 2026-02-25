package com.campusplace.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter   // 🔥 VERY IMPORTANT
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Enumerated(EnumType.STRING)
    private Branch branch;

    private String subject;

    private int durationMinutes;

    private boolean active;
}