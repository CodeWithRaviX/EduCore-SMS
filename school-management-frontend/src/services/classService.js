import api from '../api/axios';

const classService = {
  getAllClasses: () => api.get('/classes'),
  getAllClassesWithCount: () => api.get('/classes/with-count'),
  getClassById: (id) => api.get(`/classes/${id}`),
  createClass: (classData) => api.post('/classes', classData),
  updateClass: (id, classData) => api.put(`/classes/${id}`, classData),
  deleteClass: (id) => api.delete(`/classes/${id}`),
};

export default classService;
