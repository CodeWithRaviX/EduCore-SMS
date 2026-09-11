import api from '../api/axios';

const feeService = {
  getAllFees: () => api.get('/fees'),
  getFeeById: (id) => api.get(`/fees/${id}`),
  getPendingFees: () => api.get('/fees/pending'),
  getFeesByStudent: (studentId) => api.get(`/fees/student/${studentId}`),
  createFee: (feeData) => api.post('/fees', feeData),
  updateFee: (id, feeData) => api.put(`/fees/${id}`, feeData),
  deleteFee: (id) => api.delete(`/fees/${id}`),
};

export default feeService;
