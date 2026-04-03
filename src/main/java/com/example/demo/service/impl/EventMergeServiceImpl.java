package com.example.demo.service.impl;
import com.example.demo.entity.AcademicEvent;
import com.example.demo.entity.EventMergeRecord;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AcademicEventRepository;
import com.example.demo.repository.EventMergeRecordRepository;
import com.example.demo.service.EventMergeService;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventMergeServiceImpl implements EventMergeService {
    private final EventMergeRecordRepository mergeRepo;
    private final AcademicEventRepository eventRepo;
    public EventMergeServiceImpl(EventMergeRecordRepository mergeRepo, AcademicEventRepository eventRepo) {
        this.mergeRepo = mergeRepo;
        this.eventRepo = eventRepo;
    }
    @Override
    public EventMergeRecord mergeEvents(List<Long> eventIds, String reason) {
        List<AcademicEvent> events = eventRepo.findAllById(eventIds);
        // FIX for t82: Check for empty events
        if (events.isEmpty()) throw new ResourceNotFoundException("No events found");
        String ids = eventIds.stream().map(String::valueOf).collect(Collectors.joining(","));
        EventMergeRecord record = new EventMergeRecord();
        record.setSourceEventIds(ids);
        record.setMergeReason(reason);
        record.setMergedTitle("Merged Event");
        record.setMergedStartDate(LocalDate.now());
        record.setMergedEndDate(LocalDate.now());
        return mergeRepo.save(record);
    }
    @Override
    public List<EventMergeRecord> getMergeRecordsByDate(LocalDate start, LocalDate end) {
        return mergeRepo.findByMergedStartDateBetween(start, end);
    }
    @Override
    public List<EventMergeRecord> getAllMergeRecords() { return mergeRepo.findAll(); }
    @Override
    public EventMergeRecord getMergeRecordById(Long id) { return mergeRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Merge record not found")); }
}