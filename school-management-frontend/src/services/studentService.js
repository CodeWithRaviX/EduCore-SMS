import api from '../api/axios';

const studentService = {
  getAllStudents: () => api.get('/students'),
  getStudentById: (id) => api.get(`/students/${id}`),
  searchStudents: (name) => api.get(`/students/search?name=${encodeURIComponent(name)}`),
  getStudentsByClass: (classId) => api.get(`/students/class/${classId}`),
  createStudent: (studentData) => api.post('/students', studentData),
  updateStudent: (id, studentData) => api.put(`/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/students/${id}`),
};

export default studentService;
