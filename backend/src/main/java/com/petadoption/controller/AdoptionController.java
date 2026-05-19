package com.petadoption.controller;

import com.petadoption.dto.AdoptionRequestDTO;
import com.petadoption.entity.AdoptionRequest;
import com.petadoption.entity.Pet;
import com.petadoption.entity.User;
import com.petadoption.repository.AdoptionRequestRepository;
import com.petadoption.repository.PetRepository;
import com.petadoption.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * ✅ PUBLIC ENDPOINT - User submits adoption requests
 * Converts email → user_id using FK relationship
 */
@RestController
@RequestMapping("/adoptions")
@CrossOrigin(origins = "${app.cors.allowed-origin}")
public class AdoptionController {

    @Autowired
    private AdoptionRequestRepository adoptionRequestRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * ✅ Submit adoption request
     * 
     * Frontend sends: email, petId, living situation, etc.
     * Backend converts email → userId (via FK)
     * Stores: userId, petId (normalized with FKs)
     */
    @PostMapping("/{petId}")
    public ResponseEntity<?> submitAdoptionRequest(
            @PathVariable Long petId,
            @RequestBody AdoptionRequestDTO dto) {

        try {
            System.out.println("📥 ===== ADOPTION REQUEST =====");
            System.out.println("   Pet ID: " + petId);
            System.out.println("   User Email: " + dto.getEmail());
            System.out.println("   Phone: " + dto.getPhoneNo());

            // ✅ Step 1: Verify pet exists and is available
            Pet pet = petRepository.findById(petId)
                    .orElseThrow(() -> new RuntimeException("Pet not found with ID: " + petId));

            if (!"available".equalsIgnoreCase(pet.getStatus())) {
                throw new RuntimeException(
                        "This pet is not available for adoption (current status: " + pet.getStatus() + ")");
            }

            System.out.println("✅ Pet found: " + pet.getName() + " (Status: " + pet.getStatus() + ")");

            // ✅ Step 2: Find user by email (to get user_id)
            User user = userRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found. Please login or signup first."));

            System.out.println("✅ User found: " + user.getName() + " (ID: " + user.getId() + ")");

            // ✅ Step 3: Check if user already has pending request for this pet
            List<AdoptionRequest> existingRequests = adoptionRequestRepository
                    .findByPetIdAndStatus(petId, AdoptionRequest.Status.PENDING);

            for (AdoptionRequest req : existingRequests) {
                if (req.getUserId().equals(user.getId())) {
                    System.out.println("⚠️ User already has pending request for this pet");
                    return ResponseEntity.badRequest()
                            .body(Map.of(
                                    "success", false,
                                    "error",
                                    "You already have a pending adoption request for this pet. Please wait for admin approval."));
                }
            }

            // ✅ Step 4: Create adoption request with FOREIGN KEYS
            AdoptionRequest request = new AdoptionRequest();
            request.setUserId(user.getId()); // ✅ FK to users table
            request.setPetId(petId); // ✅ FK to pet table
            request.setLivingSituation(dto.getLivingSituation());
            request.setPreviousExperience(dto.getPreviousExperience());
            request.setFamilyComposition(dto.getFamilyComposition());
            request.setStatus(AdoptionRequest.Status.PENDING);

            // ✅ Step 5: Save request
            AdoptionRequest saved = adoptionRequestRepository.save(request);
            System.out.println("✅ Request saved with ID: " + saved.getId());

            // ✅ Step 6: Update pet status to 'pending'
            pet.setStatus("pending");
            petRepository.save(pet);
            System.out.println("✅ Pet status updated to: pending");

            System.out.println("✅ ===== REQUEST COMPLETE =====");

            // ✅ Return success response
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Adoption request submitted successfully! We'll contact you soon.",
                    "requestId", saved.getId(),
                    "petName", pet.getName(),
                    "status", "PENDING"));

        } catch (RuntimeException e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "error", e.getMessage()));

        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "success", false,
                            "error", "Failed to submit adoption request. Please try again."));
        }
    }

    /**
     * ✅ Get user's adoption requests
     * Uses FK relationship to JOIN with pet table
     */
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUserRequests(@PathVariable String email) {
        try {
            System.out.println("📋 Fetching adoption requests for: " + email);

            // Find user by email
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get all requests for this user
            List<AdoptionRequest> requests = adoptionRequestRepository
                    .findByUserIdOrderByCreatedAtDesc(user.getId());

            System.out.println("✅ Found " + requests.size() + " requests for user: " + user.getName());

            // ✅ For each request, fetch pet details (simulating JOIN)
            List<Map<String, Object>> enrichedRequests = new ArrayList<>();

            for (AdoptionRequest request : requests) {
                Optional<Pet> petOpt = petRepository.findById(request.getPetId());

                if (petOpt.isPresent()) {
                    Pet pet = petOpt.get();

                    Map<String, Object> enriched = new HashMap<>();
                    enriched.put("requestId", request.getId());
                    enriched.put("petId", pet.getId());
                    enriched.put("petName", pet.getName());
                    enriched.put("petBreed", pet.getBreed());
                    enriched.put("petAge", pet.getAge());
                    enriched.put("petCategory", pet.getCategory());
                    enriched.put("petImage", pet.getImage_url());
                    enriched.put("status", request.getStatusString());
                    enriched.put("createdAt", request.getCreatedAt());
                    enriched.put("updatedAt", request.getUpdatedAt());
                    enriched.put("livingSituation", request.getLivingSituation());
                    enriched.put("previousExperience", request.getPreviousExperience());
                    enriched.put("familyComposition", request.getFamilyComposition());

                    enrichedRequests.add(enriched);
                }
            }

            return ResponseEntity.ok(enrichedRequests);

        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✅ Get adoption request by ID
     */
    @GetMapping("/{requestId}")
    public ResponseEntity<?> getRequestById(@PathVariable Long requestId) {
        try {
            AdoptionRequest request = adoptionRequestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            Optional<Pet> petOpt = petRepository.findById(request.getPetId());
            Optional<User> userOpt = userRepository.findById(request.getUserId());

            Map<String, Object> response = new HashMap<>();
            response.put("requestId", request.getId());
            response.put("status", request.getStatusString());
            response.put("livingSituation", request.getLivingSituation());
            response.put("previousExperience", request.getPreviousExperience());
            response.put("familyComposition", request.getFamilyComposition());
            response.put("createdAt", request.getCreatedAt());
            response.put("updatedAt", request.getUpdatedAt());

            if (petOpt.isPresent()) {
                Pet pet = petOpt.get();
                response.put("petId", pet.getId());
                response.put("petName", pet.getName());
                response.put("petBreed", pet.getBreed());
                response.put("petAge", pet.getAge());
                response.put("petCategory", pet.getCategory());
                response.put("petImage", pet.getImage_url());
            }

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                response.put("userId", user.getId());
                response.put("userName", user.getName());
                response.put("userEmail", user.getEmail());
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}