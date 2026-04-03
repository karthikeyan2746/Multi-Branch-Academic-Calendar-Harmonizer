package com.example.demo.service;
import com.example.demo.entity.AcademicEvent;
import java.util.List;
public interface AcademicEventService {
    AcademicEvent createEvent(AcademicEvent event);
    List<AcademicEvent> getEventsByBranch(Long branchId);
    AcademicEvent updateEvent(Long id, AcademicEvent event);
    AcademicEvent getEventById(Long id);
    List<AcademicEvent> getAllEvents();
}