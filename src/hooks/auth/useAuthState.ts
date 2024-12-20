import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { authService } from '../../services/auth';

export const useAuthState = () => {
  const { user, setUser } = useStore();

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
  }, [user, setUser]);

  return {
    user,
    isAuthenticated: !!user,
  };
};