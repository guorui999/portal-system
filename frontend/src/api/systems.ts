import request from './request';
import type { System, CreateSystemDto, UpdateSystemDto, Target } from '../types';

export const systemsApi = {
  getList: (target: Target): Promise<System[]> => {
    return request.get('/systems', { params: { target } });
  },

  create: (data: CreateSystemDto): Promise<System> => {
    return request.post('/systems', data);
  },

  update: (id: number, data: UpdateSystemDto): Promise<System> => {
    return request.patch(`/systems/${id}`, data);
  },

  delete: (id: number): Promise<void> => {
    return request.delete(`/systems/${id}`);
  },
};
