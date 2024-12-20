import { User } from '../../models/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData extends Partial<User> {
  password: string;
}