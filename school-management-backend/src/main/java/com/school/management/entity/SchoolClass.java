package com.school.management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "classes")
public class SchoolClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String className; // e.g., "10", "9", "8"

    @Column(nullable = false)
    private String section;   // e.g., "A", "B", "C"

    @Column(nullable = false)
    private String roomNumber; // e.g., "101", "204"

    public SchoolClass() {
    }

    public SchoolClass(Long id, String className, String section, String roomNumber) {
        this.id = id;
        this.className = className;
        this.section = section;
        this.roomNumber = roomNumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }
}
