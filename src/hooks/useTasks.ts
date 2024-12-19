import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Task } from '../models/types';

export const useTasks = () => {
  const [error, setError] = useState<string | null>(null);
  const addTask = useStore((state) => state.addTask);
  const toggleTaskComplete = useStore((state) => state.toggleTaskComplete);
  const tasks = useStore((state) => state.tasks);

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'completed'>) => {
    try {
      setError(null);

      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        completed: false,
      };

      addTask(newTask);
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