package com.example.demo.entity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_merge_records")
public class EventMergeRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sourceEventIds;
    private String mergedTitle;
    private LocalDate mergedStartDate;
    private LocalDate mergedEndDate;
    private String mergeReason;
    private LocalDateTime createdAt;

    public EventMergeRecord() {}
    public EventMergeRecord(Long id, String sourceEventIds, String mergedTitle, LocalDate mergedStartDate, LocalDate mergedEndDate, String mergeReason, LocalDateTime createdAt) {
        this.id = id;
        this.sourceEventIds = sourceEventIds;
        this.mergedTitle = mergedTitle;
        this.mergedStartDate = mergedStartDate;
        this.mergedEndDate = mergedEndDate;
        this.mergeReason = mergeReason;
        this.createdAt = createdAt;
    }
    @PrePersist public void prePersist() { this.createdAt = LocalDateTime.now(); }
    // Getters/Setters omitted for brevity, MUST INCLUDE ALL
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getSourceEventIds() { return sourceEventIds; } public void setSourceEventIds(String sourceEventIds) { this.sourceEventIds = sourceEventIds; }
    public String getMergedTitle() { return mergedTitle; } public void setMergedTitle(String mergedTitle) { this.mergedTitle = mergedTitle; }
    public LocalDate getMergedStartDate() { return mergedStartDate; } public void setMergedStartDate(LocalDate mergedStartDate) { this.mergedStartDate = mergedStartDate; }
    public LocalDate getMergedEndDate() { return mergedEndDate; } public void setMergedEndDate(LocalDate mergedEndDate) { this.mergedEndDate = mergedEndDate; }
    public String getMergeReason() { return mergeReason; } public void setMergeReason(String mergeReason) { this.mergeReason = mergeReason; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}