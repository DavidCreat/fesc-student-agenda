import { useState } from 'react';
import { useStore } from '../store/useStore';
import { authService, RegisterData, LoginCredentials } from '../services/auth';

export function useAuthState() {
  const user = useStore((state) => state.user);
  return {
    user,
    isAuthenticated: !!user
  };
}

export function useAuthActions() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setUser = useStore((state) => state.setUser);

  const handleRegister = async (data: RegisterData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar usuario';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    handleRegister,
    handleLogin,
    handleLogout,
    loading,
    error,
    isAuthenticated: authService.isAuthenticated()
  };
} 