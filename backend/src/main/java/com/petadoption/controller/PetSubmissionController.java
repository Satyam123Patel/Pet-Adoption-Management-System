package com.petadoption.controller;

import com.petadoption.entity.PendingPets;
import com.petadoption.repository.PendingPetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pets")
@CrossOrigin(origins = "http://localhost:5173")
public class PetSubmissionController {

    @Autowired
    private PendingPetRepository pendingPetRepository;

    private static final String UPLOAD_DIR = "D:\\Petpostedimages\\";

    @PostMapping("/submit")
    public ResponseEntity<?> submitPet(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("category") String category,
            @RequestParam("breed") String breed,
            @RequestParam("age") Integer age,
            @RequestParam("gender") String gender,
            @RequestParam("location") String location,
            @RequestParam("description") String description,
            @RequestParam("phone") String phone,
            @RequestParam("file") MultipartFile file) {

        try {
            System.out.println("📥 Receiving pet submission...");
            System.out.println("Name: " + name);
            System.out.println("Email: " + email);
            System.out.println("Category: " + category);
            System.out.println("Breed: " + breed);
            System.out.println("Age: " + age);
            System.out.println("Gender: " + gender);
            System.out.println("Location: " + location);
            System.out.println("Phone: " + phone);
            System.out.println("File: " + (file != null ? file.getOriginalFilename() : "NULL"));

            // Validate inputs
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
            }
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            if (category == null || category.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Category is required"));
            }
            if (breed == null || breed.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Breed is required"));
            }
            if (age == null || age < 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Valid age is required"));
            }
            if (gender == null || gender.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Gender is required"));
            }
            if (location == null || location.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Location is required"));
            }
            if (description == null || description.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Description is required"));
            }
            if (phone == null || phone.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Phone is required"));
            }
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Image is required"));
            }

            // Create directory if not exists
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                boolean created = uploadDir.mkdirs();
                System.out.println("📁 Upload directory created: " + created);
            }

            // Save file
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String uniqueFilename = System.currentTimeMillis() + "_" +
                    name.replaceAll("[^a-zA-Z0-9]", "_") + fileExtension;

            Path filePath = Paths.get(UPLOAD_DIR + uniqueFilename);
            Files.write(filePath, file.getBytes());

            System.out.println("✅ File saved: " + uniqueFilename);

            // Save to database
            PendingPets pendingPet = new PendingPets();
            pendingPet.setName(name.trim());
            pendingPet.setEmail(email.trim());
            pendingPet.setCategory(category.trim());
            pendingPet.setBreed(breed.trim());
            pendingPet.setAge(age);
            pendingPet.setGender(gender.trim()); // ✅ FIXED: Set as String, not char
            pendingPet.setLocation(location.trim());
            pendingPet.setDescription(description.trim());
            pendingPet.setPhone(phone.trim());
            pendingPet.setImagePath(uniqueFilename);
            pendingPet.setStatus("pending");

            PendingPets saved = pendingPetRepository.save(pendingPet);
            System.out.println("✅ Pet saved to database with ID: " + saved.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Pet submitted successfully!");
            response.put("petId", saved.getId());
            response.put("status", "pending");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error submitting pet: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to submit pet");
            errorResponse.put("details", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }
}