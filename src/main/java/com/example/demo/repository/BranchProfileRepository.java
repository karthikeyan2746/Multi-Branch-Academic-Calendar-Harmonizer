package com.example.demo.repository;
import com.example.demo.entity.BranchProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface BranchProfileRepository extends JpaRepository<BranchProfile, Long> {
    Optional<BranchProfile> findByBranchCode(String branchCode);
}