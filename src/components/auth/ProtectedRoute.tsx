import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { authService } from '../../services/auth/AuthService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, setUser } = useStore();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifySession = async () => {
      if (token && !user) {
        try {
          const userData = await authService.verifyToken();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };

    verifySession();
  }, [token, user, setUser]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Mostrar un estado de carga mientras verificamos el token
  if (token && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};
