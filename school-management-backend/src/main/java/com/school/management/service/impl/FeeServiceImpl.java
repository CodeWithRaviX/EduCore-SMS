package com.school.management.service.impl;

import com.school.management.dto.FeeRequest;
import com.school.management.entity.Fee;
import com.school.management.entity.Student;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.repository.FeeRepository;
import com.school.management.repository.StudentRepository;
import com.school.management.service.FeeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class FeeServiceImpl implements FeeService {

    private final FeeRepository feeRepository;
    private final StudentRepository studentRepository;

    public FeeServiceImpl(FeeRepository feeRepository, StudentRepository studentRepository) {
        this.feeRepository = feeRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    @Override
    public Fee getFeeById(Long id) {
        return feeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee record not found with id: " + id));
    }

    @Override
    public Fee createFee(FeeRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));

        String normalizedStatus = request.getStatus().trim().toUpperCase();
        if (!"PAID".equals(normalizedStatus) && !"PENDING".equals(normalizedStatus)) {
            throw new IllegalArgumentException("Fee status must be either PAID or PENDING");
        }

        Fee fee = new Fee();
        fee.setStudent(student);
        fee.setAmount(request.getAmount());
        fee.setStatus(normalizedStatus);
        
        if ("PAID".equals(normalizedStatus)) {
            fee.setPaymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now());
        } else {
            fee.setPaymentDate(request.getPaymentDate());
        }

        return feeRepository.save(fee);
    }

    @Override
    public Fee updateFee(Long id, FeeRequest request) {
        Fee fee = getFeeById(id);
        
        if (!fee.getStudent().getId().equals(request.getStudentId())) {
            Student student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));
            fee.setStudent(student);
        }

        String normalizedStatus = request.getStatus().trim().toUpperCase();
        if (!"PAID".equals(normalizedStatus) && !"PENDING".equals(normalizedStatus)) {
            throw new IllegalArgumentException("Fee status must be either PAID or PENDING");
        }

        fee.setAmount(request.getAmount());
        fee.setStatus(normalizedStatus);
        if ("PAID".equals(normalizedStatus)) {
            fee.setPaymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now());
        } else {
            fee.setPaymentDate(null);
        }

        return feeRepository.save(fee);
    }

    @Override
    public void deleteFee(Long id) {
        Fee fee = getFeeById(id);
        feeRepository.delete(fee);
    }

    @Override
    public List<Fee> getFeesByStudentId(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        return feeRepository.findByStudentId(studentId);
    }

    @Override
    public List<Fee> getPendingFees() {
        return feeRepository.findByStatus("PENDING");
    }
}
