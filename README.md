# 🎓 School Management System (Full-Stack)

A clean, robust, beginner-to-intermediate full-stack web application designed for school administration. Built with **Spring Boot 3.x (Java 17)**, **MySQL**, and **React (Vite)**.

---

## 📌 1. Project Overview

The School Management System allows school administrators to manage:
- **Students**: Complete profile management (name, email, phone, DOB, gender, address) and classroom enrollment.
- **Teachers**: Faculty directory with assigned subjects and classroom associations.
- **Classes**: Grade & section management (e.g. 10-A, 10-B) with room numbers and dynamic student headcount.
- **Attendance**: Daily student attendance roster marking (Present/Absent), historical date queries, and real-time attendance percentage calculation `(Present / Total) × 100`.
- **Fee Management**: Tuition invoice ledger with payment status tracking (Paid vs. Pending) and quick one-click payment settlement.
- **Executive Dashboard**: High-level KPI metrics (Total Students, Teachers, Classes, Present/Absent Today, Total Outstanding Fees) and quick glance widgets.

---

## 🛠️ 2. Technology Stack

### Backend
- **Java 17+**
- **Spring Boot 3.3.x / 3.4.x**
- **Spring Web** (REST API controllers, validation, routing)
- **Spring Data JPA & Hibernate** (ORM, automated table creation, custom query methods)
- **PostgreSQL (Local / Neon Serverless Cloud Database)**
- **HikariCP** (Production connection pooling)
- **Maven** (Dependency and build management)

### Frontend
- **React.js 18** (Component-based UI)
- **Vite** (Next-generation fast frontend tooling)
- **React Router DOM v6** (Client-side page navigation)
- **Axios** (Promise-based HTTP client)
- **Bootstrap 5 & Bootstrap Icons** (Clean, responsive layout and iconography)

> **No unnecessary complex technologies** (No microservices, Docker, Kafka, Redis, WebSockets, or GraphQL). Built cleanly following enterprise layered design principles for maximum readability and interview readiness.

---

## 🏛️ 3. Backend Architecture

```
com.school.management
├── SchoolManagementApplication.java  # Main Bootstrapping Class
├── controller                         # REST Controllers (@RestController)
│   ├── StudentController.java
│   ├── TeacherController.java
│   ├── ClassController.java
│   ├── AttendanceController.java
│   ├── FeeController.java
│   └── DashboardController.java
├── service                            # Business Logic Interfaces
│   ├── StudentService.java
│   ├── TeacherService.java
│   ├── ClassService.java
│   ├── AttendanceService.java
│   ├── FeeService.java
│   └── DashboardService.java
├── service.impl                       # Concrete Service Implementations
│   ├── StudentServiceImpl.java
│   ├── TeacherServiceImpl.java
│   ├── ClassServiceImpl.java
│   ├── AttendanceServiceImpl.java
│   ├── FeeServiceImpl.java
│   └── DashboardServiceImpl.java
├── repository                         # Spring Data JPA Data Access Layer
│   ├── StudentRepository.java
│   ├── TeacherRepository.java
│   ├── ClassRepository.java
│   ├── AttendanceRepository.java
│   └── FeeRepository.java
├── entity                             # JPA Database Entities (@Entity)
│   ├── Student.java
│   ├── Teacher.java
│   ├── SchoolClass.java
│   ├── Attendance.java
│   └── Fee.java
├── dto                                # Request & Response Data Transfer Objects
│   ├── StudentRequest.java
│   ├── TeacherRequest.java
│   ├── ClassRequest.java
│   ├── AttendanceRequest.java
│   ├── FeeRequest.java
│   ├── DashboardResponse.java
│   └── AttendancePercentageResponse.java
├── exception                          # Centralized Error & Exception Handling
│   ├── ResourceNotFoundException.java
│   ├── ErrorResponse.java
│   └── GlobalExceptionHandler.java
└── config                             # CORS and Application Configs
    └── CorsConfig.java
```

### Standard Flow:
$$\text{Client (React)} \longleftrightarrow \text{Controller} \longleftrightarrow \text{Service} \longleftrightarrow \text{Repository} \longleftrightarrow \text{Database (MySQL)}$$

---

## 🗄️ 4. Database Schema & Relationships

