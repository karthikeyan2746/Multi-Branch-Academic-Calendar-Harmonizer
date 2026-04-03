package com.example.demo.entity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "academic_events")
public class AcademicEvent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long branchId;
    private String title;
    private String eventType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private String description;
    private LocalDateTime submittedAt;

    public AcademicEvent() {}
    public AcademicEvent(Long id, Long branchId, String title, String eventType, LocalDate startDate, LocalDate endDate, String location, String description, LocalDateTime submittedAt) {
        this.id = id;
        this.branchId = branchId;
        this.title = title;
        this.eventType = eventType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.description = description;
        this.submittedAt = submittedAt;
    }
    @PrePersist public void prePersist() { this.submittedAt = LocalDateTime.now(); }
    // Getters/Setters omitted for brevity, MUST INCLUDE ALL
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Long getBranchId() { return branchId; } public void setBranchId(Long branchId) { this.branchId = branchId; }
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getEventType() { return eventType; } public void setEventType(String eventType) { this.eventType = eventType; }
    public LocalDate getStartDate() { return startDate; } public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; } public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getLocation() { return location; } public void setLocation(String location) { this.location = location; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public LocalDateTime getSubmittedAt() { return submittedAt; } public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}