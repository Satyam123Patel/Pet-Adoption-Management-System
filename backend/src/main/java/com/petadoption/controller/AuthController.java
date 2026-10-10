//1
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
@CrossOrigin(origins = "${app.cors.allowed-origin}")
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

    // ================= ADMIN LOGIN =================
    @PostMapping("/admin/login")
    public Map<String, Object> adminLogin(@RequestBody Map<String, String> req) {

        String email = req.get("email");
        String password = req.get("password");

        Map<String, Object> response = new HashMap<>();

        Optional<Admin> adminOpt = adminRepository.findByEmail(email);

        if (adminOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return response;
        }

        Admin admin = adminOpt.get();

        boolean passwordMatches = passwordEncoder.matches(password, admin.getPasswordHash());

        if (!passwordMatches) {
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return response;
        }

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
}
