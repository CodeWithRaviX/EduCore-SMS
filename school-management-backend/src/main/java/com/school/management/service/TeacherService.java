package com.school.management.service;

import com.school.management.dto.TeacherRequest;
import com.school.management.entity.Teacher;

import java.util.List;

public interface TeacherService {
    List<Teacher> getAllTeachers();
    Teacher getTeacherById(Long id);
    Teacher createTeacher(TeacherRequest request);
    Teacher updateTeacher(Long id, TeacherRequest request);
    void deleteTeacher(Long id);
}
