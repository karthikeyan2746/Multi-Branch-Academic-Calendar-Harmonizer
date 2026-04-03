package com.example.demo.controller;
import com.example.demo.entity.HarmonizedCalendar;
import com.example.demo.service.HarmonizedCalendarService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/harmonized-calendars")
@Tag(name = "Harmonized Calendars")
public class HarmonizedCalendarController {
    private final HarmonizedCalendarService service;
    public HarmonizedCalendarController(HarmonizedCalendarService service) { this.service = service; }
    @PostMapping("/generate")
    public HarmonizedCalendar generateCalendar(@RequestBody Map<String, String> payload) { return service.generateHarmonizedCalendar(payload.get("title"), payload.get("generatedBy")); }
    @GetMapping("/{id}")
    public HarmonizedCalendar getCalendarById(@PathVariable Long id) { return service.getCalendarById(id); }
    @GetMapping
    public List<HarmonizedCalendar> getAllCalendars() { return service.getAllCalendars(); }
    @GetMapping("/range")
    public List<HarmonizedCalendar> getCalendarsRange(@RequestParam LocalDate start, @RequestParam LocalDate end) { return service.getCalendarsWithinRange(start, end); }
}