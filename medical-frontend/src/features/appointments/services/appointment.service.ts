import axios from 'axios';

const API_URL = 'http://localhost:5000/api/appointments';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const appointmentService = {
  async getAll(startDate?: string, endDate?: string) {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get('/', { params });
    return response.data.data; // because controller wraps in { success, data }
  },

  async create(data: any) {
    const response = await apiClient.post('/', data);
    return response.data.data;
  },

  async updateStatus(id: string, status: string) {
    const response = await apiClient.put(`/${id}/status`, { status });
    return response.data.data;
  },

  async updateTime(id: string, dateTime: string) {
    const response = await apiClient.put(`/${id}/time`, { dateTime });
    return response.data.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  },
};
