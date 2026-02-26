package com.campusplace.controller;

import com.campusplace.dto.*;
import com.campusplace.service.AuthService;
import com.campusplace.repository.UserRepository;
import com.campusplace.entity.User;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;
import java.util.HashMap;
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    // ================= SIGNUP =================
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signup(
            @Valid @RequestBody SignupRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.signup(request));
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,
                                   HttpServletResponse response) {

        Map<String, Object> result = authService.login(request);

        String refreshToken = (String) result.get("refreshToken");

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Strict")
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // Instead of remove(), create new response map
        Map<String, Object> frontendResponse = new HashMap<>();
        frontendResponse.put("accessToken", result.get("accessToken"));
        frontendResponse.put("role", result.get("role"));
        frontendResponse.put("name", result.get("name"));

        return ResponseEntity.ok(frontendResponse);
    }

    // ================= REFRESH TOKEN =================
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @CookieValue(name = "refreshToken", required = false)
            String refreshToken
    ) {

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authService.extractEmailFromToken(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!authService.validateRefreshToken(refreshToken, user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String newAccessToken = authService.generateNewAccessToken(user);

        return ResponseEntity.ok(
                Map.of("accessToken", newAccessToken)
        );
    }

    // ================= LOGOUT =================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false) // ⚠ true in production
                .path("/")
                .maxAge(0)
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("Logged out successfully");
    }

    // ================= ADMIN USERS =================
    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return authService.getAllUsers();
    }
}