package com.petadoption.controller;

import com.petadoption.dto.AdoptionRequestDTO;
import com.petadoption.entity.AdoptionRequest;
import com.petadoption.entity.Pet;
import com.petadoption.repository.AdoptionRequestRepository;
import com.petadoption.repository.PetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional; // ✅ ADDED

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/adoptions")
@CrossOrigin(origins = "http://localhost:5173")
public class AdoptionController {

    private final PetRepository petRepository;
    private final AdoptionRequestRepository adoptionRequestRepository;

    public AdoptionController(PetRepository petRepository,
            AdoptionRequestRepository adoptionRequestRepository) {
        this.petRepository = petRepository;
        this.adoptionRequestRepository = adoptionRequestRepository;
    }

    /**
     * Submit adoption request
     */
    @PostMapping("/{id}")
    @Transactional // ✅ ADDED - This ensures database transaction
    public ResponseEntity<?> submitAdoptionRequest(
            @PathVariable Long id,
            @RequestBody AdoptionRequestDTO requestDTO) {

        try {
            System.out.println("🔍 Received adoption request for pet ID: " + id); // ✅ DEBUG LOG
            System.out.println("📧 Email: " + requestDTO.getEmail()); // ✅ DEBUG LOG

            // Find the pet
            Pet pet = petRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));

            System.out.println("✅ Pet found: " + pet.getName()); // ✅ DEBUG LOG

            // Create adoption request
            AdoptionRequest adoptionRequest = new AdoptionRequest();
            adoptionRequest.setPetId(pet.getId());
            adoptionRequest.setPetName(pet.getName());
            adoptionRequest.setPetBreed(pet.getBreed());
            adoptionRequest.setPetAge(pet.getAge());
            adoptionRequest.setPetCategory(pet.getCategory());
            adoptionRequest.setPetImage(pet.getImageUrl()); // ✅ Now matches Pet.java
            adoptionRequest.setEmail(requestDTO.getEmail());
            adoptionRequest.setPhoneNo(requestDTO.getPhoneNo());
            adoptionRequest.setLivingSituation(requestDTO.getLivingSituation());
            adoptionRequest.setPreviousExperience(requestDTO.getPreviousExperience());
            adoptionRequest.setFamilyComposition(requestDTO.getFamilyComposition());
            adoptionRequest.setStatus("PENDING");
            adoptionRequest.setCreatedAt(LocalDateTime.now());

            System.out.println("💾 Saving adoption request..."); // ✅ DEBUG LOG

            // Save the adoption request
            AdoptionRequest saved = adoptionRequestRepository.save(adoptionRequest);

            System.out.println("✅ Adoption request saved with ID: " + saved.getId()); // ✅ DEBUG LOG

            // Update pet status to pending
            pet.setStatus("pending");
            petRepository.save(pet);

            System.out.println("✅ Pet status updated to pending"); // ✅ DEBUG LOG

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Adoption request submitted successfully");
            response.put("requestId", saved.getId());
            response.put("status", "PENDING");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ ERROR: " + e.getMessage()); // ✅ DEBUG LOG
            e.printStackTrace(); // ✅ Print full stack trace

            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}