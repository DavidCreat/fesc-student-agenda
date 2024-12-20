import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { authService } from '../../services/auth';
import type { LoginCredentials } from '../../services/auth';

export const useAuthActions = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setUser = useStore((state) => state.setUser);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setLoading(true);
      const { user } = await authService.login(credentials.email, credentials.password);
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    handleLogin,
  };
};