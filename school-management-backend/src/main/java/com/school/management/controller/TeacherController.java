package com.school.management.controller;

import com.school.management.dto.TeacherRequest;
import com.school.management.entity.Teacher;
import com.school.management.service.TeacherService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    private void verifyPrincipalRole(String role) {
        if (role != null && !role.equalsIgnoreCase("ROLE_PRINCIPAL") && !role.equalsIgnoreCase("ROLE_ADMIN") && !role.equalsIgnoreCase("PRINCIPAL")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only the Principal/Admin is authorized to add, modify, or delete teachers.");
        }
    }

    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getTeacherById(id));
    }

    @PostMapping
    public ResponseEntity<Teacher> createTeacher(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @Valid @RequestBody TeacherRequest request) {
        verifyPrincipalRole(role);
        return new ResponseEntity<>(teacherService.createTeacher(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Teacher> updateTeacher(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @PathVariable Long id,
            @Valid @RequestBody TeacherRequest request) {
        verifyPrincipalRole(role);
        return ResponseEntity.ok(teacherService.updateTeacher(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTeacher(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @PathVariable Long id) {
        verifyPrincipalRole(role);
        teacherService.deleteTeacher(id);
        return ResponseEntity.ok(Map.of("message", "Teacher deleted successfully with id: " + id));
    }
}
