package com.campusplace.service;

import com.campusplace.dto.ProfileRequest;
import com.campusplace.dto.ProfileResponse;
import com.campusplace.entity.Profile;
import com.campusplace.entity.User;
import com.campusplace.repository.ProfileRepository;
import com.campusplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ProfileResponse saveProfile(ProfileRequest request) {

        User user = getLoggedInUser();

        Profile profile = profileRepository.findByUser(user)
                .orElse(Profile.builder().user(user).build());

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setMobile(request.getMobile());
        profile.setGender(request.getGender());
        profile.setUserType(request.getUserType());
        profile.setCourse(request.getCourse());
        profile.setSpecialization(request.getSpecialization());
        profile.setStartYear(request.getStartYear());
        profile.setEndYear(request.getEndYear());
        profile.setFacultyDept(request.getFacultyDept());
        profile.setDesignation(request.getDesignation());
        profile.setExperience(request.getExperience());
        profile.setQualification(request.getQualification());
        profile.setAbout(request.getAbout());
        profile.setSkills(request.getSkills());

        profileRepository.save(profile);

        return mapToResponse(profile);
    }

    public ProfileResponse getProfile() {

        User user = getLoggedInUser();

        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return mapToResponse(profile);
    }

    public void saveResumeFileName(String fileName) {

        User user = getLoggedInUser();

        Profile profile = profileRepository.findByUser(user)
                .orElse(Profile.builder().user(user).build());

        profile.setResumeFileName(fileName);
        profileRepository.save(profile);
    }

    private ProfileResponse mapToResponse(Profile profile) {

        return ProfileResponse.builder()
                .username(profile.getUser().getEmail())
                .email(profile.getUser().getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .mobile(profile.getMobile())
                .gender(profile.getGender())
                .userType(profile.getUserType())
                .course(profile.getCourse())
                .specialization(profile.getSpecialization())
                .startYear(profile.getStartYear())
                .endYear(profile.getEndYear())
                .facultyDept(profile.getFacultyDept())
                .designation(profile.getDesignation())
                .experience(profile.getExperience())
                .qualification(profile.getQualification())
                .about(profile.getAbout())
                .skills(profile.getSkills())
                .resumeFileName(profile.getResumeFileName())
                .build();
    }
}