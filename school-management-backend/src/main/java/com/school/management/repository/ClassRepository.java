package com.school.management.repository;

import com.school.management.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<SchoolClass, Long> {
    Optional<SchoolClass> findByClassNameAndSection(String className, String section);
}
