// src/hooks/auth/useAuthActions.ts
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { authService, RegisterData, LoginCredentials } from '../../services/auth';

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useStore((state) => ({ 
    user: state.user, 
    setUser: state.setUser 
  }));

  const handleAuth = async (
    credentials: LoginCredentials | RegisterData,
    type: 'login' | 'register'
  ) => {
    try {
      setError(null);
      setLoading(true);
      const response = await (type === 'login' 
        ? authService.login(credentials as LoginCredentials)
        : authService.register(credentials as RegisterData)
      );
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al ${type === 'login' ? 'iniciar sesión' : 'registrar'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login: (creds: LoginCredentials) => handleAuth(creds, 'login'),
    register: (data: RegisterData) => handleAuth(data, 'register'),
    logout: () => {
      authService.logout();
      setUser(null);
    }
  };
};