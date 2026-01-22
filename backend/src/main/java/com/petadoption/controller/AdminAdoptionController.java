package com.petadoption.controller;

import com.petadoption.entity.AdoptionRequest;
import com.petadoption.entity.Pet;
import com.petadoption.repository.AdoptionRequestRepository;
import com.petadoption.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/adoptions")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminAdoptionController {

    @Autowired
    private AdoptionRequestRepository adoptionRequestRepository;

    @Autowired
    private PetRepository petRepository;

    // Get all pending adoption requests
    @GetMapping("/pending")
    public ResponseEntity<List<AdoptionRequest>> getPendingRequests() {
        List<AdoptionRequest> requests = adoptionRequestRepository.findByStatus("PENDING");
        return ResponseEntity.ok(requests);
    }

    // Get all approved adoption requests
    @GetMapping("/approved")
    public ResponseEntity<List<AdoptionRequest>> getApprovedRequests() {
        List<AdoptionRequest> requests = adoptionRequestRepository.findByStatus("APPROVED");
        return ResponseEntity.ok(requests);
    }

    // Get all adoption requests
    @GetMapping("/all")
    public ResponseEntity<List<AdoptionRequest>> getAllRequests() {
        List<AdoptionRequest> requests = adoptionRequestRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(requests);
    }

    // Approve adoption request
    @PutMapping("/{id}/approve")
    @Transactional
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        try {
            AdoptionRequest request = adoptionRequestRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            // Update request status
            request.setStatus("APPROVED");
            request.setUpdatedAt(LocalDateTime.now());
            adoptionRequestRepository.save(request);

            // Update pet status to adopted
            Pet pet = petRepository.findById(request.getPetId())
                    .orElseThrow(() -> new RuntimeException("Pet not found"));
            pet.setStatus("adopted");
            petRepository.save(pet);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Adoption request approved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Reject adoption request
    @PutMapping("/{id}/reject")
    @Transactional
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        try {
            AdoptionRequest request = adoptionRequestRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            // DELETE the request instead of just marking as rejected
            adoptionRequestRepository.delete(request);

            // Update pet status back to available
            Pet pet = petRepository.findById(request.getPetId())
                    .orElseThrow(() -> new RuntimeException("Pet not found"));
            pet.setStatus("available");
            petRepository.save(pet);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Adoption request rejected and deleted");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete adoption request
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        try {
            adoptionRequestRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Request deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}