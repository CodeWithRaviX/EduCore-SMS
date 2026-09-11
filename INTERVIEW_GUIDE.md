# 🎯 Placement Interview Preparation Guide: School Management System

This guide helps you explain this project with complete clarity, structure, and confidence during technical interviews for graduate and junior/intermediate software engineer positions.

---

## ⏱️ 1. Elevator Pitches

### 60-Second Project Explanation
> "I developed a full-stack **School Management System** designed to streamline academic administrative workflows. The backend is engineered using **Spring Boot 3** and **Java 17** following the classic multi-tier architecture—Controller, Service, and Repository layers with **Spring Data JPA/Hibernate** connecting to a **MySQL** database. The frontend is built using **React 18** and **Vite**, consuming RESTful APIs via **Axios** and styled with **Bootstrap 5**.
> 
> The system enables administrators to manage student enrollment, teacher assignments, grade classrooms, daily student attendance with automated percentage calculation, and tuition fee tracking with pending balance alerts. I also implemented a centralized dashboard aggregating critical operational KPIs in real time."

---

### 2-Minute Detailed Architectural Explanation
> "During the development of the School Management System, my goal was to build a clean, maintainable, and decoupled web application.
> 
> On the **Backend**, I structured the project around separation of concerns:
> 1. **Controllers** act as the entry point, receiving HTTP requests, validating request bodies using Jakarta Bean Validation, and returning standard HTTP status codes like `200 OK`, `201 Created`, and `404 Not Found`.
> 2. **Service Layer** encapsulates all core business logic—such as calculating attendance percentages, preventing duplicate attendance records on the same day, and aggregating dashboard metrics.
> 3. **Repository Layer** leverages Spring Data JPA to execute optimized CRUD operations and derived custom queries against MySQL without writing raw SQL.
> 4. **Exception Handling** is centralized using a `@RestControllerAdvice` global handler to ensure client applications receive standardized JSON error messages for validation failures or missing entities.
> 
> On the **Frontend**, I used **React with Vite** and **React Router DOM** for seamless single-page navigation. I decoupled API calls into a dedicated service layer using **Axios**, ensuring UI components only focus on state management, user interactions, and rendering modals/tables.
> 
> Cross-Origin Resource Sharing (CORS) is configured on the backend to allow secure communication between the Vite client on port 5173 and the Spring Boot API on port 8080."

---

## 🏗️ 2. Core Concepts & Technical Deep Dives

### 🔗 Database Relationships Explanation
1. **Student $\longleftrightarrow$ SchoolClass (`@ManyToOne`)**:
   - Multiple students are enrolled in one class/section (e.g., Class 10-A).
   - In the database, the `students` table contains a foreign key column `class_id` referencing `classes(id)`.
2. **Teacher $\longleftrightarrow$ SchoolClass (`@ManyToOne`)**:
   - A teacher can be assigned as the class teacher for a specific classroom.
3. **Attendance $\longleftrightarrow$ Student (`@ManyToOne`)**:
   - A student accumulates multiple daily attendance logs over time.
   - We enforce a database composite unique constraint on `(student_id, date)` to prevent accidental duplicate entries for a student on the same calendar day.
4. **Fee $\longleftrightarrow$ Student (`@ManyToOne`)**:
   - Each fee invoice is linked to a specific student via `student_id`.

---

### ❓ Why Spring Boot?
- **Auto-configuration**: Spring Boot automatically configures the embedded Tomcat server, Spring MVC, and database connection pools (HikariCP) based on classpath dependencies.
- **Starter Dependencies**: `spring-boot-starter-web` and `spring-boot-starter-data-jpa` reduce dependency boilerplate.
- **Production-Ready**: Built-in exception handling, standardized configuration profiles, and seamless bean injection (`@Service`, `@Repository`, `@RestController`).

---

### ❓ Why React with Vite?
- **Component Reusability**: Modals (`StudentForm`, `ConfirmDialog`), Navbar, and Sidebar are modular and reusable across routes.
- **Virtual DOM**: React updates only the changed UI nodes efficiently (e.g. updating attendance radio buttons without refreshing the page).
- **Vite Performance**: Provides instant Hot Module Replacement (HMR) and fast ES-module builds compared to legacy Webpack/CRA.

---

### ❓ Why Spring Data JPA & Hibernate?
- **Object-Relational Mapping (ORM)**: Eliminates repetitive JDBC boilerplate (e.g., `PreparedStatement`, `ResultSet` mapping).
- **Derived Query Methods**: Writing `findByStudentIdAndDate` or `findByNameContainingIgnoreCase` automatically generates the corresponding SQL query.
- **Transactional Integrity**: With `@Transactional`, entity updates and batch saves execute atomically.

---

