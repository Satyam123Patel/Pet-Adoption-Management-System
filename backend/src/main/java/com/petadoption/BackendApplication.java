package com.petadoption;

import com.petadoption.entity.Admin;
import com.petadoption.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.name}")
    private String adminName;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner seedAdmin(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (adminRepository.findByEmail(adminEmail).isEmpty()) {
                Admin admin = new Admin();
                admin.setEmail(adminEmail);
                admin.setPasswordHash(passwordEncoder.encode(adminPassword));
                admin.setName(adminName);
                admin.setRole("ADMIN");

                adminRepository.save(admin);

                System.out.println("========================================");
                System.out.println("✅ Admin seeded successfully!");
                System.out.println("📧 Email: " + adminEmail);
                System.out.println("🔐 Password: " + adminPassword);
                System.out.println("========================================");
            } else {
                System.out.println("✅ Admin already exists — skipping seed.");
            }
        };
    }
}