import React from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';

interface ScheduleFormData {
  subject: string;
  startTime: string;
  endTime: string;
  date: string;
  room?: string;
  professor?: string;
}

export const ScheduleForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ScheduleFormData>();
  const { user, createScheduleEntry } = useStore();

  const onSubmit = async (data: ScheduleFormData) => {
    if (!user?._id) return;
    
    try {
      await createScheduleEntry({
        ...data,
        userId: user._id
      });
      reset();
    } catch (error) {
      console.error('Error al crear la entrada de horario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Nueva Clase</h2>
      
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hora de Inicio</label>
            <input
              type="time"
              {...register('startTime', { required: 'La hora de inicio es requerida' })}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
            {errors.startTime && <span className="text-red-500 text-sm">{errors.startTime.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hora de Fin</label>
            <input
              type="time"
              {...register('endTime', { required: 'La hora de fin es requerida' })}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
            {errors.endTime && <span className="text-red-500 text-sm">{errors.endTime.message}</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            {...register('date', { required: 'La fecha es requerida' })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          {errors.date && <span className="text-red-500 text-sm">{errors.date.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Salón</label>
          <input
            {...register('room')}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profesor</label>
          <input
            {...register('professor')}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
        >
          Agregar Clase
        </button>
      </div>
    </form>
  );
};