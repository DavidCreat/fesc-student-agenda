import api from '../api/axios';
import { Task } from '../../models/types';

interface CreateTaskData {
  title: string;
  description?: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface UpdateTaskData extends Partial<CreateTaskData> {
  completed?: boolean;
}

class TaskService {
  private baseURL = '/api/tasks';

  async createTask(taskData: CreateTaskData): Promise<Task> {
    try {
      const { data } = await api.post<Task>(this.baseURL, taskData);
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async getUserTasks(): Promise<Task[]> {
    try {
      const { data } = await api.get<Task[]>(this.baseURL);
      return data;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, updates: UpdateTaskData): Promise<Task> {
    try {
      const { data } = await api.put<Task>(`${this.baseURL}/${taskId}`, updates);
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await api.delete(`${this.baseURL}/${taskId}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async toggleTaskCompletion(taskId: string, completed: boolean): Promise<Task> {
    return this.updateTask(taskId, { completed });
  }
}

export const taskService = new TaskService();
