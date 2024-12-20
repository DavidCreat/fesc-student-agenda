import axios from 'axios';
import { User } from '../../models/types';
import { LoginCredentials, RegisterData, AuthResponse } from './types';

export class AuthService {
  private baseURL = '/api/auth';

  private setAuthToken(token: string) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await axios.post<AuthResponse>(`${this.baseURL}/login`, credentials);
      this.setAuthToken(data.token);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const { data } = await axios.post<AuthResponse>(`${this.baseURL}/register`, userData);
      this.setAuthToken(data.token);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const { data } = await axios.get<User>(`${this.baseURL}/me`);
      return data;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}