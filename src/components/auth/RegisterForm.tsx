import React from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { CAREERS } from '../../constants/careers';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  career: string;
  semester: number;
  schedule: 'day' | 'night';
}

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    // TODO: Implement registration logic with MongoDB
    console.log(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-lg bg-white/30 p-8 rounded-xl shadow-xl max-w-md w-full"
    >
      <div className="flex items-center justify-center mb-8">
        <UserPlus className="text-red-600 w-8 h-8 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Registro</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            {...register('fullName', { required: 'Nombre completo requerido' })}
            placeholder="Nombre completo"
            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
          />
          {errors.fullName && (
            <span className="text-red-500 text-sm mt-1">{errors.fullName.message}</span>
          )}
        </div>

        <div>
          <select
            {...register('career', { required: 'Carrera requerida' })}
            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
          >
            <option value="">Selecciona tu carrera</option>
            {CAREERS.map(career => (
              <option key={career} value={career}>{career}</option>
            ))}
          </select>
          {errors.career && (
            <span className="text-red-500 text-sm mt-1">{errors.career.message}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              {...register('semester', { 
                required: 'Semestre requerido',
                min: { value: 1, message: 'Mínimo semestre 1' },
                max: { value: 10, message: 'Máximo semestre 10' }
              })}
              placeholder="Semestre (1-10)"
              className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
            />
            {errors.semester && (
              <span className="text-red-500 text-sm mt-1">{errors.semester.message}</span>
            )}
          </div>

          <div>
            <select
              {...register('schedule', { required: 'Jornada requerida' })}
              className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
            >
              <option value="">Jornada</option>
              <option value="day">Diurna</option>
              <option value="night">Nocturna</option>
            </select>
            {errors.schedule && (
              <span className="text-red-500 text-sm mt-1">{errors.schedule.message}</span>
            )}
          </div>
        </div>

        <div>
          <input
            {...register('email', {
              required: 'Correo requerido',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@fesc\.edu\.co$/,
                message: 'Debe ser un correo @fesc.edu.co'
              }
            })}
            placeholder="Correo institucional"
            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register('password', { 
              required: 'Contraseña requerida',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' }
            })}
            placeholder="Contraseña"
            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
          />
          {errors.password && (
            <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Registrarse
        </motion.button>
      </form>
    </motion.div>
  );
};