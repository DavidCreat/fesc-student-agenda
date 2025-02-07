import api from '../api/axios';
import { User } from '../../models/types';
import { LoginCredentials, RegisterData, AuthResponse } from './types';

export class AuthService {
  private baseURL = '/api/auth';

  private setAuthToken(token: string) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Making login request to:', `${this.baseURL}/login`);
      console.log('With credentials:', credentials);
      const { data } = await api.post<AuthResponse>(`${this.baseURL}/login`, credentials);
      console.log('Login response data:', data);
      if (data.token) {
        this.setAuthToken(data.token);
      }
      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Login error response:', error.response);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Making registration request to:', `${this.baseURL}/register`);
      console.log('With data:', { ...userData, password: '[REDACTED]' });
      const { data } = await api.post<AuthResponse>(`${this.baseURL}/register`, userData);
      console.log('Registration successful');
      if (data.token) {
        this.setAuthToken(data.token);
      }
      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Registration error response:', error.response);
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const { data } = await api.get<User>(`${this.baseURL}/me`);
      return data;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();