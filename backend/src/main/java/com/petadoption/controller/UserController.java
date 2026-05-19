package com.petadoption.controller;

import com.petadoption.dto.UpdateUserRequest;
import com.petadoption.entity.Pet;
import com.petadoption.entity.PendingPets;
import com.petadoption.entity.User;
import com.petadoption.repository.PetRepository;
import com.petadoption.repository.PendingPetRepository;
import com.petadoption.repository.UserRepository;
import com.petadoption.service.FileStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "${app.cors.allowed-origin}")
public class UserController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    private final PetRepository petRepository;
    private final PendingPetRepository pendingPetRepository;

    public UserController(
            PetRepository petRepository,
            PendingPetRepository pendingPetRepository) {
        this.petRepository = petRepository;
        this.pendingPetRepository = pendingPetRepository;
    }

    // =========================
    // ✅ GET AVAILABLE PETS
    // =========================
    @GetMapping("/pets")
    public ResponseEntity<List<Pet>> getAllApprovedPets() {
        List<Pet> pets = petRepository.findByStatus("available");
        return ResponseEntity.ok(pets);
    }

    // =========================
    // ✅ SUBMIT PET FOR APPROVAL
    // =========================
    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> submitPet(
            @RequestParam String name,
            @RequestParam String breed,
            @RequestParam int age,
            @RequestParam String gender,
            @RequestParam String location,
            @RequestParam String description,
            @RequestParam MultipartFile file) throws IOException {

        PendingPets pet = new PendingPets();

        pet.setName(name);
        pet.setBreed(breed);
        pet.setAge(age);
        pet.setGender(gender);
        pet.setLocation(location);
        pet.setDescription(description);

        String path = fileStorageService.savePendingPetImage(file);
        pet.setImagePath(path);

        pendingPetRepository.save(pet);

        return ResponseEntity.ok("Pet submitted for approval");
    }

    // =========================
    // ✅ UPDATE USER PROFILE
    // (NAME + OPTIONAL EMAIL)
    // =========================
    @PutMapping("/update")
    public ResponseEntity<?> updateUserProfile(@RequestBody UpdateUserRequest request) {

        System.out.println("👉 UPDATE REQUEST RECEIVED");
        System.out.println("👉 Email (identifier): " + request.getEmail());
        System.out.println("👉 Name: " + request.getName());
        System.out.println("👉 New Email: " + request.getNewEmail());

        try {
            // 🔎 Find user by current email
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("✅ USER FOUND: " + user.getEmail());

            // ✅ Update name if provided
            if (request.getName() != null && !request.getName().isBlank()) {
                user.setName(request.getName());
                System.out.println("✅ NAME UPDATED");
            }

            // ✅ Update email ONLY if newEmail provided
            if (request.getNewEmail() != null && !request.getNewEmail().isBlank()) {

                System.out.println("🔄 EMAIL UPDATE REQUESTED: " + request.getNewEmail());

                // 🚫 Prevent duplicate email
                if (!request.getNewEmail().equals(user.getEmail())
                        && userRepository.findByEmail(request.getNewEmail()).isPresent()) {
                    return ResponseEntity.badRequest().body(
                            Map.of("error", "Email already in use"));
                }

                user.setEmail(request.getNewEmail());
                System.out.println("✅ EMAIL UPDATED");
            }

            // 💾 Save changes
            userRepository.save(user);
            System.out.println("✅ USER SAVED SUCCESSFULLY");

            // ✅ Always return JSON
            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "updatedUser", Map.of(
                                    "name", user.getName(),
                                    "email", user.getEmail())));

        } catch (Exception e) {
            System.out.println("❌ UPDATE FAILED");
            e.printStackTrace(); // 🔥 shows real error in console

            return ResponseEntity.status(500).body(
                    Map.of("error", "Failed to update profile"));
        }
    }
}