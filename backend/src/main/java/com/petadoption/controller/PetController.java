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
}