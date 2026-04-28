import request from './request';
import type { LoginDto, LoginResponse } from '../types';

export const authApi = {
  login: (data: LoginDto): Promise<LoginResponse> => {
    return request.post('/auth/login', data);
  },
};
