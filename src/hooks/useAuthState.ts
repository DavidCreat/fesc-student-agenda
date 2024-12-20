import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { authService } from '../services/auth';

export const useAuthState = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  return {
    isAuthenticated,
    user
  };
}; 