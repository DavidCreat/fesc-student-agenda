import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Auth Components
import { AuthPage } from './pages/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Main Components
import { Dashboard } from '@components/Dashboard';
import { Navigation } from '@components/Navigation';
import { Profile } from '@components/Profile';
import { Schedule } from '@components/Schedule';
import { Reports } from '@components/Reports';
import ErrorBoundary from '@components/ErrorBoundary';
import { RecommendationSystem } from '@components/RecommendationSystem';
import { Toaster } from '@components/common/Toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Toaster />
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Protected Routes - Only show Navigation for these routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <div className="p-4">
                      <Dashboard studentId="default" />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <div className="p-4">
                      <Profile />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <div className="p-4">
                      <Schedule />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <div className="p-4">
                      <Reports />
                    </div>
                  </>
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;