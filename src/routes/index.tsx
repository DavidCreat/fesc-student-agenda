import { Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation.js';
import { Dashboard } from '../components/Dashboard.js';
import { SchedulePage } from '../pages/SchedulePage.js';
import { TasksPage } from '../pages/TasksPage.js';
import { AuthPage } from '../pages/AuthPage.js';
import { Profile } from '../components/Profile.js';
import { Reports } from '../components/Reports.js';
import { SessionPage } from '../pages/SessionPage.js';
import { useAuthState } from '../hooks/auth.js';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthState();
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

export const AppRoutes = () => {
  const { user } = useAuthState();

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard studentId={user.studentId} /></PrivateRoute>} />
          <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><TasksPage /></PrivateRoute>} />
          <Route path="/session" element={<PrivateRoute><SessionPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};