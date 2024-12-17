import axios from 'axios';
import { User } from '../models/types';

const API_URL = '/api/auth';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error('Error al iniciar sesión');
  }
};

export const register = async (userData: Partial<User> & { password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error('Error al registrar usuario');
  }
};