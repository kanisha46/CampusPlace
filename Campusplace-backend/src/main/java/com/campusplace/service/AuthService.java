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
    private final EmailService emailService;
    private final java.util.UUID uuid = java.util.UUID.randomUUID();

    // ================= SIGNUP =================
    public ApiResponse signup(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);

        // 🔐 Email Verification Logic
        String verificationToken = java.util.UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setEmailVerified(false); // REQUIRE verification

        userRepository.save(user);

        // Send Email
        String verifyUrl = "http://localhost:5173/verify?token=" + verificationToken;
        emailService.sendEmail(
                user.getEmail(),
                "Verify your CampusPlace Account",
                "Please click the link to verify your account: " + verifyUrl
        );

        return new ApiResponse("Registration successful! Please check your email to verify your account.");
    }

    public ApiResponse verifyEmail(String token) {
        User user = userRepository.findAll().stream()
                .filter(u -> token.equals(u.getVerificationToken()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return new ApiResponse("Email verified successfully! You can now login.");
    }

    // ================= FORGOT / RESET PASSWORD =================
    public ApiResponse forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String resetToken = java.util.UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;
        emailService.sendEmail(
                user.getEmail(),
                "Password Reset Request",
                "To reset your password, click the link below: " + resetUrl
        );

        return new ApiResponse("Password reset link sent to your email.");
    }

    public ApiResponse resetPassword(String token, String newPassword) {
        User user = userRepository.findAll().stream()
                .filter(u -> token.equals(u.getResetToken()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return new ApiResponse("Password reset successfully! Please login with your new password.");
    }

    // ================= LOGIN =================
    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 Validate Password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // 🔐 Check Verification
        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email before logging in.");
        }

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