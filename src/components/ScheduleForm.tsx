import React from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';

interface ScheduleFormData {
  day: string;
  subject: string;
  startTime: string;
  endTime: string;
  classroom: string;
}

export const ScheduleForm = () => {
  const { register, handleSubmit, reset } = useForm<ScheduleFormData>();
  const addScheduleEntry = useStore((state) => state.addScheduleEntry);

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      await addScheduleEntry(data);
      reset();
    } catch (error) {
      console.error('Error adding schedule entry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Día</label>
        <select {...register('day')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          <option value="monday">Lunes</option>
          <option value="tuesday">Martes</option>
          <option value="wednesday">Miércoles</option>
          <option value="thursday">Jueves</option>
          <option value="friday">Viernes</option>
          <option value="saturday">Sábado</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Materia</label>
        <input
          type="text"
          {...register('subject')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Hora Inicio</label>
          <input
            type="time"
            {...register('startTime')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hora Fin</label>
          <input
            type="time"
            {...register('endTime')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Salón</label>
        <input
          type="text"
          {...register('classroom')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
      >
        Agregar Clase
      </button>
    </form>
  );
};