```
 ┌──────────────────────┐         ┌──────────────────────┐
 │     SchoolClass      │1       *│       Student        │
 │──────────────────────│─────────│──────────────────────│
 │ id (PK)              │         │ id (PK)              │
 │ class_name           │         │ name                 │
 │ section              │         │ email                │
 │ room_number          │         │ phone                │
 └──────────────────────┘         │ date_of_birth        │
          │ 1                     │ gender               │
          │                       │ address              │
          │ *                     │ class_id (FK)        │
 ┌──────────────────────┐         └──────────────────────┘
 │       Teacher        │                    │ 1
 │──────────────────────│                    │
 │ id (PK)              │                    ├──────────────────────────┐
 │ name                 │                    │ *                        │ *
 │ email                │         ┌──────────────────────┐   ┌──────────────────────┐
 │ phone                │         │      Attendance      │   │         Fee          │
 │ subject              │         │──────────────────────│   │──────────────────────│
 │ class_id (FK)        │         │ id (PK)              │   │ id (PK)              │
 └──────────────────────┘         │ student_id (FK)      │   │ student_id (FK)      │
                                  │ date                 │   │ amount               │
                                  │ status (PRESENT/ABS) │   │ status (PAID/PEND)   │
                                  └──────────────────────┘   │ payment_date         │
                                                             └──────────────────────┘
```

- **Student to Class**: Many-to-One (`@ManyToOne`). Multiple students belong to one Class.
- **Teacher to Class**: Many-to-One (`@ManyToOne`). Teacher can be assigned as a class teacher.
- **Attendance to Student**: Many-to-One (`@ManyToOne`). Unique constraint on `(student_id, date)` ensures no duplicate marks for the same student on the same day.
- **Fee to Student**: Many-to-One (`@ManyToOne`). Each fee invoice belongs to one student.

---

## 📡 5. REST API Endpoints & Testing Matrix

### 🎓 Students API (`/api/students`)
| Method | Endpoint | Description | Request Body (Sample) |
|---|---|---|---|
| `GET` | `/api/students` | Get all students | - |
| `GET` | `/api/students/{id}` | Get student by ID | - |
| `GET` | `/api/students/search?name=John` | Search students by name | - |
| `GET` | `/api/students/class/{classId}` | Get students in a specific class | - |
| `POST` | `/api/students` | Create new student | `{"name":"John Doe","email":"john@edu.com","phone":"555-1234","dateOfBirth":"2008-05-12","gender":"MALE","address":"123 Main St","classId":1}` |
| `PUT` | `/api/students/{id}` | Update existing student | `{"name":"John Doe Jr.","email":"john@edu.com","phone":"555-1234","dateOfBirth":"2008-05-12","gender":"MALE","address":"123 Main St","classId":1}` |
| `DELETE` | `/api/students/{id}` | Delete student | - |

---

### 👨‍🏫 Teachers API (`/api/teachers`)
| Method | Endpoint | Description | Request Body (Sample) |
|---|---|---|---|
| `GET` | `/api/teachers` | Get all teachers | - |
| `GET` | `/api/teachers/{id}` | Get teacher by ID | - |
| `POST` | `/api/teachers` | Register new teacher | `{"name":"Robert Miller","email":"robert@edu.com","phone":"555-0101","subject":"Mathematics","classId":1}` |
| `PUT` | `/api/teachers/{id}` | Update teacher details | `{"name":"Robert Miller","email":"robert@edu.com","phone":"555-0101","subject":"Advanced Math","classId":1}` |
| `DELETE` | `/api/teachers/{id}` | Remove teacher | - |

---

### 🏫 Classes API (`/api/classes`)
| Method | Endpoint | Description | Request Body (Sample) |
|---|---|---|---|
| `GET` | `/api/classes` | Get all classes | - |
| `GET` | `/api/classes/with-count` | Get classes with enrolled student count | - |
| `GET` | `/api/classes/{id}` | Get class by ID | - |
| `POST` | `/api/classes` | Create class section | `{"className":"10","section":"A","roomNumber":"101"}` |
| `PUT` | `/api/classes/{id}` | Update class section | `{"className":"10","section":"A","roomNumber":"102"}` |
| `DELETE` | `/api/classes/{id}` | Delete class section | - |

---

### 📅 Attendance API (`/api/attendance`)
| Method | Endpoint | Description | Request Body (Sample) |
|---|---|---|---|
| `GET` | `/api/attendance` | Get all attendance logs | - |
| `POST` | `/api/attendance` | Mark single student attendance | `{"studentId":1,"date":"2026-09-11","status":"PRESENT"}` |
| `POST` | `/api/attendance/batch` | Mark batch attendance for class | `[{"studentId":1,"date":"2026-09-11","status":"PRESENT"},{"studentId":2,"date":"2026-09-11","status":"ABSENT"}]` |
| `GET` | `/api/attendance/date/{date}` | Get attendance on specific date | - |
| `GET` | `/api/attendance/student/{studentId}` | Get student attendance history | - |
| `GET` | `/api/attendance/student/{studentId}/percentage` | Get attendance percentage calculation | - |