### 🔄 How React Communicates with Spring Boot
1. A user triggers an event in React (e.g. clicks "Save Attendance").
2. The page component invokes a method from `attendanceService.js`.
3. The centralized `axios` instance sends an asynchronous HTTP POST request with a JSON payload to `http://localhost:8080/api/attendance/batch`.
4. Spring Boot's embedded Tomcat receives the HTTP request on port 8080.
5. The `CorsConfig` filter inspects the `Origin` header (`http://localhost:5173`) and allows the request.
6. The `AttendanceController` deserializes JSON to Java DTOs, delegates to `AttendanceService`, saves via `AttendanceRepository`, and returns a `201 Created` HTTP response with JSON data.
7. Axios resolves the Promise in React, updating component state and UI reactively.

---

### 🏛️ Explain the Controller $\rightarrow$ Service $\rightarrow$ Repository Pattern
- **Controller (`@RestController`)**: Handles HTTP transport concerns only—request mapping, path variables, query parameters, payload validation (`@Valid`), and HTTP response codes.
- **Service (`@Service`)**: Houses all business rules, calculations, data transformations, and transactional boundaries (`@Transactional`).
- **Repository (`@Repository`)**: Interacts strictly with the persistence layer (CRUD and queries against MySQL tables).
- **Benefit**: High cohesion, low coupling, and easy unit testing with mock dependencies.

---

### 🧮 Explain the Attendance Percentage Calculation
- **Formula**:
  $$\text{Attendance Percentage} = \left( \frac{\text{Number of PRESENT Records}}{\text{Total Attendance Records}} \right) \times 100$$
- **Edge Case**: If `totalRecords == 0` (newly enrolled student with no logs yet), the service avoids division by zero ($0/0$) and returns `0.0%`.
- **Precision**: Results are rounded cleanly to 2 decimal places using `BigDecimal.setScale(2, RoundingMode.HALF_UP)`.

---

### 🛡️ Explain Exception Handling & CORS
- **Global Exception Handling**:
  - Annotated with `@RestControllerAdvice`.
  - Catches `ResourceNotFoundException` and transforms it into HTTP `404 Not Found` with `{ "message": "Student not found with id: 1" }`.
  - Catches `MethodArgumentNotValidException` (thrown when `@Valid` fails on blank fields or invalid emails) and returns HTTP `400 Bad Request` with field-level validation errors.
