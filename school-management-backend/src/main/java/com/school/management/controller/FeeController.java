package com.school.management.controller;

import com.school.management.dto.FeeRequest;
import com.school.management.entity.Fee;
import com.school.management.service.FeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fees")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @GetMapping
    public ResponseEntity<List<Fee>> getAllFees() {
        return ResponseEntity.ok(feeService.getAllFees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fee> getFeeById(@PathVariable Long id) {
        return ResponseEntity.ok(feeService.getFeeById(id));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Fee>> getPendingFees() {
        return ResponseEntity.ok(feeService.getPendingFees());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Fee>> getFeesByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(feeService.getFeesByStudentId(studentId));
    }

    @PostMapping
    public ResponseEntity<Fee> createFee(@Valid @RequestBody FeeRequest request) {
        return new ResponseEntity<>(feeService.createFee(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> updateFee(@PathVariable Long id, @Valid @RequestBody FeeRequest request) {
        return ResponseEntity.ok(feeService.updateFee(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteFee(@PathVariable Long id) {
        feeService.deleteFee(id);
        return ResponseEntity.ok(Map.of("message", "Fee record deleted successfully with id: " + id));
    }
}
