-- Sample Data for School Management System (PostgreSQL / MySQL / H2 compatible)

-- 1. Classes
INSERT INTO classes (class_name, section, room_number) VALUES
('10', 'A', 'Room 101'),
('10', 'B', 'Room 102'),
('9', 'A', 'Room 201'),
('9', 'B', 'Room 202'),
('8', 'A', 'Room 301'),
('8', 'B', 'Room 302'),
('11-Sci', 'A', 'Lab Block 1'),
('12-Comm', 'A', 'Commerce 2');

-- 2. Teachers
INSERT INTO teachers (name, email, phone, subject, class_id) VALUES
('Dr. Rajesh Sharma', 'rajesh.sharma@school.edu', '+91 98101 23451', 'Mathematics', 1),
('Priya Sundaram', 'priya.sundaram@school.edu', '+91 98101 23452', 'Physics', 2),
('Ananya Banerjee', 'ananya.b@school.edu', '+91 98101 23453', 'English Literature', 3),
('Vikramaditya Rao', 'vikram.rao@school.edu', '+91 98101 23454', 'Chemistry', 4),
('Meenakshi Iyer', 'meenakshi.i@school.edu', '+91 98101 23455', 'Computer Science', 5),
('Amitabh Verma', 'amitabh.v@school.edu', '+91 98101 23456', 'Social Studies', 6),
('Sunita Deshmukh', 'sunita.d@school.edu', '+91 98101 23457', 'Biology', 7),
('Rohan Kapoor', 'rohan.k@school.edu', '+91 98101 23458', 'Accountancy & Economics', 8);

-- 3. Students
INSERT INTO students (name, email, phone, date_of_birth, gender, address, class_id) VALUES
('Aarav Patel', 'aarav.patel@student.edu', '+91 98765 00001', '2008-04-15', 'MALE', '124 Lake View Colony, New Delhi', 1),
('Diya Sharma', 'diya.sharma@student.edu', '+91 98765 00002', '2008-06-22', 'FEMALE', '45 Green Park Extension, New Delhi', 1),
('Kabir Mehta', 'kabir.mehta@student.edu', '+91 98765 00003', '2008-01-10', 'MALE', '78 Civil Lines, New Delhi', 1),
('Ishaan Gupta', 'ishaan.g@student.edu', '+91 98765 00004', '2008-09-05', 'MALE', '302 Vasant Kunj, New Delhi', 2),
('Ananya Joshi', 'ananya.j@student.edu', '+91 98765 00005', '2008-11-30', 'FEMALE', '89 Defence Colony, New Delhi', 2),
('Rhea Nair', 'rhea.nair@student.edu', '+91 98765 00006', '2008-03-18', 'FEMALE', '14 Hauz Khas, New Delhi', 2),
('Aditya Roy', 'aditya.roy@student.edu', '+91 98765 00007', '2009-02-14', 'MALE', '56 Saket, New Delhi', 3),
('Sneha Reddy', 'sneha.reddy@student.edu', '+91 98765 00008', '2009-07-28', 'FEMALE', '210 Lajpat Nagar, New Delhi', 3),
('Tanmay Kulkarni', 'tanmay.k@student.edu', '+91 98765 00009', '2009-10-12', 'MALE', '41 Janakpuri, New Delhi', 3),
('Pooja Hegde', 'pooja.h@student.edu', '+91 98765 00010', '2009-05-19', 'FEMALE', '67 Dwarka Sector 12, New Delhi', 4),
('Rohan Singhania', 'rohan.s@student.edu', '+91 98765 00011', '2009-08-25', 'MALE', '112 Rohini Sector 9, New Delhi', 4),
('Kavya Menon', 'kavya.m@student.edu', '+91 98765 00012', '2010-01-08', 'FEMALE', '88 Greater Kailash II, New Delhi', 5),
('Varun Dhawan', 'varun.d@student.edu', '+91 98765 00013', '2010-04-30', 'MALE', '19 Mayur Vihar, New Delhi', 5),
('Neha Kakkar', 'neha.k@student.edu', '+91 98765 00014', '2010-09-14', 'FEMALE', '35 Punjabi Bagh, New Delhi', 6),
('Devansh Trivedi', 'devansh.t@student.edu', '+91 98765 00015', '2010-12-01', 'MALE', '54 Model Town, New Delhi', 6),
('Siddharth Malhotra', 'sid.m@student.edu', '+91 98765 00016', '2007-03-21', 'MALE', '93 Paschim Vihar, New Delhi', 7),
('Tara Sutaria', 'tara.s@student.edu', '+91 98765 00017', '2007-07-11', 'FEMALE', '102 South Extension, New Delhi', 7),
('Kunal Khemu', 'kunal.k@student.edu', '+91 98765 00018', '2006-05-16', 'MALE', '77 Karol Bagh, New Delhi', 8),
('Alia Bhatt', 'alia.b@student.edu', '+91 98765 00019', '2006-11-02', 'FEMALE', '48 Chanakyapuri, New Delhi', 8),
('Aryan Khan', 'aryan.k@student.edu', '+91 98765 00020', '2006-08-19', 'MALE', '15 Shanti Niketan, New Delhi', 8);

-- 4. Attendance Records
INSERT INTO attendance (student_id, date, status) VALUES
(1, CURRENT_DATE, 'PRESENT'),
(2, CURRENT_DATE, 'PRESENT'),
(3, CURRENT_DATE, 'ABSENT'),
(4, CURRENT_DATE, 'PRESENT'),
(5, CURRENT_DATE, 'PRESENT'),
(6, CURRENT_DATE, 'PRESENT'),
(7, CURRENT_DATE, 'ABSENT'),
(8, CURRENT_DATE, 'PRESENT'),
(9, CURRENT_DATE, 'PRESENT'),
(10, CURRENT_DATE, 'PRESENT'),
(11, CURRENT_DATE, 'PRESENT'),
(12, CURRENT_DATE, 'ABSENT'),
(13, CURRENT_DATE, 'PRESENT'),
(14, CURRENT_DATE, 'PRESENT'),
(15, CURRENT_DATE, 'PRESENT');

-- 5. Fees (in ₹)
INSERT INTO fees (student_id, amount, status, payment_date) VALUES
(1, 18500.00, 'PAID', '2026-08-10'),
(2, 18500.00, 'PENDING', NULL),
(3, 18500.00, 'PAID', '2026-08-15'),
(4, 18500.00, 'PENDING', NULL),
(5, 18500.00, 'PAID', '2026-08-12'),
(6, 18500.00, 'PAID', '2026-08-18'),
(7, 16000.00, 'PAID', '2026-08-20'),
(8, 16000.00, 'PENDING', NULL),
(9, 16000.00, 'PAID', '2026-08-22'),
(10, 16000.00, 'PENDING', NULL),
(11, 16000.00, 'PAID', '2026-08-25'),
(12, 14000.00, 'PAID', '2026-08-26'),
(13, 14000.00, 'PENDING', NULL),
(14, 14000.00, 'PAID', '2026-08-28'),
(15, 14000.00, 'PAID', '2026-08-30'),
(16, 24000.00, 'PAID', '2026-08-05'),
(17, 24000.00, 'PENDING', NULL),
(18, 22000.00, 'PAID', '2026-08-07'),
(19, 22000.00, 'PAID', '2026-08-09'),
(20, 22000.00, 'PENDING', NULL);
