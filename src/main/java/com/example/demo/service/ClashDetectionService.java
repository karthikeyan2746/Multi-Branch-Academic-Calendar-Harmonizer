package com.example.demo.service;
import com.example.demo.entity.ClashRecord;
import java.util.List;
public interface ClashDetectionService {
    ClashRecord logClash(ClashRecord clash);
    List<ClashRecord> getClashesForEvent(Long eventId);
    ClashRecord resolveClash(Long clashId);
    List<ClashRecord> getUnresolvedClashes();
    List<ClashRecord> getAllClashes();
}