- **CORS (Cross-Origin Resource Sharing)**:
  - Browsers enforce Same-Origin Policy. Because the frontend runs on origin `http://localhost:5173` and the backend on `http://localhost:8080`, browsers block requests by default.
  - We configure `WebMvcConfigurer` in `CorsConfig.java` to explicitly allow requests from `http://localhost:5173` with standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`).

---

## 💡 3. Top 20 Placement Interview Questions & Model Answers

### Q1: What is the difference between `@RestController` and `@Controller` in Spring Boot?
**Answer:** `@Controller` is used in traditional Spring MVC to return HTML views (via template engines like Thymeleaf or JSP). `@RestController` is a convenience annotation combining `@Controller` and `@ResponseBody`, ensuring that method return values are automatically serialized into JSON or XML and written directly into the HTTP response body.

### Q2: What is the purpose of DTOs (Data Transfer Objects) and why not use Entities directly in controllers?
**Answer:** DTOs decouple the database schema from the API contract. They prevent mass assignment vulnerabilities, allow custom validation annotations specifically for API inputs, prevent infinite JSON recursion issues with bidirectional JPA relationships, and hide internal database columns.

### Q3: How do you prevent duplicate attendance records for a student on the same date?
**Answer:** Two levels:
1. **Database level**: A composite unique constraint `@UniqueConstraint(columnNames = {"student_id", "date"})` on the `attendance` table.
2. **Service layer**: Before saving, the service checks `attendanceRepository.findByStudentIdAndDate(studentId, date)`. If a record exists, it updates the status; otherwise, it inserts a new record (upsert pattern).

### Q4: What does `@Transactional` do in the Service layer?
**Answer:** It manages database transaction boundaries. If any unchecked exception occurs during a service method (such as batch marking attendance), all database operations within that transaction are rolled back automatically, preventing partial or inconsistent data states.

### Q5: What is the difference between `ddl-auto=update` and `ddl-auto=create-drop` in Hibernate?
**Answer:** `update` checks the existing database schema and updates table structures/columns without deleting existing data. `create-drop` drops all tables upon application shutdown and recreates them on startup, which destroys persistent data. `update` is ideal for development.

### Q6: How does Spring Data JPA generate SQL queries from method names like `findByNameContainingIgnoreCase`?
**Answer:** Spring Data JPA parses the method name keywords (`findBy`, `Name`, `Containing`, `IgnoreCase`) and translates them into an Abstract Syntax Tree (AST) at startup. Hibernate then compiles this into the SQL query: `SELECT * FROM students WHERE UPPER(name) LIKE UPPER('%value%')`.

### Q7: Why did you choose React for the frontend instead of server-side templates (JSP/Thymeleaf)?
**Answer:** React creates a Single Page Application (SPA) where pages do not reload entirely on each click. It provides faster transitions, modular and reusable UI components, clean state management, and clear architectural separation between backend REST APIs and frontend clients.

### Q8: What is the role of `Axios` and how is it configured in your project?
**Answer:** Axios is a promise-based HTTP client. We configured a base instance in `src/api/axios.js` with `baseURL: 'http://localhost:8080/api'`. It handles automatic JSON serialization/deserialization, error status inspection, and request/response interceptors.

### Q9: How do you handle 404 and 400 errors across the application?
**Answer:** We created a custom `ResourceNotFoundException` and a `@RestControllerAdvice` class (`GlobalExceptionHandler`). When an entity is not found by ID, the service throws `ResourceNotFoundException`, which the global handler catches and converts into a consistent JSON response with HTTP 404 status.

### Q10: What is the difference between `@ManyToOne` and `@OneToMany`?
**Answer:** They represent relationship cardinality. In our project, `@ManyToOne` on `Student` means multiple student records reference a single `SchoolClass`. The foreign key (`class_id`) resides on the "Many" side (`students` table).

### Q11: How do you calculate the dashboard statistics efficiently?
**Answer:** The `DashboardService` aggregates counts using Spring Data JPA count methods (`studentRepository.count()`, `attendanceRepository.countByDateAndStatus(today, status)`) and a custom JPQL query in `FeeRepository` (`SELECT COALESCE(SUM(f.amount), 0.0) FROM Fee f WHERE f.status = 'PENDING'`). This computes totals directly in MySQL without loading all records into Java memory.

### Q12: How do you pass data between parent and child components in React?
**Answer:** Data is passed down from parent to child via **Props** (such as passing `classes` array to `StudentForm`). Data or events are passed up from child to parent via **Callback functions** (such as `onSave` or `onClose` props in modal components).

### Q13: What are React Hooks and which ones did you use?
**Answer:** Hooks allow functional components to use state and lifecycle features. In this project:
- `useState`: For tracking component state (students list, modal open/close, form inputs).
- `useEffect`: For loading data from the backend when components mount or when dependencies change (e.g. loading class roster when class selection changes).

### Q14: How does React Router handle client-side routing?
**Answer:** `BrowserRouter` and `Routes`/`Route` intercept URL navigation in the browser history API, rendering the matched component (`/students`, `/teachers`, `/attendance`) dynamically without requesting a new HTML page from the web server.

### Q15: Why is `@Valid` used in Controller method parameters?
**Answer:** `@Valid` triggers Jakarta Bean Validation on the request DTO before executing the method body. If annotations like `@NotBlank`, `@Email`, or `@NotNull` are violated, Spring throws `MethodArgumentNotValidException`, which our global handler captures to return a 400 response.

### Q16: How do you avoid the "N+1 query problem" in JPA?
**Answer:** By choosing appropriate fetch types (`FetchType.EAGER` for simple single relationships, `JOIN FETCH` queries or entity graphs for larger collections) rather than lazy loading entities in loops.

### Q17: What is the purpose of `COALESCE` in SQL/JPQL queries?
**Answer:** `COALESCE(SUM(amount), 0.0)` returns the first non-null value in the argument list. If there are no pending fee rows, `SUM(amount)` returns `NULL`; `COALESCE` ensures the query returns `0.0` instead of causing a `NullPointerException` in Java.

### Q18: What is the significance of the `key` prop in React lists (e.g. `students.map(s => <tr key={s.id}>)`)?
**Answer:** The `key` prop gives React a unique identity for each item in a list, allowing its Virtual DOM diffing algorithm to accurately identify which items were added, changed, or removed during re-renders.

### Q19: What is the HTTP status code convention used in your REST APIs?
**Answer:**
- `200 OK`: Successful retrieval or update (`GET`, `PUT`).
- `201 Created`: Successful creation (`POST`).
- `400 Bad Request`: Validation failure or invalid input data.
- `404 Not Found`: Requested resource ID does not exist.
- `500 Internal Server Error`: Unhandled server exceptions.

### Q20: If you had 2 more weeks to work on this project, what would you add next?
**Answer:** I would implement **Spring Security with JWT authentication** for role-based access control (Admin, Teacher, Student portals), add automated email alerts for student absence and pending fee reminders, and build an export module to generate PDF report cards and fee receipts.
