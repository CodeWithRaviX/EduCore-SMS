package com.school.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ClassRequest {

    @NotBlank(message = "Class name cannot be blank")
    private String className;

    @NotBlank(message = "Section cannot be blank")
    private String section;

    @NotBlank(message = "Room number cannot be blank")
    private String roomNumber;

    public ClassRequest() {
    }

    public ClassRequest(String className, String section, String roomNumber) {
        this.className = className;
        this.section = section;
        this.roomNumber = roomNumber;
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
