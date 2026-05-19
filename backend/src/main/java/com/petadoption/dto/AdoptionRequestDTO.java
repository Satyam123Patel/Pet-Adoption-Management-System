package com.petadoption.dto;

/**
 * ✅ DTO for adoption request submission
 * Frontend sends email (we convert to user_id in backend)
 */
public class AdoptionRequestDTO {

    private String email;
    private String phoneNo;
    private String livingSituation;
    private String previousExperience;
    private String familyComposition;

    // ========================================
    // CONSTRUCTORS
    // ========================================

    public AdoptionRequestDTO() {
    }

    public AdoptionRequestDTO(String email, String phoneNo, String livingSituation,
            String previousExperience, String familyComposition) {
        this.email = email;
        this.phoneNo = phoneNo;
        this.livingSituation = livingSituation;
        this.previousExperience = previousExperience;
        this.familyComposition = familyComposition;
    }

    // ========================================
    // GETTERS AND SETTERS
    // ========================================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
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

    @Override
    public String toString() {
        return "AdoptionRequestDTO{" +
                "email='" + email + '\'' +
                ", phoneNo='" + phoneNo + '\'' +
                ", livingSituation='" + livingSituation + '\'' +
                ", previousExperience='" + previousExperience + '\'' +
                ", familyComposition='" + familyComposition + '\'' +
                '}';
    }
}