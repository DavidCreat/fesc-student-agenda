import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { TaskForm } from './TaskForm';
import { FaCheckCircle, FaRegCircle, FaCalendarAlt, FaExclamationCircle, FaTrash } from 'react-icons/fa';
import { Task as TaskType } from '../models/types';

const PriorityBadge: React.FC<{ priority: TaskType['priority'] }> = ({ priority }) => {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const labels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority]}`}>
      {labels[priority]}
    </span>
  );
};

export const Tasks: React.FC = () => {
  const { tasks, loadTasks, toggleTaskComplete, deleteTask } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await loadTasks();
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [loadTasks]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      await toggleTaskComplete(taskId);
    } catch (error) {
      console.error('Error al cambiar el estado de la tarea:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
    
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tareas</h1>
          <p className="text-gray-600 mt-1">Gestiona tus tareas y actividades</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          {showForm ? 'Cerrar' : 'Nueva Tarea'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg">
          <TaskForm onSuccess={() => {
            setShowForm(false);
            loadTasks();
          }} />
        </div>
      )}

      {/* Lista de tareas */}
      <div className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hay tareas pendientes
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => handleToggleComplete(task._id)}
                    className="mt-1"
                  >
                    {task.completed ? (
                      <FaCheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <FaRegCircle className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                  <div>
                    <h3 className={`text-lg font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`mt-1 text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="text-gray-500">{task.subject}</span>
                      <PriorityBadge priority={task.priority} />
                      <span className={`flex items-center ${isOverdue(task.dueDate) && !task.completed ? 'text-red-600' : 'text-gray-500'}`}>
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && !task.completed && (
                          <FaExclamationCircle className="ml-1" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <FaTrash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
