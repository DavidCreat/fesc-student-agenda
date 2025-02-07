import { useStore } from '../store/useStore';

export const useAuthState = () => {
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return {
    user,
    isAuthenticated,
  };
};
