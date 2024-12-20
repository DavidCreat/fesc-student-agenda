import axios from 'axios';
import { User } from '../models/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      this.setToken(response.data.token);
      return response.data;
    } catch (error) {
      throw new Error('Error al iniciar sesión');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.token = null;
  }
}

export const authService = new AuthService();