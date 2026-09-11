package com.school.management.service;

import com.school.management.dto.AttendancePercentageResponse;
import com.school.management.dto.AttendanceRequest;
import com.school.management.entity.Attendance;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    List<Attendance> getAllAttendance();
    Attendance markAttendance(AttendanceRequest request);
    List<Attendance> markBatchAttendance(List<AttendanceRequest> requests);
    List<Attendance> getAttendanceByDate(LocalDate date);
    List<Attendance> getAttendanceByStudentId(Long studentId);
    List<Attendance> getAttendanceByClassAndDate(Long classId, LocalDate date);
    AttendancePercentageResponse getAttendancePercentage(Long studentId);
}
