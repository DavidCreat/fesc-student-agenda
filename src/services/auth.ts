import { AxiosError } from 'axios';
import { api } from './api';
import { clientConfig } from '../config/client-config';

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  career: string;
  semester: number | string;
  schedule: 'day' | 'night';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    career: string;
    semester: number;
    schedule: 'day' | 'night';
  };
}

class AuthService {
  async loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Making login request to:', `${clientConfig.authApiUrl}/login`);
      const { data } = await api.post<AuthResponse>(
        `${clientConfig.authApiUrl}/login`,
        credentials
      );
      console.log('Login response data:', data);
      return data;
    } catch (error) {
      console.error('Auth service error:', error);
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message || 'Error al iniciar sesión';
        console.error('Auth service error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message
        });
        throw new Error(message);
      }
      throw error;
    }
  }

  async registerUser(data: RegisterData): Promise<AuthResponse> {
    try {
      // Convert semester to number if it's a string
      const registerData = {
        ...data,
        semester: typeof data.semester === 'string' ? parseInt(data.semester, 10) : data.semester
      };

      const { data: response } = await api.post<AuthResponse>(
        `${clientConfig.authApiUrl}/register`,
        registerData
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          throw new Error('El correo electrónico ya está registrado');
        }
        throw new Error(error.response?.data?.message || 'Error al registrar usuario');
      }
      throw error;
    }
  }
}

export const authService = new AuthService();