import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaGraduationCap, FaCalendarAlt, FaBook, FaBell, FaUser } from 'react-icons/fa';
import { useStore } from '../store/useStore';
import { DashboardModal } from './modals/DashboardModal';
import { TaskForm } from './forms/TaskForm';
import { ScheduleForm } from './forms/ScheduleForm';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboard/DashboardService';

type InfoCardType = {
  id: string;
  title: string;
  description: string;
  type: 'task' | 'schedule' | 'note';
  dueDate?: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [activeModal, setActiveModal] = useState<'task' | 'schedule' | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getDashboardData(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000
  });

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    handleModalClose();
  };

  const InfoCard: React.FC<{ info: InfoCardType }> = ({ info }) => {
    const getIcon = () => {
      switch (info.type) {
        case 'task':
          return <FaBook className="text-blue-500" />;
        case 'schedule':
          return <FaCalendarAlt className="text-green-500" />;
        case 'note':
          return <FaBell className="text-orange-500" />;
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
              {info.type === 'task' ? 'TAREA' : info.type === 'schedule' ? 'HORARIO' : 'NOTA'}
            </span>
          </div>
          {info.dueDate && (
            <span className="text-sm text-gray-500">
              {new Date(info.dueDate).toLocaleDateString('es-CO')}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
        <p className="text-gray-600 mb-4">{info.description}</p>
      </div>
    );
  };

  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      );
    }

    if (error) {
      console.error('Error loading dashboard:', error);
      return (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          Error al cargar los datos. Por favor, intenta de nuevo más tarde.
        </div>
      );
    }

    const pendingTasks = data?.tasks?.filter((task) => {
      if (task.completed) return false;
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      return dueDate >= now;
    }) || [];

    const overdueTasks = data?.tasks?.filter((task) => {
      if (task.completed) return false;
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      return dueDate < now;
    }) || [];

    const totalPendingTasks = pendingTasks.length + overdueTasks.length;

    const todaySchedule = data?.schedule?.filter((entry) => {
      const today = new Date();
      const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      return entry.dayOfWeek.toLowerCase() === dayOfWeek;
    }) || [];

    return (
      <>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <FaGraduationCap className="text-4xl mr-4 opacity-75" />
              <div>
                <h2 className="text-xl font-semibold">Materias Hoy</h2>
                <p className="text-blue-100 mt-1">{todaySchedule.length} materias</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <FaCalendarAlt className="text-4xl mr-4 opacity-75" />
              <div>
                <h2 className="text-xl font-semibold">Tareas Pendientes</h2>
                <div className="text-green-100 mt-1">
                  <p>{pendingTasks.length} por entregar</p>
                  {overdueTasks.length > 0 && (
                    <p className="text-red-200">{overdueTasks.length} atrasadas</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center">
              <FaBook className="text-4xl mr-4 opacity-75" />
              <div>
                <h2 className="text-xl font-semibold">Progreso</h2>
                <p className="text-purple-100 mt-1">{user?.semester}° Semestre</p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Información Importante</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingTasks.slice(0, 3).map((task) => (
              <InfoCard
                key={task._id}
                info={{
                  id: task._id,
                  title: task.title,
                  description: task.description,
                  type: 'task',
                  dueDate: task.dueDate
                }}
              />
            ))}
            {overdueTasks.slice(0, 3).map((task) => (
              <InfoCard
                key={task._id}
                info={{
                  id: task._id,
                  title: task.title,
                  description: task.description,
                  type: 'task',
                  dueDate: task.dueDate
                }}
              />
            ))}
            {todaySchedule.slice(0, 3).map((entry) => (
              <InfoCard
                key={entry._id}
                info={{
                  id: entry._id,
                  title: entry.subject,
                  description: `${entry.startTime} - ${entry.endTime} | ${entry.room}`,
                  type: 'schedule'
                }}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveModal('task')}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-md relative"
            >
              <div className="relative">
                <FaBook className="text-2xl text-red-500 mb-2" />
                {totalPendingTasks > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalPendingTasks}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">Nueva Tarea</span>
            </button>
            <button
              onClick={() => setActiveModal('schedule')}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
            >
              <FaCalendarAlt className="text-2xl text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Agregar Materia</span>
            </button>
            <button
              onClick={() => navigate('/schedule')}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
            >
              <FaGraduationCap className="text-2xl text-green-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Ver Horario</span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
            >
              <FaUser className="text-2xl text-purple-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Mi Perfil</span>
            </button>
          </div>
        </div>

        {/* Modals */}
        <DashboardModal
          isOpen={activeModal === 'task'}
          onClose={handleModalClose}
          title="Nueva Tarea"
        >
          <TaskForm onSuccess={handleFormSuccess} onCancel={handleModalClose} />
        </DashboardModal>

        <DashboardModal
          isOpen={activeModal === 'schedule'}
          onClose={handleModalClose}
          title="Agregar Materia al Horario"
        >
          <ScheduleForm onSuccess={handleFormSuccess} onCancel={handleModalClose} />
        </DashboardModal>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Bienvenido, {user?.fullName?.split(' ')[0]}
      </h1>
      {renderDashboardContent()}
    </div>
  );
};