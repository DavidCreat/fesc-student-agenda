import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from '../hooks/auth';
import Login from '../components/auth/login';
import Register from '../components/auth/register';

export const AuthPage = () => {
  const { isAuthenticated } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-500 to-red-600">
      {isLoginPage ? <Login /> : <Register />}
    </div>
  );
};