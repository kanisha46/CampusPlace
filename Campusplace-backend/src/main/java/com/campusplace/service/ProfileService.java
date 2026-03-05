package com.campusplace.service;

import com.campusplace.entity.StudentProfile;
import com.campusplace.repository.StudentProfileRepository;
import com.campusplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
public class ProfileService {

    @Autowired
    private StudentProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public StudentProfile getOrCreateProfile(String email) {
        // Look for existing profile by email
        return profileRepository.findByUserEmail(email).orElseGet(() -> {
            // If not found, create a blank profile so the frontend doesn't crash
            var user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return StudentProfile.builder()
                    .user(user)
                    .firstName(user.getName())
                    .semResultsFileNames(new ArrayList<>())
                    .profileCompleted(false)
                    .build();
        });
    }
}