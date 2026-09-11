package com.school.management.service;

import com.school.management.dto.FeeRequest;
import com.school.management.entity.Fee;

import java.util.List;

public interface FeeService {
    List<Fee> getAllFees();
    Fee getFeeById(Long id);
    Fee createFee(FeeRequest request);
    Fee updateFee(Long id, FeeRequest request);
    void deleteFee(Long id);
    List<Fee> getFeesByStudentId(Long studentId);
    List<Fee> getPendingFees();
}
