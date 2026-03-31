package com.campusplace.config;

import com.campusplace.entity.Role;
import com.campusplace.entity.User;
import com.campusplace.repository.UserRepository;
import com.campusplace.service.JwtService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String emailAttr = oAuth2User.getAttribute("email");
        String nameAttr = oAuth2User.getAttribute("name");
        String login = oAuth2User.getAttribute("login");

        // 🔥 GitHub fallback
        String finalEmail = emailAttr != null ? emailAttr : login + "@github.com";
        String finalName = nameAttr != null ? nameAttr : login;

        // 🔥 Find or create user
        User user = userRepository.findByEmail(finalEmail)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(finalEmail)
                            .name(finalName)
                            .password("OAUTH_USER")
                            .role(Role.STUDENT)
                            .build();
                    return userRepository.save(newUser);
                });

        // 🔐 Generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // 🔐 Store refresh token in HttpOnly cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true) // ✅ enabled for HTTPS (Production)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Strict")
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // 🔁 Redirect with access token only
        response.sendRedirect(
                "https://campus-place.vercel.app/oauth-success" + // Fixed Vercel URL
                        "?token=" + accessToken +
                        "&role=" + user.getRole() +
                        "&name=" + user.getName()
        );
    }
}