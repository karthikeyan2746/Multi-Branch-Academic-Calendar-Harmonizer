package com.example.demo.service.impl;
import com.example.demo.entity.ClashRecord;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ClashRecordRepository;
import com.example.demo.service.ClashDetectionService;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ClashDetectionServiceImpl implements ClashDetectionService {
    private final ClashRecordRepository repository;
    public ClashDetectionServiceImpl(ClashRecordRepository repository) { this.repository = repository; }
    public ClashRecord logClash(ClashRecord clash) { return repository.save(clash); }
    public List<ClashRecord> getClashesForEvent(Long id) { return repository.findByEventAIdOrEventBId(id, id); }
    public ClashRecord resolveClash(Long id) { ClashRecord c = repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Clash not found")); c.setResolved(true); return repository.save(c); }
    public List<ClashRecord> getUnresolvedClashes() { return repository.findByResolvedFalse(); }
    public List<ClashRecord> getAllClashes() { return repository.findAll(); }
}