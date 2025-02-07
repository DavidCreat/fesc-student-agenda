import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '../store/useStore';
import { FaCheckCircle, FaRegCircle, FaPlus, FaClock, FaCalendarAlt, FaBook } from 'react-icons/fa';

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  subject: string;
  priority: 'high' | 'medium' | 'low';
}

export const Tasks: React.FC = () => {
  const user = useStore((state) => state.user);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    subject: '',
    priority: 'medium' as const,
  });

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', user?.id],
    queryFn: () => fetch('http://localhost:5000/api/tasks').then(res => res.json()),
    enabled: !!user?.id,
  });

  const createTaskMutation = useMutation({
    mutationFn: (task: Omit<Task, '_id' | 'completed'>) =>
      fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowForm(false);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        subject: '',
        priority: 'medium',
      });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: (taskId: string) =>
      fetch(`http://localhost:5000/api/tasks/${taskId}/toggle`, {
        method: 'PUT',
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate(newTask);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tareas</h1>
          <p className="text-gray-600 mt-1">Gestiona tus tareas y actividades pendientes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
        >
          <FaPlus className="mr-2" />
          Nueva Tarea
        </button>
      </div>

      {/* Formulario de nueva tarea */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Nueva Tarea</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de entrega</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Materia</label>
                <input
                  type="text"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Guardar Tarea
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de tareas */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="p-6 hover:bg-gray-50 transition-colors duration-200 flex items-start space-x-4"
            >
              <button
                onClick={() => toggleTaskMutation.mutate(task._id)}
                className="mt-1 focus:outline-none"
              >
                {task.completed ? (
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <FaRegCircle className="h-6 w-6 text-gray-400 hover:text-gray-500" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)} bg-opacity-10`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
                <p className={`mt-1 text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                  {task.description}
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1.5 h-4 w-4" />
                    {new Date(task.dueDate).toLocaleDateString('es-CO')}
                  </div>
                  <div className="flex items-center">
                    <FaBook className="mr-1.5 h-4 w-4" />
                    {task.subject}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No hay tareas pendientes. ¡Buen trabajo!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
