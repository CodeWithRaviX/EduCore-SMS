package com.school.management.service.impl;

import com.school.management.dto.ClassRequest;
import com.school.management.entity.SchoolClass;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.repository.ClassRepository;
import com.school.management.repository.StudentRepository;
import com.school.management.service.ClassService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;

    public ClassServiceImpl(ClassRepository classRepository, StudentRepository studentRepository) {
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public List<SchoolClass> getAllClasses() {
        return classRepository.findAll();
    }

    @Override
    public SchoolClass getClassById(Long id) {
        return classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
    }

    @Override
    public SchoolClass createClass(ClassRequest request) {
        SchoolClass schoolClass = new SchoolClass();
        schoolClass.setClassName(request.getClassName());
        schoolClass.setSection(request.getSection());
        schoolClass.setRoomNumber(request.getRoomNumber());
        return classRepository.save(schoolClass);
    }

    @Override
    public SchoolClass updateClass(Long id, ClassRequest request) {
        SchoolClass schoolClass = getClassById(id);
        schoolClass.setClassName(request.getClassName());
        schoolClass.setSection(request.getSection());
        schoolClass.setRoomNumber(request.getRoomNumber());
        return classRepository.save(schoolClass);
    }

    @Override
    public void deleteClass(Long id) {
        SchoolClass schoolClass = getClassById(id);
        classRepository.delete(schoolClass);
    }

    @Override
    public List<Map<String, Object>> getAllClassesWithStudentCount() {
        List<SchoolClass> classes = classRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (SchoolClass sc : classes) {
            long count = studentRepository.countBySchoolClassId(sc.getId());
            Map<String, Object> map = new HashMap<>();
            map.put("id", sc.getId());
            map.put("className", sc.getClassName());
            map.put("section", sc.getSection());
            map.put("roomNumber", sc.getRoomNumber());
            map.put("studentCount", count);
            result.add(map);
        }
        return result;
    }
}
