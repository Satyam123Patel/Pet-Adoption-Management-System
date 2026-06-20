package com.petadoption.controller;

import com.petadoption.entity.Pet;
import com.petadoption.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pets")
@CrossOrigin(origins = "${app.cors.allowed-origin}")
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private com.cloudinary.Cloudinary cloudinary;

    @Autowired
    private org.springframework.core.io.ResourceLoader resourceLoader;

    @GetMapping
    public ResponseEntity<List<Pet>> getAllPets() {
        List<Pet> pets = petRepository
                .findByStatus("available");
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(
            @PathVariable Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Pet not found: " + id));
        return ResponseEntity.ok(pet);
    }

    @GetMapping("/upload-all-local-to-cloudinary")
    public ResponseEntity<?> uploadLocalToCloudinary() {
        try {
            List<Pet> pets = petRepository.findAll();
            int count = 0;
            java.util.List<String> logs = new java.util.ArrayList<>();
            for (Pet pet : pets) {
                String imgUrl = pet.getImage_url();
                if (imgUrl != null && !imgUrl.startsWith("http")) {
                    try {
                        org.springframework.core.io.Resource resource = resourceLoader.getResource("classpath:static/images/" + imgUrl);
                        if (resource.exists()) {
                            byte[] bytes = org.springframework.util.StreamUtils.copyToByteArray(resource.getInputStream());
                            java.util.Map<?, ?> uploadResult = cloudinary.uploader().upload(bytes, com.cloudinary.utils.ObjectUtils.emptyMap());
                            String secureUrl = (String) uploadResult.get("secure_url");
                            pet.setImage_url(secureUrl);
                            petRepository.save(pet);
                            logs.add("Uploaded " + pet.getName() + " to " + secureUrl);
                            count++;
                        } else {
                            logs.add("Resource not found for " + pet.getName() + " at static/images/" + imgUrl);
                        }
                    } catch (Exception ex) {
                        logs.add("Error uploading " + pet.getName() + " image (" + imgUrl + "): " + ex.getMessage());
                    }
                }
            }
            return ResponseEntity.ok(java.util.Map.of(
                "message", "Upload process completed!",
                "uploadedCount", count,
                "logs", logs
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
}