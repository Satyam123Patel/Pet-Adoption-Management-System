package com.petadoption.controller;

import com.petadoption.entity.PendingPets;
import com.petadoption.repository.PendingPetRepository;
import com.petadoption.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pets")
@CrossOrigin(origins = "${app.cors.allowed-origin}")
public class PetSubmissionController {

    @Autowired
    private PendingPetRepository pendingPetRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

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
            System.out.println(
                    "📥 Receiving pet submission...");

            // Validate inputs
            if (name == null || name.trim().isEmpty())
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "Name is required"));
            if (email == null || email.trim().isEmpty())
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "Email is required"));
            if (category == null
                    || category.trim().isEmpty())
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "Category is required"));
            if (breed == null || breed.trim().isEmpty())
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "Breed is required"));
            if (age == null || age < 0)
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "Valid age is required"));
            if (gender == null
                    || gender.trim().isEmpty())
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "Gender is required"));
            if (location == null
                    || location.trim().isEmpty())
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "Location is required"));
            if (description == null
                    || description.trim().isEmpty())
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "Description is required"));
            if (phone == null || phone.trim().isEmpty())
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "Phone is required"));
            if (file == null || file.isEmpty())
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "Image is required"));

            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file);
            System.out.println(
                    "✅ Image uploaded: " + imageUrl);

            // Save to database
            PendingPets pendingPet = new PendingPets();
            pendingPet.setName(name.trim());
            pendingPet.setEmail(email.trim());
            pendingPet.setCategory(category.trim());
            pendingPet.setBreed(breed.trim());
            pendingPet.setAge(age);
            pendingPet.setGender(gender.trim());
            pendingPet.setLocation(location.trim());
            pendingPet.setDescription(
                    description.trim());
            pendingPet.setPhone(phone.trim());
            pendingPet.setImagePath(imageUrl);
            pendingPet.setStatus("pending");

            PendingPets saved = pendingPetRepository.save(pendingPet);
            System.out.println(
                    "✅ Pet saved with ID: " + saved.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("message",
                    "Pet submitted successfully!");
            response.put("petId", saved.getId());
            response.put("status", "pending");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println(
                    "❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Failed to submit pet",
                            "details", e.getMessage()));
        }
    }
}