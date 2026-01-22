package com.petadoption.dto;

public class AdoptionRequestDTO {
    private String email;
    private String phoneNo;
    private String livingSituation;
    private String previousExperience;
    private String familyComposition;
    private Long petId;

    // Getters and Setters
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

    public Long getPetId() {
        return petId;
    }

    public void setPetId(Long petId) {
        this.petId = petId;
    }
}