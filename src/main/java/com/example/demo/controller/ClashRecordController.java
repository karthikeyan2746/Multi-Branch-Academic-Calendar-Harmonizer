package com.example.demo.controller;
import com.example.demo.entity.ClashRecord;
import com.example.demo.service.ClashDetectionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clashes")
@Tag(name = "Clash Records")
public class ClashRecordController {
    private final ClashDetectionService service;
    public ClashRecordController(ClashDetectionService service) { this.service = service; }
    @PostMapping
    public ClashRecord logClash(@RequestBody ClashRecord clash) { return service.logClash(clash); }
    @PutMapping("/{id}/resolve")
    public ClashRecord resolveClash(@PathVariable Long id) { return service.resolveClash(id); }
    @GetMapping("/event/{eventId}")
    public List<ClashRecord> getClashesForEvent(@PathVariable Long eventId) { return service.getClashesForEvent(eventId); }
    @GetMapping("/unresolved")
    public List<ClashRecord> getUnresolvedClashes() { return service.getUnresolvedClashes(); }
    @GetMapping
    public List<ClashRecord> getAllClashes() { return service.getAllClashes(); }
}