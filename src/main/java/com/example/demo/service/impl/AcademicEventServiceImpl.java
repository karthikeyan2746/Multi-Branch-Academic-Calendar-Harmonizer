package com.example.demo.service.impl;
import com.example.demo.entity.AcademicEvent;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.ValidationException;
import com.example.demo.repository.AcademicEventRepository;
import com.example.demo.service.AcademicEventService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AcademicEventServiceImpl implements AcademicEventService {
    private final AcademicEventRepository repository;
    public AcademicEventServiceImpl(AcademicEventRepository repository) { this.repository = repository; }
    @Override
    public AcademicEvent createEvent(AcademicEvent event) {
        // FIX for t19: Date validation
        if (event.getStartDate() != null && event.getEndDate() != null && event.getStartDate().isAfter(event.getEndDate())) {
            throw new ValidationException("startDate cannot be after endDate");
        }
        return repository.save(event);
    }
    @Override
    public List<AcademicEvent> getEventsByBranch(Long branchId) { return repository.findByBranchId(branchId); }
    @Override
    public AcademicEvent updateEvent(Long id, AcademicEvent event) {
        AcademicEvent existing = getEventById(id);
        if (event.getStartDate().isAfter(event.getEndDate())) throw new ValidationException("startDate cannot be after endDate");
        existing.setTitle(event.getTitle()); // Add other fields as needed
        return repository.save(existing);
    }
    @Override
    public AcademicEvent getEventById(Long id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event not found")); }
    @Override
    public List<AcademicEvent> getAllEvents() { return repository.findAll(); }
}