package com.school.management.controller;

import com.school.management.dto.AttendancePercentageResponse;
import com.school.management.dto.AttendanceRequest;
import com.school.management.entity.Attendance;
import com.school.management.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @PostMapping
    public ResponseEntity<Attendance> markAttendance(@Valid @RequestBody AttendanceRequest request) {
        return new ResponseEntity<>(attendanceService.markAttendance(request), HttpStatus.CREATED);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<Attendance>> markBatchAttendance(@Valid @RequestBody List<AttendanceRequest> requests) {
        return new ResponseEntity<>(attendanceService.markBatchAttendance(requests), HttpStatus.CREATED);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getAttendanceByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudentId(studentId));
    }

    @GetMapping("/class/{classId}/date/{date}")
    public ResponseEntity<List<Attendance>> getAttendanceByClassAndDate(
            @PathVariable Long classId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByClassAndDate(classId, date));
    }

    @GetMapping("/student/{studentId}/percentage")
    public ResponseEntity<AttendancePercentageResponse> getAttendancePercentage(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendancePercentage(studentId));
    }
}
