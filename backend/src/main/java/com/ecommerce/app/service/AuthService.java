package com.ecommerce.app.service;

import com.ecommerce.app.dto.AuthResponse;
import com.ecommerce.app.dto.LoginRequest;
import com.ecommerce.app.dto.RegisterRequest;
import com.ecommerce.app.entity.User;
import com.ecommerce.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    private static final String ADMIN_EMAIL = "adminsathvik@gmail.com";
    private static final String ADMIN_PASSWORD = "admin123";
    
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "Email already registered", null, null);
        }
        
        // Prevent registration with admin email
        if (request.getEmail().equalsIgnoreCase(ADMIN_EMAIL)) {
            return new AuthResponse(false, "This email is reserved", null, null);
        }
        
        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // In production, hash this!
        user.setRole("user");
        
        userRepository.save(user);
        
        return new AuthResponse(true, "Registration successful", user.getEmail(), user.getRole());
    }
    
    public AuthResponse login(LoginRequest request) {
        // Check if admin
        if (request.getEmail().equals(ADMIN_EMAIL) && request.getPassword().equals(ADMIN_PASSWORD)) {
            return new AuthResponse(true, "Login successful", ADMIN_EMAIL, "admin");
        }
        
        // Check registered users
        return userRepository.findByEmail(request.getEmail())
            .filter(user -> user.getPassword().equals(request.getPassword())) // In production, verify hashed password!
            .map(user -> new AuthResponse(true, "Login successful", user.getEmail(), user.getRole()))
            .orElse(new AuthResponse(false, "Invalid email or password", null, null));
    }
}
