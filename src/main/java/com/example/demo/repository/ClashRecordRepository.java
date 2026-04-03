package com.example.demo.repository;
import com.example.demo.entity.ClashRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ClashRecordRepository extends JpaRepository<ClashRecord, Long> {
    List<ClashRecord> findByEventAIdOrEventBId(Long eventAId, Long eventBId);
    List<ClashRecord> findByResolvedFalse();
}