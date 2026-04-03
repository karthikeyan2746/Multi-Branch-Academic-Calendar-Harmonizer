package com.example.demo.service.impl;
import com.example.demo.entity.BranchProfile;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.ValidationException;
import com.example.demo.repository.BranchProfileRepository;
import com.example.demo.service.BranchProfileService;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class BranchProfileServiceImpl implements BranchProfileService {
    private final BranchProfileRepository repository;
    public BranchProfileServiceImpl(BranchProfileRepository repository) { this.repository = repository; }
    public BranchProfile createBranch(BranchProfile branch) { 
        return repository.save(branch); 
    }
    public BranchProfile updateBranchStatus(Long id, boolean active) {
        BranchProfile b = getBranchById(id); b.setActive(active); return repository.save(b);
    }
    public List<BranchProfile> getAllBranches() { return repository.findAll(); }
    public BranchProfile getBranchById(Long id) { return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Branch not found")); }
    public BranchProfile findByBranchCode(String code) { return repository.findByBranchCode(code).orElseThrow(()->new ResourceNotFoundException("Branch not found")); }
}