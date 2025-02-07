import React from 'react';
import { useStore } from '../store/useStore';

export const Profile = () => {
  const user = useStore((state) => state.user);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Perfil de Usuario</h2>
      <div className="mt-4">
        <p><strong>Nombre:</strong> {user?.fullName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Carrera:</strong> {user?.career}</p>
        <p><strong>Semestre:</strong> {user?.semester}</p>
      </div>
    </div>
  );
}; 