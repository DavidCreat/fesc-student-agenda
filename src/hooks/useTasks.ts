import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { TaskFormData } from '../models/types';

export const useTasks = () => {
  const [error, setError] = useState<string | null>(null);
  const createTask = useStore((state) => state.createTask);
  const toggleTaskComplete = useStore((state) => state.toggleTaskComplete);
  const tasks = useStore((state) => state.tasks);

  const handleAddTask = async (taskData: TaskFormData) => {
    try {
      setError(null);
      await createTask(taskData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar tarea');
      throw err;
    }
  };

  const handleToggleTask = (taskId: string) => {
    try {
      setError(null);
      toggleTaskComplete(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar tarea');
    }
  };

  return {
    error,
    tasks,
    handleAddTask,
    handleToggleTask,
  };
};