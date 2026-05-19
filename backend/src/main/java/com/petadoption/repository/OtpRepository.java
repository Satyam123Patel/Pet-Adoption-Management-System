//1
package com.petadoption.repository;

import com.petadoption.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findTopByEmailOrderByIdDesc(String email);

    void deleteByEmail(String email);
}
