import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export const TaskForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>();
  const { user, createTask } = useStore();

  const onSubmit = async (data: TaskFormData) => {
    if (!user?._id) return;
    
    try {
      await createTask({
        title: data.title,
        description: data.description,
        subject: data.subject,
        dueDate: data.dueDate,
        priority: data.priority,
        completed: false
      });
      reset();
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
          <label className="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
          <input
            type="date"
            {...register('dueDate', { required: 'La fecha de entrega es requerida' })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          {errors.dueDate && <span className="text-red-500 text-sm">{errors.dueDate.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prioridad</label>
          <select
            {...register('priority')}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
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