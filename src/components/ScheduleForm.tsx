import { useForm } from 'react-hook-form';
import { CreateScheduleEntryDTO } from '../models/types';
import FormField from './common/FormField';
import { Button } from './common/Button';
import { Select } from './common/Select';
import { CLASSROOMS } from '../constants/classrooms';
import { useScheduleActions } from '../hooks/schedule/useScheduleActions';
import Input from './common/Input';
import DashboardService from '../services/dashboard';

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Lunes' },
  { value: 'tuesday', label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday', label: 'Jueves' },
  { value: 'friday', label: 'Viernes' },
  { value: 'saturday', label: 'Sábado' }
];

export const ScheduleForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateScheduleEntryDTO>();
  const { createSchedule, loading, error } = useScheduleActions();

  const onSubmit = async (data: CreateScheduleEntryDTO) => {
    try {
      const scheduleData = {
        ...data,
        userId: 'user_id_placeholder', // Replace with actual user ID from context/store
        career: 'default_career', // Set a default or retrieve from user context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await DashboardService.createScheduleEntry(scheduleData);
      reset();
      alert('Clase agregada exitosamente');
    } catch (error) {
      console.error('Error en formulario:', error);
      alert('Error al agregar la clase. Intente nuevamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold text-gray-800">Agregar Clase</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <FormField
        label="Materia"
        error={errors.subject?.message}
      >
        <Input
          {...register('subject', { required: 'La materia es requerida', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
          placeholder="Materia"
        />
      </FormField>

      <FormField
        label="Profesor"
        error={errors.professor?.message}
      >
        <Input
          {...register('professor', { required: 'El profesor es requerido', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
          placeholder="Profesor"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Día"
          options={DAYS_OF_WEEK}
          {...register('dayOfWeek', { required: 'Seleccione un día' })}
          error={errors.dayOfWeek?.message}
        />

        <Select
          label="Salón"
          options={CLASSROOMS}
          {...register('room', { required: 'Seleccione un salón' })}
          error={errors.room?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          type="time"
          label="Hora inicio"
          {...register('startTime', { required: 'La hora de inicio es requerida' })}
          error={errors.startTime?.message}
        >
          <Input
            {...register('startTime', { required: 'La hora de inicio es requerida' })}
            type="time"
            placeholder="Hora inicio"
          />
        </FormField>

        <FormField
          type="time"
          label="Hora fin"
          {...register('endTime', { required: 'La hora de fin es requerida' })}
          error={errors.endTime?.message}
        >
          <Input
            {...register('endTime', { required: 'La hora de fin es requerida' })}
            type="time"
            placeholder="Hora fin"
          />
        </FormField>
      </div>

      <FormField
        type="number"
        label="Semestre"
        {...register('semester', { 
          required: 'El semestre es requerido',
          min: { value: 1, message: 'Mínimo semestre 1' },
          max: { value: 10, message: 'Máximo semestre 10' }
        })}
        error={errors.semester?.message}
      >
        <Input
          {...register('semester', { 
            required: 'El semestre es requerido',
            min: { value: 1, message: 'Mínimo semestre 1' },
            max: { value: 10, message: 'Máximo semestre 10' }
          })}
          type="number"
          placeholder="Semestre"
        />
      </FormField>

      <Button 
        type="submit" 
        variant="primary"
        disabled={loading}
      >
        {loading ? 'Agregando...' : 'Agregar Clase'}
      </Button>
    </form>
  );
};

export default ScheduleForm;