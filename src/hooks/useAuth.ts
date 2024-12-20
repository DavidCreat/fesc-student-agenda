import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { authService, LoginCredentials, RegisterData } from '../services/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser, user } = useStore();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };

    if (!user && authService.isAuthenticated()) {
      checkAuth();
    }
  }, [setUser, user]);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setLoading(true);
      const { user } = await authService.login(credentials);
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterData) => {
    try {
      setError(null);
      setLoading(true);
      const { user } = await authService.register(userData);
      setUser(user);
      navigate('/');
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
      navigate('/login');
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
    isAuthenticated: authService.isAuthenticated(),
  };
};