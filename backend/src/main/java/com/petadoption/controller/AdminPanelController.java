package com.petadoption.controller;

import com.petadoption.entity.PendingPets;
import com.petadoption.entity.User;
import com.petadoption.repository.PendingPetRepository;
import com.petadoption.repository.UserRepository;
import com.petadoption.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/pets")
@CrossOrigin(origins = "${app.cors.allowed-origin}")
public class AdminPanelController {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${mail.from}")
    private String mailFrom;

    @Value("${app.cors.allowed-origin}")
    private String corsOrigin;

    @Autowired
    private PendingPetRepository pendingPetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private CloudinaryService cloudinaryService;

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingPets() {
        try {
            List<PendingPets> pendingPets = pendingPetRepository
                    .findByStatus("pending");
            return ResponseEntity.ok(pendingPets);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error",
                            "Failed to fetch: "
                                    + e.getMessage()));
        }
    }

    @GetMapping("/approved")
    public ResponseEntity<?> getApprovedPets() {
        try {
            String sql = "SELECT * FROM pet "
                    + "WHERE status = 'available' "
                    + "ORDER BY id DESC";
            return ResponseEntity.ok(
                    jdbcTemplate.queryForList(sql));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/adopted")
    public ResponseEntity<?> getAdoptedPets() {
        try {
            String sql = "SELECT * FROM pet "
                    + "WHERE status = 'adopted' "
                    + "ORDER BY id DESC";
            return ResponseEntity.ok(
                    jdbcTemplate.queryForList(sql));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addPet(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) Integer age,
            @RequestParam(defaultValue = "U") String gender,
            @RequestParam(defaultValue = "available") String status,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            System.out.println(
                    "📥 Adding pet: " + name);

            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = cloudinaryService
                        .uploadImage(image);
                System.out.println(
                        "✅ Image uploaded: " + imageUrl);
            }

            String sql = "INSERT INTO pet (name, "
                    + "category, breed, age, gender, "
                    + "status, image_url) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, name, category,
                    breed, age, gender, status, imageUrl);

            return ResponseEntity.ok(Map.of(
                    "message", "Pet added successfully"));

        } catch (Exception e) {
            System.err.println(
                    "❌ Failed: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error",
                            "Failed to add pet: "
                                    + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePet(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) Integer age,
            @RequestParam(defaultValue = "U") String gender,
            @RequestParam(defaultValue = "available") String status,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            System.out.println(
                    "✏️ Updating pet ID: " + id);

            if (image != null && !image.isEmpty()) {
                String imageUrl = cloudinaryService
                        .uploadImage(image);
                jdbcTemplate.update(
                        "UPDATE pet SET name=?, "
                                + "category=?, breed=?, age=?, "
                                + "gender=?, status=?, "
                                + "image_url=? WHERE id=?",
                        name, category, breed, age,
                        gender, status, imageUrl, id);
            } else {
                jdbcTemplate.update(
                        "UPDATE pet SET name=?, "
                                + "category=?, breed=?, age=?, "
                                + "gender=?, status=? WHERE id=?",
                        name, category, breed, age,
                        gender, status, id);
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Pet updated successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error",
                            "Failed to update: "
                                    + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(
            @PathVariable Long id) {
        try {
            jdbcTemplate.update(
                    "DELETE FROM pet WHERE id = ?", id);
            return ResponseEntity.ok(Map.of(
                    "message", "Pet deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/approve/{id}")
    @Transactional
    public ResponseEntity<?> approvePet(
            @PathVariable Long id) {
        try {
            PendingPets pendingPet = pendingPetRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(
                            "Pet not found"));

            User user = userRepository
                    .findByEmail(pendingPet.getEmail())
                    .orElseThrow(() -> new RuntimeException(
                            "User not found: "
                                    + pendingPet.getEmail()));

            String gender = "U";
            if (pendingPet.getGender() != null
                    && !pendingPet.getGender()
                            .isBlank()) {
                String g = pendingPet.getGender()
                        .substring(0, 1).toUpperCase();
                if (g.equals("M") || g.equals("F")) {
                    gender = g;
                }
            }

            String insertSql = "INSERT INTO pet (name, category, "
                    + "breed, age, gender, status, "
                    + "image_url) "
                    + "VALUES (?, ?, ?, ?, ?, "
                    + "'available', ?)";

            jdbcTemplate.update(insertSql,
                    pendingPet.getName(),
                    pendingPet.getCategory(),
                    pendingPet.getBreed(),
                    pendingPet.getAge(),
                    gender,
                    pendingPet.getImagePath());

            pendingPet.setStatus("approved");
            pendingPetRepository.save(pendingPet);

            sendPetDonationApprovalEmail(
                    user, pendingPet);

            return ResponseEntity.ok(Map.of(
                    "message",
                    "Pet approved! Email sent to donor."));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error",
                            "Failed to approve: "
                                    + e.getMessage()));
        }
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<?> rejectPet(
            @PathVariable Long id) {
        try {
            PendingPets pendingPet = pendingPetRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(
                            "Pet not found"));
            pendingPet.setStatus("rejected");
            pendingPetRepository.save(pendingPet);
            return ResponseEntity.ok(Map.of(
                    "message",
                    "Pet rejected successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error",
                            "Failed to reject: "
                                    + e.getMessage()));
        }
    }

    private void sendPetDonationApprovalEmail(
            User user, PendingPets pet) {
        try {
            String emailBody = String.format(
                    "Dear %s,\n\n"
                            + "Your pet donation has been "
                            + "APPROVED!\n\n"
                            + "Pet Details:\n"
                            + "- Name: %s\n"
                            + "- Breed: %s\n"
                            + "- Age: %d years\n"
                            + "- Category: %s\n\n"
                            + "Your pet is now listed on our "
                            + "adoption platform!\n\n"
                            + "View at: %s/pets\n\n"
                            + "Best regards,\n"
                            + "Pet Adoption Team",
                    user.getName(),
                    pet.getName(),
                    pet.getBreed() != null
                            ? pet.getBreed()
                            : "Not specified",
                    pet.getAge() != null ? pet.getAge() : 0,
                    pet.getCategory(),
                    corsOrigin);

            String jsonBody = String.format(
                    "{"
                            + "\"personalizations\":"
                            + "[{\"to\":[{\"email\":\"%s\"}]}],"
                            + "\"from\":{\"email\":\"%s\","
                            + "\"name\":\"Pet Adoption Team\"},"
                            + "\"subject\":"
                            + "\"Your Pet Donation Approved!\","
                            + "\"content\":[{\"type\":"
                            + "\"text/plain\",\"value\":\"%s\"}]"
                            + "}",
                    user.getEmail(),
                    mailFrom,
                    emailBody
                            .replace("\"", "\\\"")
                            .replace("\n", "\\n"));

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(
                            "https://api.sendgrid.com"
                                    + "/v3/mail/send"))
                    .header("Authorization",
                            "Bearer " + sendGridApiKey)
                    .header("Content-Type",
                            "application/json")
                    .POST(HttpRequest.BodyPublishers
                            .ofString(jsonBody))
                    .build();

            HttpResponse<String> response = client.send(httpRequest,
                    HttpResponse.BodyHandlers
                            .ofString());

            if (response.statusCode() == 202) {
                System.out.println(
                        "📧 Email sent to: "
                                + user.getEmail());
            } else {
                System.err.println(
                        "❌ SendGrid error: "
                                + response.statusCode());
            }

        } catch (Exception e) {
            System.err.println(
                    "❌ Email failed: " + e.getMessage());
        }
    }
}