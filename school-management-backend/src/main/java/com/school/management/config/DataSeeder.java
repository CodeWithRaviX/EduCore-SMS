package com.school.management.config;

import com.school.management.entity.*;
import com.school.management.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ClassRepository classRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final FeeRepository feeRepository;

    public DataSeeder(
            ClassRepository classRepository,
            TeacherRepository teacherRepository,
            StudentRepository studentRepository,
            AttendanceRepository attendanceRepository,
            FeeRepository feeRepository) {
        this.classRepository = classRepository;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.feeRepository = feeRepository;
    }

    @Override
    public void run(String... args) {
        // Seed only if database is completely fresh
        if (classRepository.count() == 0) {
            seedClassesTeachersAndStudents();
        }
    }

    private void seedClassesTeachersAndStudents() {
        // 1. Seed Classes
        List<SchoolClass> classes = new ArrayList<>();
        classes.add(new SchoolClass(null, "10", "A", "Room 101"));
        classes.add(new SchoolClass(null, "10", "B", "Room 102"));
        classes.add(new SchoolClass(null, "9", "A", "Room 201"));
        classes.add(new SchoolClass(null, "9", "B", "Room 202"));
        classes.add(new SchoolClass(null, "8", "A", "Room 301"));
        classes.add(new SchoolClass(null, "8", "B", "Room 302"));
        classes.add(new SchoolClass(null, "11-Sci", "A", "Lab Block 1"));
        classes.add(new SchoolClass(null, "12-Comm", "A", "Commerce 2"));
        classes = classRepository.saveAll(classes);

        // 2. Seed Teachers
        List<Teacher> teachers = new ArrayList<>();
        teachers.add(new Teacher(null, "Dr. Rajesh Sharma", "rajesh.sharma@school.edu", "+91 98101 23451", "Mathematics", classes.get(0)));
        teachers.add(new Teacher(null, "Priya Sundaram", "priya.sundaram@school.edu", "+91 98101 23452", "Physics", classes.get(1)));
        teachers.add(new Teacher(null, "Ananya Banerjee", "ananya.b@school.edu", "+91 98101 23453", "English Literature", classes.get(2)));
        teachers.add(new Teacher(null, "Vikramaditya Rao", "vikram.rao@school.edu", "+91 98101 23454", "Chemistry", classes.get(3)));
        teachers.add(new Teacher(null, "Meenakshi Iyer", "meenakshi.i@school.edu", "+91 98101 23455", "Computer Science", classes.get(4)));
        teachers.add(new Teacher(null, "Amitabh Verma", "amitabh.v@school.edu", "+91 98101 23456", "Social Studies", classes.get(5)));
        teachers.add(new Teacher(null, "Sunita Deshmukh", "sunita.d@school.edu", "+91 98101 23457", "Biology", classes.get(6)));
        teachers.add(new Teacher(null, "Rohan Kapoor", "rohan.k@school.edu", "+91 98101 23458", "Accountancy & Economics", classes.get(7)));
        teachers = teacherRepository.saveAll(teachers);

        // 3. Seed Students (20 Students)
        List<Student> students = new ArrayList<>();
        students.add(new Student(null, "Aarav Patel", "aarav.patel@student.edu", "+91 98765 00001", LocalDate.of(2008, 4, 15), "MALE", "124 Lake View Colony, New Delhi", classes.get(0)));
        students.add(new Student(null, "Diya Sharma", "diya.sharma@student.edu", "+91 98765 00002", LocalDate.of(2008, 6, 22), "FEMALE", "45 Green Park Extension, New Delhi", classes.get(0)));
        students.add(new Student(null, "Kabir Mehta", "kabir.mehta@student.edu", "+91 98765 00003", LocalDate.of(2008, 1, 10), "MALE", "78 Civil Lines, New Delhi", classes.get(0)));
        
        students.add(new Student(null, "Ishaan Gupta", "ishaan.g@student.edu", "+91 98765 00004", LocalDate.of(2008, 9, 5), "MALE", "302 Vasant Kunj, New Delhi", classes.get(1)));
        students.add(new Student(null, "Ananya Joshi", "ananya.j@student.edu", "+91 98765 00005", LocalDate.of(2008, 11, 30), "FEMALE", "89 Defence Colony, New Delhi", classes.get(1)));
        students.add(new Student(null, "Rhea Nair", "rhea.nair@student.edu", "+91 98765 00006", LocalDate.of(2008, 3, 18), "FEMALE", "14 Hauz Khas, New Delhi", classes.get(1)));

        students.add(new Student(null, "Aditya Roy", "aditya.roy@student.edu", "+91 98765 00007", LocalDate.of(2009, 2, 14), "MALE", "56 Saket, New Delhi", classes.get(2)));
        students.add(new Student(null, "Sneha Reddy", "sneha.reddy@student.edu", "+91 98765 00008", LocalDate.of(2009, 7, 28), "FEMALE", "210 Lajpat Nagar, New Delhi", classes.get(2)));
        students.add(new Student(null, "Tanmay Kulkarni", "tanmay.k@student.edu", "+91 98765 00009", LocalDate.of(2009, 10, 12), "MALE", "41 Janakpuri, New Delhi", classes.get(2)));

        students.add(new Student(null, "Pooja Hegde", "pooja.h@student.edu", "+91 98765 00010", LocalDate.of(2009, 5, 19), "FEMALE", "67 Dwarka Sector 12, New Delhi", classes.get(3)));
        students.add(new Student(null, "Rohan Singhania", "rohan.s@student.edu", "+91 98765 00011", LocalDate.of(2009, 8, 25), "MALE", "112 Rohini Sector 9, New Delhi", classes.get(3)));

        students.add(new Student(null, "Kavya Menon", "kavya.m@student.edu", "+91 98765 00012", LocalDate.of(2010, 1, 8), "FEMALE", "88 Greater Kailash II, New Delhi", classes.get(4)));
        students.add(new Student(null, "Varun Dhawan", "varun.d@student.edu", "+91 98765 00013", LocalDate.of(2010, 4, 30), "MALE", "19 Mayur Vihar, New Delhi", classes.get(4)));
        
        students.add(new Student(null, "Neha Kakkar", "neha.k@student.edu", "+91 98765 00014", LocalDate.of(2010, 9, 14), "FEMALE", "35 Punjabi Bagh, New Delhi", classes.get(5)));
        students.add(new Student(null, "Devansh Trivedi", "devansh.t@student.edu", "+91 98765 00015", LocalDate.of(2010, 12, 1), "MALE", "54 Model Town, New Delhi", classes.get(5)));

        students.add(new Student(null, "Siddharth Malhotra", "sid.m@student.edu", "+91 98765 00016", LocalDate.of(2007, 3, 21), "MALE", "93 Paschim Vihar, New Delhi", classes.get(6)));
        students.add(new Student(null, "Tara Sutaria", "tara.s@student.edu", "+91 98765 00017", LocalDate.of(2007, 7, 11), "FEMALE", "102 South Extension, New Delhi", classes.get(6)));
        
        students.add(new Student(null, "Kunal Khemu", "kunal.k@student.edu", "+91 98765 00018", LocalDate.of(2006, 5, 16), "MALE", "77 Karol Bagh, New Delhi", classes.get(7)));
        students.add(new Student(null, "Alia Bhatt", "alia.b@student.edu", "+91 98765 00019", LocalDate.of(2006, 11, 2), "FEMALE", "48 Chanakyapuri, New Delhi", classes.get(7)));
        students.add(new Student(null, "Aryan Khan", "aryan.k@student.edu", "+91 98765 00020", LocalDate.of(2006, 8, 19), "MALE", "15 Shanti Niketan, New Delhi", classes.get(7)));
        students = studentRepository.saveAll(students);

        // 4. Seed Attendance Records (Today and Past 2 Days)
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate twoDaysAgo = today.minusDays(2);

        List<Attendance> attendances = new ArrayList<>();
        // Today's attendance for first 15 students
        attendances.add(new Attendance(null, students.get(0), today, "PRESENT"));
        attendances.add(new Attendance(null, students.get(1), today, "PRESENT"));
        attendances.add(new Attendance(null, students.get(2), today, "ABSENT"));
        attendances.add(new Attendance(null, students.get(3), today, "PRESENT"));
        attendances.add(new Attendance(null, students.get(4), today, "PRESENT"));
        attendances.add(new Attendance(null, students.get(5), today, "PRESENT"));
        attendances.add(new Attendance(null, students.get(6), today, "ABSENT"));
        attendances.add(new Attendance(null, students.get(7), today, "PRESENT"));
        attendances.add(new Attendance(null, students.get(8), today, "PRESENT"));
        attendances.add(new Attendance(null, students.get(9), today, "PRESENT"));
        attendances.add(new Attendance(null, students.get(10), today, "PRESENT"));
        attendances.add(new Attendance(null, students.get(11), today, "ABSENT"));
        attendances.add(new Attendance(null, students.get(12), today, "PRESENT"));
        attendances.add(new Attendance(null, students.get(13), today, "PRESENT"));
        attendances.add(new Attendance(null, students.get(14), today, "PRESENT"));

        // Yesterday's attendance
        attendances.add(new Attendance(null, students.get(0), yesterday, "PRESENT"));
        attendances.add(new Attendance(null, students.get(1), yesterday, "PRESENT"));
        attendances.add(new Attendance(null, students.get(2), yesterday, "PRESENT"));
        attendances.add(new Attendance(null, students.get(3), yesterday, "ABSENT"));
        attendances.add(new Attendance(null, students.get(4), yesterday, "PRESENT"));
        attendances.add(new Attendance(null, students.get(5), yesterday, "PRESENT"));
        attendances.add(new Attendance(null, students.get(6), yesterday, "PRESENT"));
        attendances.add(new Attendance(null, students.get(7), yesterday, "PRESENT"));
        attendances.add(new Attendance(null, students.get(8), yesterday, "ABSENT"));
        attendances.add(new Attendance(null, students.get(9), yesterday, "PRESENT"));

        // Two days ago attendance
        attendances.add(new Attendance(null, students.get(0), twoDaysAgo, "PRESENT"));
        attendances.add(new Attendance(null, students.get(1), twoDaysAgo, "ABSENT"));
        attendances.add(new Attendance(null, students.get(2), twoDaysAgo, "PRESENT"));
        attendances.add(new Attendance(null, students.get(3), twoDaysAgo, "PRESENT"));
        attendances.add(new Attendance(null, students.get(4), twoDaysAgo, "PRESENT"));
        attendanceRepository.saveAll(attendances);

        // 5. Seed Fees (in Indian Rupees ₹)
        List<Fee> fees = new ArrayList<>();
        fees.add(new Fee(null, students.get(0), 18500.0, "PAID", LocalDate.of(2026, 8, 10)));
        fees.add(new Fee(null, students.get(1), 18500.0, "PENDING", null));
        fees.add(new Fee(null, students.get(2), 18500.0, "PAID", LocalDate.of(2026, 8, 15)));
        fees.add(new Fee(null, students.get(3), 18500.0, "PENDING", null));
        fees.add(new Fee(null, students.get(4), 18500.0, "PAID", LocalDate.of(2026, 8, 12)));
        fees.add(new Fee(null, students.get(5), 18500.0, "PAID", LocalDate.of(2026, 8, 18)));
        fees.add(new Fee(null, students.get(6), 16000.0, "PAID", LocalDate.of(2026, 8, 20)));
        fees.add(new Fee(null, students.get(7), 16000.0, "PENDING", null));
        fees.add(new Fee(null, students.get(8), 16000.0, "PAID", LocalDate.of(2026, 8, 22)));
        fees.add(new Fee(null, students.get(9), 16000.0, "PENDING", null));
        fees.add(new Fee(null, students.get(10), 16000.0, "PAID", LocalDate.of(2026, 8, 25)));
        fees.add(new Fee(null, students.get(11), 14000.0, "PAID", LocalDate.of(2026, 8, 26)));
        fees.add(new Fee(null, students.get(12), 14000.0, "PENDING", null));
        fees.add(new Fee(null, students.get(13), 14000.0, "PAID", LocalDate.of(2026, 8, 28)));
        fees.add(new Fee(null, students.get(14), 14000.0, "PAID", LocalDate.of(2026, 8, 30)));
        fees.add(new Fee(null, students.get(15), 24000.0, "PAID", LocalDate.of(2026, 8, 5)));
        fees.add(new Fee(null, students.get(16), 24000.0, "PENDING", null));
        fees.add(new Fee(null, students.get(17), 22000.0, "PAID", LocalDate.of(2026, 8, 7)));
        fees.add(new Fee(null, students.get(18), 22000.0, "PAID", LocalDate.of(2026, 8, 9)));
        fees.add(new Fee(null, students.get(19), 22000.0, "PENDING", null));
        feeRepository.saveAll(fees);
    }
}
