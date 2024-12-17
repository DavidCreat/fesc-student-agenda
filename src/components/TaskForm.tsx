import React from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';

interface TaskFormData {
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export const TaskForm = () => {
  const { register, handleSubmit, reset } = useForm<TaskFormData>();
  const addTask = useStore((state) => state.addTask);

  const onSubmit = (data: TaskFormData) => {
    addTask({
      ...data,
      id: Date.now().toString(),
      completed: false,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Nueva Tarea</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Materia</label>
          <input
            {...register('subject', { required: true })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            {...register('title', { required: true })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            {...register('description')}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
          <input
            type="date"
            {...register('dueDate', { required: true })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prioridad</label>
          <select
            {...register('priority')}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
        >
          Agregar Tarea
        </button>
      </div>
    </form>
  );
};