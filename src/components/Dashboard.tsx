import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { recommendationsService } from '../services/recommendations';
import { FaGraduationCap, FaCalendarAlt, FaBook, FaBell, FaExternalLinkAlt } from 'react-icons/fa';
import { useStore } from '../store/useStore';

type RecommendationType = {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'article' | 'video' | 'course';
  url?: string;
  date?: string;
}

interface DashboardProps {
  studentId: string;
}

const RecommendationCard: React.FC<{ recommendation: RecommendationType }> = ({ recommendation }) => {
  const getIcon = () => {
    switch (recommendation.type) {
      case 'book':
        return <FaBook className="text-blue-500" />;
      case 'video':
        return <FaGraduationCap className="text-green-500" />;
      case 'course':
        return <FaCalendarAlt className="text-purple-500" />;
      case 'article':
        return <FaBook className="text-orange-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-gray-100 text-gray-800">
            {recommendation.type.toUpperCase()}
          </span>
        </div>
        {recommendation.date && recommendation.date.trim() !== '' && (
          <span className="text-sm text-gray-500">
            {new Date(recommendation.date).toLocaleDateString('es-CO')}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2">{recommendation.title}</h3>
      <p className="text-gray-600 mb-4">{recommendation.description}</p>
      {recommendation.url && (
        <a
          href={recommendation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          Ver más <FaExternalLinkAlt className="ml-2 h-4 w-4" />
        </a>
      )}
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ studentId }) => {
  const user = useStore((state) => state.user);
  const { data: recommendations = [], isLoading, error } = useQuery({
    queryKey: ['recommendations', studentId],
    queryFn: () => recommendationsService.getRecommendations({ 
      limit: 6 
    }),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000 // Mantener los datos frescos por 5 minutos
  });

  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          Error al cargar las recomendaciones. Por favor, intenta de nuevo más tarde.
        </div>
      );
    }

    return (
      <>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <FaGraduationCap className="text-4xl mr-4 opacity-75" />
              <div>
                <h2 className="text-xl font-semibold">Materias Activas</h2>
                <p className="text-blue-100 mt-1">6 materias</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <FaCalendarAlt className="text-4xl mr-4 opacity-75" />
              <div>
                <h2 className="text-xl font-semibold">Tareas Pendientes</h2>
                <p className="text-green-100 mt-1">4 tareas</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <FaBook className="text-4xl mr-4 opacity-75" />
              <div>
                <h2 className="text-xl font-semibold">Recursos</h2>
                <p className="text-purple-100 mt-1">12 disponibles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recomendaciones para ti</h2>
            <button className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200">
              Ver todas
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((recommendation: RecommendationType) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-md">
              <FaCalendarAlt className="text-2xl text-red-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Agendar Asesoría</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-md">
              <FaBook className="text-2xl text-red-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Nueva Tarea</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-md">
              <FaGraduationCap className="text-2xl text-red-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Ver Calificaciones</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-md">
              <FaBell className="text-2xl text-red-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Notificaciones</span>
            </button>
          </div>
        </div>
      </>
    );
  };

  // Si no hay usuario, mostramos un mensaje de error
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
              Error: No se ha podido cargar la información del usuario.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area - adjusted for Navigation bar */}
      <div className="pt-14"> {/* pt-14 adds padding to account for the fixed Navigation bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Bienvenido a tu Dashboard
          </h1>
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
};