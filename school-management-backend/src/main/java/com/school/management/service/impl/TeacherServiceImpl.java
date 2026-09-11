package com.school.management.service.impl;

import com.school.management.dto.TeacherRequest;
import com.school.management.entity.SchoolClass;
import com.school.management.entity.Teacher;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.repository.ClassRepository;
import com.school.management.repository.TeacherRepository;
import com.school.management.service.TeacherService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final ClassRepository classRepository;

    public TeacherServiceImpl(TeacherRepository teacherRepository, ClassRepository classRepository) {
        this.teacherRepository = teacherRepository;
        this.classRepository = classRepository;
    }

    @Override
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @Override
    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
    }

    @Override
    public Teacher createTeacher(TeacherRequest request) {
        Teacher teacher = new Teacher();
        teacher.setName(request.getName());
        teacher.setEmail(request.getEmail());
        teacher.setPhone(request.getPhone());
        teacher.setSubject(request.getSubject());

        if (request.getClassId() != null) {
            SchoolClass schoolClass = classRepository.findById(request.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));
            teacher.setSchoolClass(schoolClass);
        }

        return teacherRepository.save(teacher);
    }

    @Override
    public Teacher updateTeacher(Long id, TeacherRequest request) {
        Teacher teacher = getTeacherById(id);
        teacher.setName(request.getName());
        teacher.setEmail(request.getEmail());
        teacher.setPhone(request.getPhone());
        teacher.setSubject(request.getSubject());

        if (request.getClassId() != null) {
            SchoolClass schoolClass = classRepository.findById(request.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));
            teacher.setSchoolClass(schoolClass);
        } else {
            teacher.setSchoolClass(null);
        }

        return teacherRepository.save(teacher);
    }

    @Override
    public void deleteTeacher(Long id) {
        Teacher teacher = getTeacherById(id);
        teacherRepository.delete(teacher);
    }
}
