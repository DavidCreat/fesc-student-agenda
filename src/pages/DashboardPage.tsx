import React from 'react';
import { Dashboard } from '../components/Dashboard.js';
import { useStore } from '../store/useStore.js';

export const DashboardPage: React.FC = () => {
  const user = useStore((state) => state.user);

  if (!user) {
    return null;
  }

  return <Dashboard studentId={user.studentId} />;
}; 