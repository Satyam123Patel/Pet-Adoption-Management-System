package com.petadoption.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "adoption_requests")
public class AdoptionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "pet_id", nullable = false)
    private Long petId;

    @Column(name = "living_situation", columnDefinition = "TEXT")
    private String livingSituation;

    @Column(name = "previous_experience", columnDefinition = "TEXT")
    private String previousExperience;

    @Column(name = "family_composition", columnDefinition = "TEXT")
    private String familyComposition;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ✅ ENUM
    public enum Status {
        PENDING, APPROVED, REJECTED
    }

    // ✅ LIFECYCLE HOOKS
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ========================================
    // GETTERS AND SETTERS
    // ========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getPetId() {
        return petId;
    }

    public void setPetId(Long petId) {
        this.petId = petId;
    }

    public String getLivingSituation() {
        return livingSituation;
    }

    public void setLivingSituation(String livingSituation) {
        this.livingSituation = livingSituation;
    }

    public String getPreviousExperience() {
        return previousExperience;
    }

    public void setPreviousExperience(String previousExperience) {
        this.previousExperience = previousExperience;
    }

    public String getFamilyComposition() {
        return familyComposition;
    }

    public void setFamilyComposition(String familyComposition) {
        this.familyComposition = familyComposition;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    // ✅ Helper method to set status from String
    public void setStatus(String status) {
        this.status = Status.valueOf(status.toUpperCase());
    }

    // ✅ THIS METHOD WAS MISSING - ADD IT!
    public String getStatusString() {
        return status.name();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}