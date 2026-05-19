//1
package com.petadoption.repository;

import com.petadoption.entity.Tracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrackingRepository extends JpaRepository<Tracking, Integer> {

    // Find all tracking records for a specific pet
    List<Tracking> findByPetIdOrderByUpdatedAtDesc(Long petId);

    // Find vaccinated pets
    List<Tracking> findByVaccinated(Boolean vaccinated);

    // Find tracking records by location
    List<Tracking> findByLocationContaining(String location);
}