**Sample Output (`GET /api/attendance/student/1/percentage`):**
```json
{
  "studentId": 1,
  "studentName": "Alexander Wright",
  "totalDays": 10,
  "presentDays": 9,
  "absentDays": 1,
  "percentage": 90.0
}
```

---

### 💵 Fee API (`/api/fees`)
| Method | Endpoint | Description | Request Body (Sample) |
|---|---|---|---|
| `GET` | `/api/fees` | Get all fee records | - |
| `GET` | `/api/fees/{id}` | Get fee record by ID | - |
| `GET` | `/api/fees/pending` | Get all pending fee invoices | - |
| `GET` | `/api/fees/student/{studentId}` | Get fees for specific student | - |
| `POST` | `/api/fees` | Create fee record | `{"studentId":1,"amount":1200.00,"status":"PENDING","paymentDate":null}` |
| `PUT` | `/api/fees/{id}` | Update fee record / Mark Paid | `{"studentId":1,"amount":1200.00,"status":"PAID","paymentDate":"2026-09-11"}` |
| `DELETE` | `/api/fees/{id}` | Delete fee invoice | - |

---

### 📊 Dashboard API (`/api/dashboard`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Get overall aggregated metrics |

**Sample Output:**
```json
{
  "totalStudents": 10,
  "totalTeachers": 5,
  "totalClasses": 5,
  "totalPresentToday": 8,
  "totalAbsentToday": 2,
  "totalPendingFees": 4400.0
}
```

---

## 🚀 6. Step-by-Step Local Setup & Execution Guide

### Prerequisites
- **Java Development Kit (JDK 17 or higher)** (`java -version`)
- **Apache Maven 3.8+** (`mvn -version`)
- **MySQL Server 8.0+**
- **Node.js (v18+) and npm** (`node -v`)

---

### Step 1: Configure PostgreSQL Database (Port 5432)
1. Open **pgAdmin** or `psql` and connect to PostgreSQL.
2. Create the database:
```sql
CREATE DATABASE school_management;
```
3. Update `school-management-backend/src/main/resources/application.properties` with your PostgreSQL credentials:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/school_management
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

---

### Step 2: Start the Spring Boot Backend
1. Open a terminal in the backend directory:
```bash
cd school-management-backend
```
2. Build and run the backend:
```bash
mvn clean spring-boot:run
```
3. Backend will start at: `http://localhost:8080`
*(Hibernate will automatically generate all tables in `school_management` and initialize sample seed data from `data.sql`)*.

---

### Step 3: Start the React Frontend
1. Open a second terminal in the frontend directory:
```bash
cd school-management-frontend
```
2. Install npm dependencies:
```bash
npm install
```
3. Launch the Vite development server:
```bash
npm run dev
```
4. Open your browser at: `http://localhost:5173`

---

## 🧪 7. Postman API Testing Instructions

1. **Test Backend Health / Dashboard**:
   - `GET http://localhost:8080/api/dashboard`
   - Status: `200 OK`
2. **Test Create Student**:
   - `POST http://localhost:8080/api/students`
   - Body (JSON):
     ```json
     {
       "name": "Lucas Vance",
       "email": "lucas.v@school.edu",
       "phone": "555-9876",
       "dateOfBirth": "2009-11-20",
       "gender": "MALE",
       "address": "404 Innovation Drive",
       "classId": 1
     }
     ```
   - Status: `201 Created`
3. **Test Search Student**:
   - `GET http://localhost:8080/api/students/search?name=Lucas`
   - Status: `200 OK`
4. **Test Attendance Percentage**:
   - `GET http://localhost:8080/api/attendance/student/1/percentage`
   - Status: `200 OK`
5. **Test Validation Error (400 Bad Request)**:
   - `POST http://localhost:8080/api/students`
   - Body: `{"name": "", "email": "invalid-email"}`
   - Status: `400 Bad Request` with structured JSON error details.
6. **Test Resource Not Found (404 Not Found)**:
   - `GET http://localhost:8080/api/students/9999`
   - Status: `404 Not Found` with `{"message": "Student not found with id: 9999"}`

---

## 🌟 8. Future Improvements
- **Role-based Authentication (Spring Security & JWT)**: Multi-login roles (Admin, Teacher, Student).
- **Exam and Marks Management**: Module for grading tests and report card generation.
- **Automated Email Notifications**: Alert parents when a student is marked absent or fees are overdue.
- **Export to PDF/Excel**: Generate fee receipts and attendance sheets.
