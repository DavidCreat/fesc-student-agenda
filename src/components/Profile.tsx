import React from 'react';
import { useStore } from '../store/useStore';
import { FaUser, FaEnvelope, FaGraduationCap, FaIdCard, FaClock, FaCalendarAlt } from 'react-icons/fa';

export const Profile: React.FC = () => {
  const user = useStore((state) => state.user);

  if (!user) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
        Error: No se ha podido cargar la información del usuario.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Encabezado del perfil */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfil del Estudiante</h1>
        <p className="text-gray-600">Gestiona tu información personal y académica</p>
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
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-red-100">Estudiante Activo</p>
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
                <FaIdCard className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Identificación</p>
                  <p className="text-gray-900">{user.studentId || 'No disponible'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaClock className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Último Acceso</p>
                  <p className="text-gray-900">{new Date().toLocaleDateString('es-CO')}</p>
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
                  <p className="text-gray-900">{user.program || 'No especificado'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Semestre Actual</p>
                  <p className="text-gray-900">{user.semester || 'No especificado'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end space-x-4 mt-6">
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
          Editar Perfil
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
          Cambiar Contraseña
        </button>
      </div>
    </div>
  );
};