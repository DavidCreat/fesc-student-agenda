import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FaUser, FaEnvelope, FaGraduationCap, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { authService } from '../services/auth/AuthService';

export const Profile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [setUser]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
        Error: No se ha podido cargar la información del usuario.
      </div>
    );
  }

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'No disponible';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Encabezado del perfil */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfil del Estudiante</h1>
        <p className="text-gray-600">Información personal y académica</p>
      </div>

      {/* Tarjeta principal de información */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-8">
          <div className="flex items-center justify-center">
            <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center shadow-lg">
              <FaUser className="h-16 w-16 text-red-600" />
            </div>
          </div>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
            <p className="text-red-100">Estudiante {user.schedule === 'day' ? 'Diurno' : 'Nocturno'}</p>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Personal */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Personal</h3>
              
              <div className="flex items-center space-x-3">
                <FaEnvelope className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Correo Electrónico</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaClock className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Último Acceso</p>
                  <p className="text-gray-900">{formatDate(new Date())}</p>
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Académica</h3>
              
              <div className="flex items-center space-x-3">
                <FaGraduationCap className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Programa Académico</p>
                  <p className="text-gray-900">{user.career || 'No especificado'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Semestre Actual</p>
                  <p className="text-gray-900">{user.semester ? `${user.semester}° Semestre` : 'No especificado'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Fecha de Registro</p>
                  <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};