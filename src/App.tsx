import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { SchedulePage } from './pages/SchedulePage';
import { TasksPage } from './pages/TasksPage';
import { AuthPage } from './pages/AuthPage';
import { useStore } from './store/useStore';

function App() {
  const user = useStore((state) => state.user);

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;