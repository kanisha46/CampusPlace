package com.campusplace.controller;

import com.campusplace.dto.ProfileRequest;
import com.campusplace.dto.ProfileResponse;
import com.campusplace.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    public ProfileResponse saveProfile(@RequestBody ProfileRequest request) {
        return profileService.saveProfile(request);
    }

    @GetMapping
    public ProfileResponse getProfile() {
        return profileService.getProfile();
    }

    @PostMapping("/upload-resume")
    public String uploadResume(@RequestParam("file") MultipartFile file)
            throws IOException {

        String uploadDir = "uploads/";
        File directory = new File(uploadDir);
        if (!directory.exists()) directory.mkdirs();

        String filePath = uploadDir + file.getOriginalFilename();
        file.transferTo(new File(filePath));

        profileService.saveResumeFileName(file.getOriginalFilename());

        return "Resume uploaded successfully!";
    }
}