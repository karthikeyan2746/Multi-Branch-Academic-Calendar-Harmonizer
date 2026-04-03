package com.example.demo.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "branch_profiles")
public class BranchProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String branchCode;
    private String branchName;
    private String contactEmail;
    private LocalDateTime lastSyncAt;
    private Boolean active;

    public BranchProfile() {}
    public BranchProfile(Long id, String branchCode, String branchName, String contactEmail, LocalDateTime lastSyncAt, Boolean active) {
        this.id = id;
        this.branchCode = branchCode;
        this.branchName = branchName;
        this.contactEmail = contactEmail;
        this.lastSyncAt = lastSyncAt;
        this.active = active;
    }
    @PrePersist public void prePersist() {
        this.lastSyncAt = LocalDateTime.now();
        if (this.active == null) this.active = true;
    }
    // Getters/Setters omitted for brevity, MUST INCLUDE ALL
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getBranchCode() { return branchCode; } public void setBranchCode(String branchCode) { this.branchCode = branchCode; }
    public String getBranchName() { return branchName; } public void setBranchName(String branchName) { this.branchName = branchName; }
    public String getContactEmail() { return contactEmail; } public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public LocalDateTime getLastSyncAt() { return lastSyncAt; } public void setLastSyncAt(LocalDateTime lastSyncAt) { this.lastSyncAt = lastSyncAt; }
    public Boolean getActive() { return active; } public void setActive(Boolean active) { this.active = active; }
}