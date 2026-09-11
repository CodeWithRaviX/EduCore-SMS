package com.school.management.dto;

public class DashboardResponse {

    private long totalStudents;
    private long totalTeachers;
    private long totalClasses;
    private long totalPresentToday;
    private long totalAbsentToday;
    private double totalPendingFees;

    public DashboardResponse() {
    }

    public DashboardResponse(long totalStudents, long totalTeachers, long totalClasses, long totalPresentToday, long totalAbsentToday, double totalPendingFees) {
        this.totalStudents = totalStudents;
        this.totalTeachers = totalTeachers;
        this.totalClasses = totalClasses;
        this.totalPresentToday = totalPresentToday;
        this.totalAbsentToday = totalAbsentToday;
        this.totalPendingFees = totalPendingFees;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalTeachers() {
        return totalTeachers;
    }

    public void setTotalTeachers(long totalTeachers) {
        this.totalTeachers = totalTeachers;
    }

    public long getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(long totalClasses) {
        this.totalClasses = totalClasses;
    }

    public long getTotalPresentToday() {
        return totalPresentToday;
    }

    public void setTotalPresentToday(long totalPresentToday) {
        this.totalPresentToday = totalPresentToday;
    }

    public long getTotalAbsentToday() {
        return totalAbsentToday;
    }

    public void setTotalAbsentToday(long totalAbsentToday) {
        this.totalAbsentToday = totalAbsentToday;
    }

    public double getTotalPendingFees() {
        return totalPendingFees;
    }

    public void setTotalPendingFees(double totalPendingFees) {
        this.totalPendingFees = totalPendingFees;
    }
}
