import { api } from '../api/axios';
import { User } from '../../models/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  },

  async register(userData: Partial<User> & { password: string }): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);
    localStorage.setItem('token', data.token);
    return data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    api.defaults.headers.common.Authorization = '';
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};