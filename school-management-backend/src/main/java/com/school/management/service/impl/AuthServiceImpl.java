package com.school.management.service.impl;

import com.school.management.dto.AuthResponse;
import com.school.management.dto.LoginRequest;
import com.school.management.entity.User;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.repository.UserRepository;
import com.school.management.service.AuthService;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        // Match password (supports plain text or basic hash)
        if (!user.getPassword().equals(request.getPassword())) {
            throw new ResourceNotFoundException("Invalid email or password");
        }

        // Generate simple secure session token
        String token = "educore-token-" + Base64.getUrlEncoder().withoutPadding().encodeToString(
                (user.getEmail() + ":" + user.getRole() + ":" + UUID.randomUUID()).getBytes()
        );

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getTeacherId()
        );
    }

    @Override
    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return new AuthResponse(
                null,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getTeacherId()
        );
    }
}
