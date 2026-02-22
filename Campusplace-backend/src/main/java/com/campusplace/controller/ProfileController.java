package com.campusplace.controller;

import com.campusplace.dto.ProfileRequest;
import com.campusplace.dto.ProfileResponse;
import com.campusplace.entity.StudentProfile;
import com.campusplace.entity.User;
import com.campusplace.repository.StudentProfileRepository;
import com.campusplace.repository.UserRepository;
import com.campusplace.service.ProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final StudentProfileRepository profileRepo;
    private final UserRepository userRepo;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveProfile(
            @RequestPart("profile") String profileJson,
            @RequestPart(value = "resume", required = false) MultipartFile resume,
            @RequestPart(value = "semResults", required = false) List<MultipartFile> semResults,
            Principal principal
    ) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        ProfileRequest dto = mapper.readValue(profileJson, ProfileRequest.class);

        User user = userRepo.findByEmail(principal.getName())
                .orElseThrow();

        StudentProfile profile = profileRepo.findByUser(user)
                .orElse(new StudentProfile());

        profile.setUser(user);
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        profile.setUsername(dto.getUsername());
        profile.setMobile(dto.getMobile());
        profile.setGender(dto.getGender());
        profile.setUserType(dto.getUserType());
        profile.setCourse(dto.getCourse());
        profile.setSpecialization(dto.getSpecialization());
        profile.setStartYear(dto.getStartYear());
        profile.setEndYear(dto.getEndYear());
        profile.setAbout(dto.getAbout());
        profile.setSkills(String.join(",", dto.getSkills()));

        if (resume != null && !resume.isEmpty()) {
            String fileName = resume.getOriginalFilename();
            resume.transferTo(new File("uploads/" + fileName));
            profile.setResumeFileName(fileName);
        }

        profileRepo.save(profile);

        return ResponseEntity.ok("Profile saved successfully");
    }

    @GetMapping
    public ResponseEntity<?> getProfile(Principal principal) {

        User user = userRepo.findByEmail(principal.getName())
                .orElseThrow();

        StudentProfile profile = profileRepo.findByUser(user)
                .orElse(null);

        return ResponseEntity.ok(profile);
    }
}