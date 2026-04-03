package com.example.demo.entity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "harmonized_calendars")
public class HarmonizedCalendar {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String generatedBy;
    private LocalDateTime generatedAt;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    @Column(columnDefinition = "TEXT")
    private String eventsJson;

    public HarmonizedCalendar() {}
    public HarmonizedCalendar(Long id, String title, String generatedBy, LocalDateTime generatedAt, LocalDate effectiveFrom, LocalDate effectiveTo, String eventsJson) {
        this.id = id;
        this.title = title;
        this.generatedBy = generatedBy;
        this.generatedAt = generatedAt;
        this.effectiveFrom = effectiveFrom;
        this.effectiveTo = effectiveTo;
        this.eventsJson = eventsJson;
    }
    @PrePersist public void prePersist() { this.generatedAt = LocalDateTime.now(); }
    // Getters/Setters omitted for brevity, MUST INCLUDE ALL
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getGeneratedBy() { return generatedBy; } public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }
    public LocalDateTime getGeneratedAt() { return generatedAt; } public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
    public LocalDate getEffectiveFrom() { return effectiveFrom; } public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }
    public LocalDate getEffectiveTo() { return effectiveTo; } public void setEffectiveTo(LocalDate effectiveTo) { this.effectiveTo = effectiveTo; }
    public String getEventsJson() { return eventsJson; } public void setEventsJson(String eventsJson) { this.eventsJson = eventsJson; }
}