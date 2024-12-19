import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SESSION_TIMEOUT } from '../utils/constants';

export const useSession = () => {
  const { user, setUser, sessionStartTime, startSession, endSession } = useStore();

  useEffect(() => {
    if (user && !sessionStartTime) {
      startSession();
    }

    const checkSession = () => {
      if (sessionStartTime && Date.now() - sessionStartTime > SESSION_TIMEOUT) {
        setUser(null);
        endSession();
      }
    };

    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, [user, sessionStartTime, setUser, startSession, endSession]);

  return {
    isAuthenticated: !!user,
    sessionDuration: sessionStartTime 
      ? Math.floor((Date.now() - sessionStartTime) / 1000 / 60)
      : 0
  };
};