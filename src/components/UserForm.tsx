import React from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../models/types';
import { useStore } from '../store/useStore';

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="mt-2 flex items-center bg-red-50 border-l-4 border-red-500 p-2 rounded">
    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span className="text-sm text-red-700">{message}</span>
  </div>
);

export const UserForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<User>();
  const setUser = useStore((state) => state.setUser);

  const onSubmit = (data: User) => {
    setUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-red-600 mb-6">Registro de Usuario</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Nombre Completo</label>
        <input
          {...register('fullName', { 
            required: 'El nombre completo es requerido',
            minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' }
          })}
          className={`w-full p-2 border rounded focus:border-red-500 focus:outline-none ${errors.fullName ? 'border-red-500' : ''}`}
        />
        {errors.fullName && <ErrorMessage message={errors.fullName.message || 'Campo requerido'} />}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Carrera</label>
        <input
          {...register('career', { 
            required: 'La carrera es requerida' 
          })}
          className={`w-full p-2 border rounded focus:border-red-500 focus:outline-none ${errors.career ? 'border-red-500' : ''}`}
        />
        {errors.career && <ErrorMessage message={errors.career.message || 'Campo requerido'} />}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Semestre</label>
        <input
          type="number"
          {...register('semester', { 
            required: 'El semestre es requerido',
            min: { value: 1, message: 'El semestre mínimo es 1' },
            max: { value: 10, message: 'El semestre máximo es 10' }
          })}
          className={`w-full p-2 border rounded focus:border-red-500 focus:outline-none ${errors.semester ? 'border-red-500' : ''}`}
        />
        {errors.semester && <ErrorMessage message={errors.semester.message || 'Campo requerido'} />}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Jornada</label>
        <select
          {...register('schedule', { 
            required: 'La jornada es requerida' 
          })}
          className={`w-full p-2 border rounded focus:border-red-500 focus:outline-none ${errors.schedule ? 'border-red-500' : ''}`}
        >
          <option value="">Selecciona una jornada</option>
          <option value="day">Diurna</option>
          <option value="night">Nocturna</option>
        </select>
        {errors.schedule && <ErrorMessage message={errors.schedule.message || 'Campo requerido'} />}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Correo Institucional</label>
        <input
          {...register('email', {
            required: 'El correo es requerido',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@fesc\.edu\.co$/,
              message: 'Por favor usa tu correo @fesc.edu.co'
            }
          })}
          className={`w-full p-2 border rounded focus:border-red-500 focus:outline-none ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <ErrorMessage message={errors.email.message || 'Campo requerido'} />}
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
      >
        Registrar
      </button>
    </form>
  );
};