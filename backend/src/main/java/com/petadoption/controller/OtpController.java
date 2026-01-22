package com.petadoption.controller;

import com.petadoption.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "http://localhost:5173")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<?> send(@RequestBody Map<String, String> req) {
        otpService.sendOtp(req.get("email"));
        return ResponseEntity.ok(Map.of("message", "OTP sent"));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> req) {
        boolean ok = otpService.verifyOtp(req.get("email"), req.get("otp"));
        if (!ok) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP"));
        }
        return ResponseEntity.ok(Map.of("message", "OTP verified"));
    }
}
