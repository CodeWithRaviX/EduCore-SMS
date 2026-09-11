package com.school.management.service.impl;

import com.school.management.dto.AttendancePercentageResponse;
import com.school.management.dto.AttendanceRequest;
import com.school.management.entity.Attendance;
import com.school.management.entity.Student;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.repository.AttendanceRepository;
import com.school.management.repository.StudentRepository;
import com.school.management.service.AttendanceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceServiceImpl(AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    @Override
    public Attendance markAttendance(AttendanceRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));

        String normalizedStatus = request.getStatus().trim().toUpperCase();
        if (!"PRESENT".equals(normalizedStatus) && !"ABSENT".equals(normalizedStatus)) {
            throw new IllegalArgumentException("Status must be either PRESENT or ABSENT");
        }

        // Prevent duplicates for same student and date: if exists, update it; otherwise create new
        Optional<Attendance> existingOpt = attendanceRepository.findByStudentIdAndDate(request.getStudentId(), request.getDate());
        Attendance attendance;
        if (existingOpt.isPresent()) {
            attendance = existingOpt.get();
            attendance.setStatus(normalizedStatus);
        } else {
            attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setDate(request.getDate());
            attendance.setStatus(normalizedStatus);
        }

        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> markBatchAttendance(List<AttendanceRequest> requests) {
        List<Attendance> results = new ArrayList<>();
        for (AttendanceRequest req : requests) {
            results.add(markAttendance(req));
        }
        return results;
    }

    @Override
    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    @Override
    public List<Attendance> getAttendanceByStudentId(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        return attendanceRepository.findByStudentId(studentId);
    }

    @Override
    public List<Attendance> getAttendanceByClassAndDate(Long classId, LocalDate date) {
        return attendanceRepository.findByStudentSchoolClassIdAndDate(classId, date);
    }

    @Override
    public AttendancePercentageResponse getAttendancePercentage(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        long totalRecords = attendanceRepository.countByStudentId(studentId);
        long presentRecords = attendanceRepository.countByStudentIdAndStatus(studentId, "PRESENT");
        long absentRecords = attendanceRepository.countByStudentIdAndStatus(studentId, "ABSENT");

        double percentage = 0.0;
        if (totalRecords > 0) {
            percentage = ((double) presentRecords / totalRecords) * 100.0;
            percentage = BigDecimal.valueOf(percentage).setScale(2, RoundingMode.HALF_UP).doubleValue();
        }

        return new AttendancePercentageResponse(
                student.getId(),
                student.getName(),
                totalRecords,
                presentRecords,
                absentRecords,
                percentage
        );
    }
}
