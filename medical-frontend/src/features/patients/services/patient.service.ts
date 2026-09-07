import axios from 'axios';

const API_URL = 'http://localhost:5000/api/patients';

// We could use an env variable but for now this works.
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const patientService = {
  async getAll(params?: Record<string, any>) {
    const response = await apiClient.get('/', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await apiClient.post('/', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await apiClient.put(`/${id}`, data);
    return response.data;
  },

  async archive(id: string) {
    const response = await apiClient.patch(`/${id}/archive`);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  }
};
