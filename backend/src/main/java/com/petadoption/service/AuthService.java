//1
package com.petadoption.service;

import com.petadoption.entity.User;
import com.petadoption.repository.UserRepository;
import com.petadoption.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ SIGNUP (NO OTP LOGIC HERE)
    public Map<String, Object> signup(String name, String email, String password) {
        Map<String, Object> response = new HashMap<>();

        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return response;
        }

        // Create new user
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // 🔐 hash password
        user.setRole("USER");

        userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user);

        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("token", token);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());

        response.put("user", userData);

        return response;
    }

    // (Optional) login logic if you want service-based login later
    public Map<String, Object> login(String email, String password) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid password");
            return response;
        }

        String token = jwtUtil.generateToken(user);

        response.put("success", true);
        response.put("token", token);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());

        response.put("user", userData);

        return response;
    }
}
