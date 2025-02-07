import api from '../api/axios';
import { User } from '../../models/types';
import { LoginCredentials, RegisterData, AuthResponse } from './types';

export class AuthService {
  private baseURL = '/api/auth';

  private setAuthToken(token: string) {
    console.log('Guardando token:', token);
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Headers configurados:', api.defaults.headers.common);
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
    console.log('Token actual:', token);
    if (!token) return null;

    try {
      console.log('Haciendo petición a /me con token');
      const { data } = await api.get<User>(`${this.baseURL}/me`);
      console.log('Respuesta de /me:', data);
      return data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async verifyToken(): Promise<User | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const { data } = await api.get<User>(`${this.baseURL}/verify`);
      return data;
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw error;
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