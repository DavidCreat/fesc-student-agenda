import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Get the token from localStorage
  const token = localStorage.getItem('token');

  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the protected content
  return <>{children}</>;
};
