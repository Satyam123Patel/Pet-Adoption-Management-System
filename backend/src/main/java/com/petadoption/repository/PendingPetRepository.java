//1
package com.petadoption.repository;

import com.petadoption.entity.PendingPets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PendingPetRepository extends JpaRepository<PendingPets, Long> {
        List<PendingPets> findByStatus(String status);
}