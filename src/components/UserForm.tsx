import React from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../models/types';
import { useStore } from '../store/useStore';

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
          {...register('fullName', { required: true })}
          className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
        />
        {errors.fullName && <span className="text-red-500">Campo requerido</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Carrera</label>
        <input
          {...register('career', { required: true })}
          className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Semestre</label>
        <input
          type="number"
          {...register('semester', { required: true, min: 1, max: 10 })}
          className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Jornada</label>
        <select
          {...register('schedule', { required: true })}
          className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
        >
          <option value="day">Diurna</option>
          <option value="night">Nocturna</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Correo Institucional</label>
        <input
          {...register('email', {
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@fes\.edu\.co$/,
              message: 'Debe ser un correo institucional (@fes.edu.co)'
            }
          })}
          className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
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