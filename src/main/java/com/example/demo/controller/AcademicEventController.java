package com.example.demo.controller;
import com.example.demo.entity.AcademicEvent;
import com.example.demo.service.AcademicEventService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@Tag(name = "Academic Events")
public class AcademicEventController {
    private final AcademicEventService service;
    public AcademicEventController(AcademicEventService service) { this.service = service; }
    @PostMapping
    public AcademicEvent createEvent(@RequestBody AcademicEvent event) { return service.createEvent(event); }
    @PutMapping("/{id}")
    public AcademicEvent updateEvent(@PathVariable Long id, @RequestBody AcademicEvent event) { return service.updateEvent(id, event); }
    @GetMapping("/branch/{branchId}")
    public List<AcademicEvent> getEventsByBranch(@PathVariable Long branchId) { return service.getEventsByBranch(branchId); }
    @GetMapping("/{id}")
    public AcademicEvent getEventById(@PathVariable Long id) { return service.getEventById(id); }
    @GetMapping
    public List<AcademicEvent> getAllEvents() { return service.getAllEvents(); }
}