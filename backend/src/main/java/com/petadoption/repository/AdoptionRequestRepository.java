// package com.petadoption.repository;

// import com.petadoption.entity.AdoptionRequest;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.stereotype.Repository;

// import java.util.List;

// @Repository
// public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {

//     // Find all requests by status
//     List<AdoptionRequest> findByStatus(String status);

//     // Find requests by email
//     List<AdoptionRequest> findByEmail(String email);

//     // Count requests by status
//     long countByStatus(String status);

//     // Find all ordered by created date (newest first)
//     List<AdoptionRequest> findAllByOrderByCreatedAtDesc();
// }

package com.petadoption.repository;

import com.petadoption.entity.AdoptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {

    List<AdoptionRequest> findByStatus(String status);

    List<AdoptionRequest> findByEmail(String email);

    long countByStatus(String status);

    List<AdoptionRequest> findAllByOrderByCreatedAtDesc();
}