package com.school.management.service;

import com.school.management.dto.ClassRequest;
import com.school.management.entity.SchoolClass;

import java.util.List;
import java.util.Map;

public interface ClassService {
    List<SchoolClass> getAllClasses();
    SchoolClass getClassById(Long id);
    SchoolClass createClass(ClassRequest request);
    SchoolClass updateClass(Long id, ClassRequest request);
    void deleteClass(Long id);
    List<Map<String, Object>> getAllClassesWithStudentCount();
}
