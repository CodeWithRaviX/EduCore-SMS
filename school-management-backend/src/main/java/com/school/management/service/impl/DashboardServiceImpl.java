package com.school.management.service.impl;

import com.school.management.dto.DashboardResponse;
import com.school.management.repository.*;
import com.school.management.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ClassRepository classRepository;
    private final AttendanceRepository attendanceRepository;
    private final FeeRepository feeRepository;

    public DashboardServiceImpl(
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            ClassRepository classRepository,
            AttendanceRepository attendanceRepository,
            FeeRepository feeRepository) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.classRepository = classRepository;
        this.attendanceRepository = attendanceRepository;
        this.feeRepository = feeRepository;
    }

    @Override
    public DashboardResponse getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long totalClasses = classRepository.count();

        LocalDate today = LocalDate.now();
        long totalPresentToday = attendanceRepository.countByDateAndStatus(today, "PRESENT");
        long totalAbsentToday = attendanceRepository.countByDateAndStatus(today, "ABSENT");

        Double pendingFeesSum = feeRepository.sumPendingFees();
        double totalPendingFees = (pendingFeesSum != null) ? pendingFeesSum : 0.0;

        return new DashboardResponse(
                totalStudents,
                totalTeachers,
                totalClasses,
                totalPresentToday,
                totalAbsentToday,
                totalPendingFees
        );
    }
}
