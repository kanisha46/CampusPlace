package com.campusplace.dto;

import com.campusplace.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    private String email;
    private String password;
    private Role role;  // ✅ ADD THIS
}