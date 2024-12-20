import axios from 'axios';
import type { User } from '../models/types';

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  career: string;
  semester: number;
  schedule: 'day' | 'night';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;
  private api = axios.create({
    baseURL: import.meta.env.DEV 
      ? '/api/auth'  // Desarrollo: usa el proxy de Vite
      : '/api/auth', // Producción: usa la misma base URL
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setAuthHeader(this.token);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.api.post('/register', data);
      const { token } = response.data;
      this.setToken(token);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al registrar usuario');
      }
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post('/login', credentials);
      const { token } = response.data;
      this.setToken(token);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
      }
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    delete this.api.defaults.headers.common['Authorization'];
    this.token = null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
    this.setAuthHeader(token);
    this.token = token;
  }

  private setAuthHeader(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.api.get('/me');
      return response.data.user;
    } catch (error) {
      this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();