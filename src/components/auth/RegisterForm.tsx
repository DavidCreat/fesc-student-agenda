import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { useForm } from '../../hooks/useForm';
import { userSchema } from '../../utils/validation';
import { CAREERS } from '../../constants/careers';
import { FormField } from '../common/FormField';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

export const RegisterForm = () => {
  const { data, errors, handleChange, validate } = useForm(userSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Handle registration
      console.log('Form data:', data);
    }
  };

  const careerOptions = CAREERS.map(career => ({
    value: career,
    label: career,
  }));

  const scheduleOptions = [
    { value: 'day', label: 'Diurna' },
    { value: 'night', label: 'Nocturna' },
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="backdrop-blur-lg bg-white/30 p-8 rounded-xl shadow-xl max-w-md w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-center mb-8">
        <UserPlus className="text-red-600 w-8 h-8 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Registro</h2>
      </div>

      <FormField label="Nombre completo" error={errors.fullName}>
        <Input
          type="text"
          value={data.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          error={errors.fullName}
        />
      </FormField>

      <FormField label="Carrera" error={errors.career}>
        <Select
          value={data.career || ''}
          onChange={(e) => handleChange('career', e.target.value)}
          options={careerOptions}
          error={errors.career}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Semestre" error={errors.semester}>
          <Input
            type="number"
            min={1}
            max={10}
            value={data.semester || ''}
            onChange={(e) => handleChange('semester', parseInt(e.target.value))}
            error={errors.semester}
          />
        </FormField>

        <FormField label="Jornada" error={errors.schedule}>
          <Select
            value={data.schedule || ''}
            onChange={(e) => handleChange('schedule', e.target.value)}
            options={scheduleOptions}
            error={errors.schedule}
          />
        </FormField>
      </div>

      <FormField label="Correo institucional" error={errors.email}>
        <Input
          type="email"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="usuario@fesc.edu.co"
          error={errors.email}
        />
      </FormField>

      <FormField label="Contraseña" error={errors.password}>
        <Input
          type="password"
          value={data.password || ''}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
        />
      </FormField>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        Registrarse
      </motion.button>
    </motion.form>
  );
};