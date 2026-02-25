package com.campusplace.controller;

import com.campusplace.dto.ProfileRequest;
import com.campusplace.entity.*;
import com.campusplace.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping(consumes = {"multipart/form-data"})
    public String saveProfile(
            @RequestPart("profile") String profileJson,
            @RequestPart(value = "resume", required = false) MultipartFile resume,
            Authentication authentication
    ) throws Exception {

        ProfileRequest dto = objectMapper.readValue(profileJson, ProfileRequest.class);

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        // ================= SAVE BRANCH TO USER =================
        if (dto.getSpecialization() != null) {
            user.setBranch(
                    Branch.valueOf(dto.getSpecialization().toUpperCase())
            );
            userRepository.save(user);
        }

        StudentProfile profile =
                profileRepository.findByUser(user)
                        .orElse(new StudentProfile());

        profile.setUser(user);
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        profile.setUsername(dto.getUsername());
        profile.setMobile(dto.getMobile());
        profile.setGender(dto.getGender());
        profile.setCourse(dto.getCourse());
        profile.setSpecialization(dto.getSpecialization());
        profile.setStartYear(dto.getStartYear());
        profile.setEndYear(dto.getEndYear());
        profile.setCurrentCgpa(dto.getCurrentCgpa());
        profile.setTwelfthPercentile(dto.getTwelfthPercentile());
        profile.setAbout(dto.getAbout());

        if (dto.getSkills() != null) {
            profile.setSkills(String.join(",", dto.getSkills()));
        }

        profile.setGithubLink(dto.getGithubLink());
        profile.setLinkedinLink(dto.getLinkedinLink());

        // ================= SAVE RESUME FILE =================
        if (resume != null && !resume.isEmpty()) {

            String uploadDir = "uploads/";
            Files.createDirectories(Paths.get(uploadDir));

            String fileName = System.currentTimeMillis() + "_" + resume.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);

            resume.transferTo(filePath);

            profile.setResumeFileName(fileName);
        }

        profileRepository.save(profile);

        return "Profile saved successfully";
    }

    @GetMapping
    public StudentProfile getProfile(Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        return profileRepository.findByUser(user).orElse(null);
    }
}