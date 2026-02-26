package com.campusplace.service;

import com.campusplace.dto.*;
import com.campusplace.entity.Role;
import com.campusplace.entity.User;
import com.campusplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // ================= SIGNUP =================
    public ApiResponse signup(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 🔐 Always STUDENT
        user.setRole(Role.STUDENT);

        userRepository.save(user);

        return new ApiResponse("User registered successfully");
    }

    // ================= LOGIN =================
    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 Generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("role", user.getRole().name());
        response.put("name", user.getName());

        return response;
    }

    // ================= REFRESH SUPPORT =================
    public String extractEmailFromToken(String token) {
        return jwtService.extractUsername(token);
    }

    public boolean validateRefreshToken(String token, User user) {
        return jwtService.isTokenValid(token, user);
    }

    public String generateNewAccessToken(User user) {
        return jwtService.generateAccessToken(user);
    }

    // ================= ADMIN FUNCTIONS =================
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name()
                ))
                .toList();
    }

    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public void promoteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(Role.ADMIN);
        userRepository.save(user);
    }
}