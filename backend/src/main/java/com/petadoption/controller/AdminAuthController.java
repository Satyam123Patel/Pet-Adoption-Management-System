package com.petadoption.controller;

import com.petadoption.entity.Admin;
import com.petadoption.repository.AdminRepository;
import com.petadoption.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "${app.cors.allowed-origin}")
public class AdminAuthController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            System.out.println("🔐 Admin login attempt for: " + email);

            Optional<Admin> adminOpt = adminRepository.findByEmail(email);

            if (!adminOpt.isPresent()) {
                System.out.println("❌ Admin not found: " + email);
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid credentials"));
            }

            Admin admin = adminOpt.get();

            boolean passwordMatches = passwordEncoder.matches(password, admin.getPasswordHash());

            if (!passwordMatches) {
                System.out.println("❌ Invalid password for: " + email);
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid credentials"));
            }

            // ✅ Generate JWT token
            String token = jwtUtil.generateToken(admin.getEmail(), "ADMIN");

            System.out.println("✅ Admin logged in successfully: " + email);

            Map<String, Object> response = new HashMap<>();
            response.put("id", admin.getAdminId());
            response.put("email", admin.getEmail());
            response.put("name", admin.getName());
            response.put("role", "ADMIN");
            response.put("token", token);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Admin login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyAdmin(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");

            String email = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Not an admin"));
            }

            Optional<Admin> adminOpt = adminRepository.findByEmail(email);

            if (!adminOpt.isPresent()) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Admin not found"));
            }

            Admin admin = adminOpt.get();

            Map<String, Object> response = new HashMap<>();
            response.put("id", admin.getAdminId());
            response.put("email", admin.getEmail());
            response.put("name", admin.getName());
            response.put("role", "ADMIN");
            response.put("token", token);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Token verification failed: " + e.getMessage());
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Unauthorized"));
        }
    }
}
