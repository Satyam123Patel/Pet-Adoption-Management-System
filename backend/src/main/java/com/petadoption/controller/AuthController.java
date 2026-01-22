package com.petadoption.controller;

import com.petadoption.entity.Admin;
import com.petadoption.entity.User;
import com.petadoption.repository.AdminRepository;
import com.petadoption.repository.UserRepository;
import com.petadoption.security.JwtUtil;
import com.petadoption.service.AuthService;
import com.petadoption.service.OtpService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ================= USER SIGNUP =================
    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody Map<String, String> req) {

        String name = req.get("name");
        String email = req.get("email");
        String password = req.get("password");
        String otp = req.get("otp");

        Map<String, Object> response = new HashMap<>();

        if (!otpService.verifyOtp(email, otp)) {
            response.put("success", false);
            response.put("message", "Invalid or expired OTP");
            return response;
        }

        return authService.signup(name, email, password);
    }

    // ================= USER LOGIN =================
    @PostMapping("/login")
    public Map<String, Object> userLogin(@RequestBody Map<String, String> req) {

        String email = req.get("email");
        String password = req.get("password");

        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid password");
            return response;
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        response.put("success", true);
        response.put("token", token);

        response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole()));

        return response;
    }

    // ================= ADMIN LOGIN (DEBUG VERSION) =================
    @PostMapping("/admin/login")
    public Map<String, Object> adminLogin(@RequestBody Map<String, String> req) {

        String email = req.get("email");
        String password = req.get("password");

        System.out.println("🔐 ========== ADMIN LOGIN DEBUG ==========");
        System.out.println("📧 Email received: " + email);
        System.out.println(
                "🔑 Password received: " +
                        (password != null ? "YES (length: " + password.length() + ")" : "NO"));

        Map<String, Object> response = new HashMap<>();

        Optional<Admin> adminOpt = adminRepository.findByEmail(email);

        if (adminOpt.isEmpty()) {
            System.out.println("❌ Admin NOT FOUND in database for email: " + email);
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return response;
        }

        Admin admin = adminOpt.get();

        System.out.println("✅ Admin FOUND in database:");
        System.out.println("   - ID: " + admin.getAdminId());
        System.out.println("   - Name: " + admin.getName());
        System.out.println("   - Email: " + admin.getEmail());
        System.out.println("   - Role: " + admin.getRole());
        System.out.println("   - Password Hash: " + admin.getPasswordHash());
        System.out.println(
                "   - Hash Length: " +
                        (admin.getPasswordHash() != null ? admin.getPasswordHash().length() : "NULL"));

        boolean passwordMatches = passwordEncoder.matches(password, admin.getPasswordHash());

        System.out.println("🔍 Password matches: " + passwordMatches);

        if (!passwordMatches) {
            System.out.println("❌ PASSWORD VERIFICATION FAILED");
            System.out.println("   - Input password: " + password);
            System.out.println("   - Stored hash: " + admin.getPasswordHash());
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return response;
        }

        System.out.println("✅ ========== LOGIN SUCCESSFUL ==========");

        String token = jwtUtil.generateToken(admin.getEmail(), "ADMIN");

        response.put("success", true);
        response.put("token", token);

        response.put("user", Map.of(
                "id", admin.getAdminId(),
                "name", admin.getName(),
                "email", admin.getEmail(),
                "role", "ADMIN"));

        return response;
    }

    // ================= TEMPORARY - GENERATE HASH FOR TESTING =================
    @GetMapping("/test/hash")
    public Map<String, String> generateHash() {

        String password = "admin123";
        String hash = passwordEncoder.encode(password);

        System.out.println("🔐 ===== HASH GENERATION TEST =====");
        System.out.println("Password: " + password);
        System.out.println("Generated Hash: " + hash);
        System.out.println("Hash Length: " + hash.length());

        boolean matches = passwordEncoder.matches(password, hash);
        System.out.println("Self-test matches: " + matches);

        return Map.of(
                "password", password,
                "hash", hash,
                "selfTest", String.valueOf(matches));
    }
}
