package com.campusplace.config;

import com.campusplace.service.CustomUserDetailsService;
import com.campusplace.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    @Bean
    public JwtFilter jwtFilter() {
        return new JwtFilter(jwtService, userDetailsService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:5173"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                .authorizeHttpRequests(auth -> auth

                        // Public
                        .requestMatchers(
                                "/auth/**",
                                "/oauth2/**",     // ✅ correct path
                                "/login/**",
                                "/error"
                        ).permitAll()

                        .requestMatchers("/api/companies/**").permitAll()
                        .requestMatchers("/api/resume/**").authenticated()
                        .requestMatchers("/api/students/**").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/companies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/companies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/companies/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )

                // 🔥 Enable OAuth2 login
                .oauth2Login(oauth -> oauth
                        .successHandler(oAuth2SuccessHandler)   // your custom handler
                )

                // JWT filter
                .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}