//1
package com.petadoption.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tracking")
public class Tracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "track_id")
    private Integer trackId;

    @Column(name = "pet_id", nullable = false)
    private Long petId;

    @Column(name = "location")
    private String location;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "vet_visit_date")
    private LocalDate vetVisitDate;

    @Column(name = "vaccinated")
    private Boolean vaccinated = false;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Tracking() {
    }

    public Tracking(Long petId, String location, String note) {
        this.petId = petId;
        this.location = location;
        this.note = note;
        this.vaccinated = false;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getTrackId() {
        return trackId;
    }

    public void setTrackId(Integer trackId) {
        this.trackId = trackId;
    }

    public Long getPetId() {
        return petId;
    }

    public void setPetId(Long petId) {
        this.petId = petId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDate getVetVisitDate() {
        return vetVisitDate;
    }

    public void setVetVisitDate(LocalDate vetVisitDate) {
        this.vetVisitDate = vetVisitDate;
    }

    public Boolean getVaccinated() {
        return vaccinated;
    }

    public void setVaccinated(Boolean vaccinated) {
        this.vaccinated = vaccinated;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}