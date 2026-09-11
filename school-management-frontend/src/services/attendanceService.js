import api from '../api/axios';

const attendanceService = {
  getAllAttendance: () => api.get('/attendance'),
  markAttendance: (data) => api.post('/attendance', data),
  markBatchAttendance: (dataList) => api.post('/attendance/batch', dataList),
  getAttendanceByDate: (date) => api.get(`/attendance/date/${date}`),
  getAttendanceByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
  getAttendanceByClassAndDate: (classId, date) => api.get(`/attendance/class/${classId}/date/${date}`),
  getAttendancePercentage: (studentId) => api.get(`/attendance/student/${studentId}/percentage`),
};

export default attendanceService;
