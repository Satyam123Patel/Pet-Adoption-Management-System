
package com.petadoption.controller;

import com.petadoption.entity.Admin;
import com.petadoption.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminAuthController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            System.out.println("🔐 Admin login attempt for: " + email);

            // Find admin by email
            Optional<Admin> adminOpt = adminRepository.findByEmail(email);

            if (!adminOpt.isPresent()) {
                System.out.println("❌ Admin not found: " + email);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid credentials");
                return ResponseEntity.badRequest().body(error);
            }

            Admin admin = adminOpt.get();

            System.out.println("🔍 Found admin: " + admin.getEmail());

            // Verify password using BCrypt
            boolean passwordMatches = passwordEncoder.matches(password, admin.getPasswordHash());
            System.out.println("✓ Password matches: " + passwordMatches);

            if (!passwordMatches) {
                System.out.println("❌ Invalid password for: " + email);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid credentials");
                return ResponseEntity.badRequest().body(error);
            }

            System.out.println("✅ Admin logged in successfully: " + email);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("id", admin.getAdminId());
            response.put("email", admin.getEmail());
            response.put("name", admin.getName());
            response.put("role", "ADMIN");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Admin login error: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyAdmin(@RequestHeader("Authorization") String email) {
        try {
            Optional<Admin> adminOpt = adminRepository.findByEmail(email);

            if (!adminOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Unauthorized");
                return ResponseEntity.status(401).body(error);
            }

            Admin admin = adminOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", admin.getAdminId());
            response.put("email", admin.getEmail());
            response.put("name", admin.getName());
            response.put("role", "ADMIN");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Verification failed");
            return ResponseEntity.status(500).body(error);
        }
    }
}

