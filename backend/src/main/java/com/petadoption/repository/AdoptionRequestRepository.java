package com.petadoption.repository;

import com.petadoption.entity.AdoptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ✅ CORRECTED Repository - Uses userId (FK), NOT email
 */
@Repository
public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {

    // ✅ Find by status (PENDING, APPROVED, REJECTED)
    List<AdoptionRequest> findByStatus(AdoptionRequest.Status status);

    // ✅ ALTERNATIVE: Find by status as String
    @Query("SELECT ar FROM AdoptionRequest ar WHERE ar.status = :status")
    List<AdoptionRequest> findByStatusString(String status);

    // ✅ Find by user ID (FK to users table)
    List<AdoptionRequest> findByUserId(Long userId);

    // ✅ Find by pet ID (FK to pet table)
    List<AdoptionRequest> findByPetId(Long petId);

    // ✅ Count by status
    long countByStatus(AdoptionRequest.Status status);

    // ✅ Find all ordered by created date (newest first)
    List<AdoptionRequest> findAllByOrderByCreatedAtDesc();

    // ✅ Find pending requests for a specific pet
    List<AdoptionRequest> findByPetIdAndStatus(Long petId, AdoptionRequest.Status status);

    // ✅ Find all requests by a user
    List<AdoptionRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
}