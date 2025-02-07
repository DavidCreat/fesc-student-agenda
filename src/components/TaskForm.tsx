import React from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';
import { TaskFormData } from '../models/types';

export const TaskForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>();
  const { user, createTask } = useStore();

  const onSubmit = async (data: TaskFormData) => {
    try {
      await createTask(data);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Nueva Tarea</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Materia</label>
          <input
            {...register('subject', { required: 'La materia es requerida' })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            autoComplete="off"
          />
          {errors.subject && <span className="text-red-500 text-sm">{errors.subject.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            {...register('title', { required: 'El título es requerido' })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            autoComplete="off"
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            {...register('description')}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de entrega</label>
          <input
            type="datetime-local"
            {...register('dueDate', { required: 'La fecha de entrega es requerida' })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          {errors.dueDate && <span className="text-red-500 text-sm">{errors.dueDate.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prioridad</label>
          <select
            {...register('priority', { required: 'La prioridad es requerida' })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
          {errors.priority && <span className="text-red-500 text-sm">{errors.priority.message}</span>}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Creando...' : 'Crear Tarea'}
        </button>
      </div>
    </form>
  );
};