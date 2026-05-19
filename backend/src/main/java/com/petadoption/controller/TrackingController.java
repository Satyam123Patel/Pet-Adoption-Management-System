package com.petadoption.controller;

import com.petadoption.entity.Tracking;
import com.petadoption.repository.TrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/tracking")
@CrossOrigin(origins = "${app.cors.allowed-origin}")
public class TrackingController {

    @Autowired
    private TrackingRepository trackingRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ✅ Get all tracking records for a specific pet
    @GetMapping("/pet/{petId}")
    public ResponseEntity<?> getTrackingByPetId(@PathVariable Long petId) {
        try {
            List<Tracking> trackingList = trackingRepository.findByPetIdOrderByUpdatedAtDesc(petId);
            System.out.println("📋 Found " + trackingList.size() + " tracking records for pet ID: " + petId);
            return ResponseEntity.ok(trackingList);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to fetch tracking records: " + e.getMessage()));
        }
    }

    // ✅ Get all adopted pets with their tracking info
    @GetMapping("/adopted-pets")
    public ResponseEntity<?> getAdoptedPetsWithTracking() {
        try {
            String sql = """
                        SELECT
                            p.id,
                            p.name,
                            p.category,
                            p.breed,
                            p.age,
                            p.gender,
                            p.image_url,
                            COUNT(t.track_id) as tracking_count,
                            MAX(t.updated_at) as last_update
                        FROM pet p
                        LEFT JOIN tracking t ON p.id = t.pet_id
                        WHERE p.status = 'adopted'
                        GROUP BY p.id, p.name, p.category, p.breed, p.age, p.gender, p.image_url
                        ORDER BY last_update DESC
                    """;

            List<Map<String, Object>> pets = jdbcTemplate.queryForList(sql);
            System.out.println("📋 Found " + pets.size() + " adopted pets with tracking info");
            return ResponseEntity.ok(pets);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to fetch adopted pets: " + e.getMessage()));
        }
    }

    // ✅ Add tracking record for a pet
    @PostMapping("/add")
    public ResponseEntity<?> addTrackingRecord(@RequestBody Map<String, Object> trackingData) {
        try {
            Long petId = Long.valueOf(trackingData.get("petId").toString());
            String location = (String) trackingData.get("location");
            String note = (String) trackingData.get("note");
            Boolean vaccinated = trackingData.get("vaccinated") != null
                    ? Boolean.valueOf(trackingData.get("vaccinated").toString())
                    : false;

            LocalDate vetVisitDate = null;
            if (trackingData.get("vetVisitDate") != null) {
                vetVisitDate = LocalDate.parse(trackingData.get("vetVisitDate").toString());
            }

            Tracking tracking = new Tracking();
            tracking.setPetId(petId);
            tracking.setLocation(location);
            tracking.setNote(note);
            tracking.setVaccinated(vaccinated);
            tracking.setVetVisitDate(vetVisitDate);
            tracking.setUpdatedAt(LocalDateTime.now());

            trackingRepository.save(tracking);

            System.out.println("✅ Tracking record added for pet ID: " + petId);
            return ResponseEntity.ok(Map.of(
                    "message", "Tracking record added successfully",
                    "trackingId", tracking.getTrackId()));

        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to add tracking record: " + e.getMessage()));
        }
    }

    // ✅ Update tracking record
    @PutMapping("/update/{trackId}")
    public ResponseEntity<?> updateTrackingRecord(
            @PathVariable Integer trackId,
            @RequestBody Map<String, Object> updates) {
        try {
            Optional<Tracking> trackingOpt = trackingRepository.findById(trackId);
            if (!trackingOpt.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Tracking record not found"));
            }

            Tracking tracking = trackingOpt.get();

            if (updates.containsKey("location")) {
                tracking.setLocation((String) updates.get("location"));
            }
            if (updates.containsKey("note")) {
                tracking.setNote((String) updates.get("note"));
            }
            if (updates.containsKey("vaccinated")) {
                tracking.setVaccinated(Boolean.valueOf(updates.get("vaccinated").toString()));
            }
            if (updates.containsKey("vetVisitDate")) {
                tracking.setVetVisitDate(LocalDate.parse(updates.get("vetVisitDate").toString()));
            }

            tracking.setUpdatedAt(LocalDateTime.now());
            trackingRepository.save(tracking);

            System.out.println("✅ Tracking record updated: " + trackId);
            return ResponseEntity.ok(Map.of("message", "Tracking record updated successfully"));

        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to update tracking record: " + e.getMessage()));
        }
    }

    // ✅ Delete tracking record
    @DeleteMapping("/delete/{trackId}")
    public ResponseEntity<?> deleteTrackingRecord(@PathVariable Integer trackId) {
        try {
            if (!trackingRepository.existsById(trackId)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Tracking record not found"));
            }

            trackingRepository.deleteById(trackId);
            System.out.println("🗑️ Tracking record deleted: " + trackId);
            return ResponseEntity.ok(Map.of("message", "Tracking record deleted successfully"));

        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to delete tracking record: " + e.getMessage()));
        }
    }

    // ✅ Get vaccination statistics
    @GetMapping("/stats/vaccination")
    public ResponseEntity<?> getVaccinationStats() {
        try {
            String sql = """
                        SELECT
                            COUNT(DISTINCT pet_id) as total_pets,
                            SUM(CASE WHEN vaccinated = TRUE THEN 1 ELSE 0 END) as vaccinated_count,
                            SUM(CASE WHEN vaccinated = FALSE THEN 1 ELSE 0 END) as not_vaccinated_count
                        FROM tracking
                    """;

            Map<String, Object> stats = jdbcTemplate.queryForMap(sql);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to fetch vaccination stats: " + e.getMessage()));
        }
    }

    // ✅ Get recent tracking activities
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentActivities(@RequestParam(defaultValue = "10") int limit) {
        try {
            String sql = """
                        SELECT
                            t.track_id,
                            t.pet_id,
                            p.name as pet_name,
                            t.location,
                            t.note,
                            t.vaccinated,
                            t.vet_visit_date,
                            t.updated_at
                        FROM tracking t
                        LEFT JOIN pet p ON t.pet_id = p.id
                        ORDER BY t.updated_at DESC
                        LIMIT ?
                    """;

            List<Map<String, Object>> activities = jdbcTemplate.queryForList(sql, limit);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to fetch recent activities: " + e.getMessage()));
        }
    }
}