// src/hooks/auth/useAuthState.ts
import { useStore } from '../../store/useStore';

export const useAuthState = () => {
  const user = useStore((state) => state.user);
  return {
    user,
    isAuthenticated: !!user
  };
};