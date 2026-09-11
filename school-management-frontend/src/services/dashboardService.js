import api from '../api/axios';

const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export default dashboardService;
