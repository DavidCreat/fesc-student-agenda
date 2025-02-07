// src/services/dashboard.ts
import api from './api/axios';
import { Task, ScheduleEntry, SessionLog } from '../models/types';

class DashboardService {
  async getTasks(userId: string): Promise<Task[]> {
    const response = await api.get(`/tasks/${userId}`);
    return response.data;
  }

  async createTask(task: Omit<Task, '_id'>): Promise<Task> {
    const response = await api.post('/tasks', task);
    return response.data;
  }

  async updateTask(taskId: string, update: Partial<Task>): Promise<Task> {
    const response = await api.patch(`/tasks/${taskId}`, update);
    return response.data;
  }

  async deleteTask(taskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  }

  async getSchedule(userId: string): Promise<ScheduleEntry[]> {
    const response = await api.get(`/schedule/${userId}`);
    return response.data;
  }

  async createScheduleEntry(entry: Omit<ScheduleEntry, '_id'>): Promise<ScheduleEntry> {
    const response = await api.post('/schedule', entry);
    return response.data;
  }

  async updateScheduleEntry(entryId: string, update: Partial<ScheduleEntry>): Promise<ScheduleEntry> {
    const response = await api.patch(`/schedule/${entryId}`, update);
    return response.data;
  }

  async deleteScheduleEntry(entryId: string): Promise<void> {
    await api.delete(`/schedule/${entryId}`);
  }

  async getSessionLogs(userId: string): Promise<SessionLog[]> {
    const response = await api.get(`/session-logs/${userId}`);
    return response.data;
  }
}

export default new DashboardService();