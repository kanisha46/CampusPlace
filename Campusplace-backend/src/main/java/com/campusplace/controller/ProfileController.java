package com.campusplace.controller;

import com.campusplace.dto.ProfileRequest;
import com.campusplace.entity.StudentProfile;
import com.campusplace.entity.User;
import com.campusplace.repository.StudentProfileRepository;
import com.campusplace.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final ObjectMapper objectMapper;

    @PostMapping(consumes = {"multipart/form-data"})
    public String saveProfile(
            @RequestPart("profile") String profileJson,
            @RequestPart(value = "resume", required = false) MultipartFile resume,
            @RequestPart(value = "semResults", required = false) MultipartFile[] semResults,
            @RequestPart(value = "internshipCert", required = false) MultipartFile internshipCert,
            Authentication authentication
    ) throws Exception {

        ProfileRequest dto = objectMapper.readValue(profileJson, ProfileRequest.class);

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        StudentProfile profile = profileRepository
                .findByUser(user)
                .orElse(StudentProfile.builder().user(user).build());

        // ================= BASIC =================
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
        profile.setFacultyDept(dto.getFacultyDept());
        profile.setDesignation(dto.getDesignation());
        profile.setExperience(dto.getExperience());
        profile.setQualification(dto.getQualification());
        profile.setAbout(dto.getAbout());

        if (dto.getSkills() != null) {
            profile.setSkills(String.join(",", dto.getSkills()));
        }

        // ================= EDUCATION =================
        profile.setCurrentCgpa(dto.getCurrentCgpa());
        profile.setTwelfthPercentile(dto.getTwelfthPercentile());
        profile.setHasInternship(dto.getHasInternship());
        profile.setHasHackathon(dto.getHasHackathon());
        profile.setHackathonDetails(dto.getHackathonDetails());
        profile.setHasBacklogs(dto.getHasBacklogs());
        profile.setBacklogCount(dto.getBacklogCount());
        profile.setLeetcodePercentile(dto.getLeetcodePercentile());
        profile.setLeetcodeAccLink(dto.getLeetcodeAccLink());
        profile.setLeetcodeRank(dto.getLeetcodeRank());
        profile.setGithubLink(dto.getGithubLink());
        profile.setLinkedinLink(dto.getLinkedinLink());

        String uploadDir = "uploads/";
        Files.createDirectories(Paths.get(uploadDir));

        // ================= RESUME =================
        if (resume != null && !resume.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + resume.getOriginalFilename();
            resume.transferTo(Paths.get(uploadDir + fileName));
            profile.setResumeFileName(fileName);
        }

        // ================= SEM RESULTS =================
        if (semResults != null && semResults.length > 0) {

            List<String> semFileNames =
                    profile.getSemResultsFileNames() != null
                            ? new ArrayList<>(profile.getSemResultsFileNames())
                            : new ArrayList<>();

            for (MultipartFile file : semResults) {
                if (!file.isEmpty()) {
                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                    file.transferTo(Paths.get(uploadDir + fileName));
                    semFileNames.add(fileName);
                }
            }

            profile.setSemResultsFileNames(semFileNames);
        }

        // ================= INTERNSHIP =================
        if (internshipCert != null && !internshipCert.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + internshipCert.getOriginalFilename();
            internshipCert.transferTo(Paths.get(uploadDir + fileName));
            profile.setInternshipCertFileName(fileName);
        }

        profile.setProfileCompleted(true);

        profileRepository.save(profile);

        return "Profile saved successfully";
    }

    // ================= SAFE GET =================
    @GetMapping
    public StudentProfile getProfile(Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        return profileRepository.findByUser(user)
                .orElse(StudentProfile.builder()
                        .user(user)
                        .profileCompleted(false)
                        .build());
    }
}