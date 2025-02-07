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

import { Tasks } from '@components/Tasks';
import { Session } from '@components/Session';
import { Reports } from '@components/Reports';
import ErrorBoundary from '@components/ErrorBoundary';
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


const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>
    <>
      <Navigation />
      <div className="pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </>
  </ProtectedRoute>
);



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

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedLayout>
                  <Dashboard studentId="default" />
                </ProtectedLayout>
              } />
              
              <Route path="/schedule" element={
                <ProtectedLayout>
                  <Schedule />
                </ProtectedLayout>
              } />
              
              <Route path="/tasks" element={
                <ProtectedLayout>
                  <Tasks />
                </ProtectedLayout>
              } />
              
              <Route path="/session" element={
                <ProtectedLayout>
                  <Session />
                </ProtectedLayout>
              } />
              
              <Route path="/profile" element={
                <ProtectedLayout>
                  <Profile />
                </ProtectedLayout>
              } />
              
              <Route path="/reports" element={
                <ProtectedLayout>
                  <Reports />
                </ProtectedLayout>
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