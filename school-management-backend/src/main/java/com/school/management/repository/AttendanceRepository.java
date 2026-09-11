package com.school.management.repository;

import com.school.management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByStudentId(Long studentId);
    Optional<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);
    List<Attendance> findByStudentSchoolClassIdAndDate(Long classId, LocalDate date);
    long countByDateAndStatus(LocalDate date, String status);
    long countByStudentId(Long studentId);
    long countByStudentIdAndStatus(Long studentId, String status);
}
