package com.campusplace.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicController {

    @GetMapping("/")
    public String welcome() {
        return "CampusPlace API is running successfully. Please visit the frontend website to use the application.";
    }

    @GetMapping("/health")
    public String health() {
        return "UP";
    }
}
