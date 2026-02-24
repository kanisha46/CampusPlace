package com.campusplace.config;

import com.campusplace.entity.Role;
import com.campusplace.entity.User;
import com.campusplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepository.findByEmail("admin@campusplace.com").isEmpty()) {

            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@campusplace.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("✅ Default ADMIN created!");
        }
    }
}