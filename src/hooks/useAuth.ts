import { useState } from 'react';
import { useStore } from '../store/useStore';
import { authService, LoginCredentials } from '../services/auth';
import { User } from '../models/types';

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setUser = useStore((state) => state.setUser);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setLoading(true);
      const { user } = await authService.login(credentials);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData: Partial<User> & { password: string }) => {
    try {
      setError(null);
      setLoading(true);
      const { user } = await authService.register(userData);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return {
    error,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};