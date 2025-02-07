import api from './api/axios';
import { Task } from '../models/types';

export const fetchTasks = async (userId: string): Promise<{ success: boolean; data: Task[] | null; message: string }> => {
  try {
    const response = await api.get(`/tasks/${userId}`);
    return {
      success: true,
      data: response.data,
      message: 'Tasks fetched successfully',
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      success: false,
      data: null,
      message: 'Error al obtener las tareas',
    };
  }
};

export const createTask = async (task: Omit<Task, '_id'>): Promise<{ success: boolean; data: Task | null; message: string }> => {
  try {
    const response = await api.post('/tasks', task);
    return {
      success: true,
      data: response.data,
      message: 'Task created successfully',
    };
  } catch (error) {
    console.error('Error creating task:', error);
    return {
      success: false,
      data: null,
      message: 'Error al crear la tarea',
    };
  }
};

// Add update and delete methods similarly with the same response format 