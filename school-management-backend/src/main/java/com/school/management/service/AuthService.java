package com.school.management.service;

import com.school.management.dto.AuthResponse;
import com.school.management.dto.LoginRequest;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse getCurrentUser(String email);
}
