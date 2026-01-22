package com.petadoption.controller;

import com.petadoption.entity.PendingPets;
import com.petadoption.repository.PendingPetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/pets") // ✅ FIXED: Added /api prefix to match your project structure
@CrossOrigin(origins = "http://localhost:5173")
public class AdminPanelController {

        @Autowired
        private PendingPetRepository pendingPetRepository;

        @Autowired
        private JdbcTemplate jdbcTemplate;

        private static final String PENDING_DIR = "D:\\Petpostedimages\\";
        private static final String APPROVED_DIR = "D:\\Adoptionpetimages\\";

        // Get all pending pets
        @GetMapping("/pending")
        public ResponseEntity<?> getPendingPets() {
                try {
                        List<PendingPets> pendingPets = pendingPetRepository.findByStatus("pending");
                        System.out.println("📋 Found " + pendingPets.size() + " pending pets");
                        return ResponseEntity.ok(pendingPets);
                } catch (Exception e) {
                        System.err.println("❌ Error fetching pending pets: " + e.getMessage());
                        e.printStackTrace();
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Failed to fetch pending pets: " + e.getMessage()));
                }
        }

        // Approve pet - move to pets table for adoption
        @PostMapping("/approve/{id}")
        public ResponseEntity<?> approvePet(@PathVariable Long id) {
                try {
                        System.out.println("✅ Approving pet ID: " + id);

                        Optional<PendingPets> pendingOpt = pendingPetRepository.findById(id);
                        if (!pendingOpt.isPresent()) {
                                return ResponseEntity.badRequest()
                                                .body(Map.of("error", "Pet not found"));
                        }

                        PendingPets pendingPet = pendingOpt.get();

                        // Create approved directory if not exists
                        Path approvedDir = Paths.get(APPROVED_DIR);
                        if (!Files.exists(approvedDir)) {
                                Files.createDirectories(approvedDir);
                        }

                        // Copy image to approved folder
                        String imageName = pendingPet.getImagePath();
                        if (imageName != null && !imageName.isEmpty()) {
                                Path sourcePath = Paths.get(PENDING_DIR + imageName);
                                Path targetPath = Paths.get(APPROVED_DIR + imageName);

                                if (Files.exists(sourcePath)) {
                                        Files.copy(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
                                        System.out.println("📁 Image copied to approved folder");
                                }
                        }

                        // Insert into pets table (your existing pets table structure)
                        String insertSql = """
                                            INSERT INTO pets (name, breed, age, gender, status, image_url, shelter_id)
                                            VALUES (?, ?, ?, ?, 'available', ?, 1)
                                        """;

                        jdbcTemplate.update(insertSql,
                                        pendingPet.getBreed() + " (" + pendingPet.getCategory() + ")",
                                        pendingPet.getBreed(),
                                        pendingPet.getAge(),
                                        pendingPet.getGender() != null && pendingPet.getGender().length() > 0
                                                        ? pendingPet.getGender().substring(0, 1).toUpperCase()
                                                        : "U",
                                        imageName);

                        System.out.println("✅ Pet added to adoption list");

                        // Update pending pet status
                        pendingPet.setStatus("approved");
                        pendingPetRepository.save(pendingPet);

                        Map<String, Object> response = new HashMap<>();
                        response.put("message", "Pet approved successfully");

                        return ResponseEntity.ok(response);

                } catch (Exception e) {
                        System.err.println("❌ Error approving pet: " + e.getMessage());
                        e.printStackTrace();
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Failed to approve pet: " + e.getMessage()));
                }
        }

        // Reject pet
        @PostMapping("/reject/{id}")
        public ResponseEntity<?> rejectPet(@PathVariable Long id) {
                try {
                        System.out.println("❌ Rejecting pet ID: " + id);

                        Optional<PendingPets> pendingOpt = pendingPetRepository.findById(id);
                        if (!pendingOpt.isPresent()) {
                                return ResponseEntity.badRequest()
                                                .body(Map.of("error", "Pet not found"));
                        }

                        PendingPets pendingPet = pendingOpt.get();
                        pendingPet.setStatus("rejected");
                        pendingPetRepository.save(pendingPet);

                        System.out.println("✅ Pet rejected successfully");

                        return ResponseEntity.ok(Map.of("message", "Pet rejected successfully"));

                } catch (Exception e) {
                        System.err.println("❌ Error rejecting pet: " + e.getMessage());
                        e.printStackTrace();
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Failed to reject pet: " + e.getMessage()));
                }
        }

        // Delete pending pet
        @DeleteMapping("/delete/{id}")
        public ResponseEntity<?> deletePendingPet(@PathVariable Long id) {
                try {
                        Optional<PendingPets> pendingOpt = pendingPetRepository.findById(id);
                        if (!pendingOpt.isPresent()) {
                                return ResponseEntity.badRequest()
                                                .body(Map.of("error", "Pet not found"));
                        }

                        PendingPets pendingPet = pendingOpt.get();

                        // Delete image file
                        String imagePath = pendingPet.getImagePath();
                        if (imagePath != null) {
                                Path filePath = Paths.get(PENDING_DIR + imagePath);
                                if (Files.exists(filePath)) {
                                        Files.delete(filePath);
                                        System.out.println("🗑️ Image file deleted");
                                }
                        }

                        pendingPetRepository.delete(pendingPet);
                        System.out.println("✅ Pending pet deleted");

                        return ResponseEntity.ok(Map.of("message", "Pet deleted successfully"));

                } catch (Exception e) {
                        System.err.println("❌ Error deleting pet: " + e.getMessage());
                        e.printStackTrace();
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Failed to delete pet: " + e.getMessage()));
                }
        }
}