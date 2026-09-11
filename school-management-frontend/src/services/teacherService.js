import api from '../api/axios';

const teacherService = {
  getAllTeachers: () => api.get('/teachers'),
  getTeacherById: (id) => api.get(`/teachers/${id}`),
  createTeacher: (teacherData) => api.post('/teachers', teacherData),
  updateTeacher: (id, teacherData) => api.put(`/teachers/${id}`, teacherData),
  deleteTeacher: (id) => api.delete(`/teachers/${id}`),
};

export default teacherService;
