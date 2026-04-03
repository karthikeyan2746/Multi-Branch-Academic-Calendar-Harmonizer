package com.example.demo.repository;
import com.example.demo.entity.HarmonizedCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDate;
public interface HarmonizedCalendarRepository extends JpaRepository<HarmonizedCalendar, Long> {
    List<HarmonizedCalendar> findByEffectiveFromLessThanEqualAndEffectiveToGreaterThanEqual(LocalDate date1, LocalDate date2);
}