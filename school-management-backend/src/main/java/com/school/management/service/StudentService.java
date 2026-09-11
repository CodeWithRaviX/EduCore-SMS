package com.school.management.service;

import com.school.management.dto.StudentRequest;
import com.school.management.entity.Student;

import java.util.List;

public interface StudentService {
    List<Student> getAllStudents();
    Student getStudentById(Long id);
    Student createStudent(StudentRequest request);
    Student updateStudent(Long id, StudentRequest request);
    void deleteStudent(Long id);
    List<Student> searchStudentsByName(String name);
    List<Student> getStudentsByClassId(Long classId);
}
