// src/services/dashboard.ts
import axios from 'axios';
import type { Task, ScheduleEntry, SessionLog } from '../models/types';

class DashboardService {
  private api = axios.create({
    baseURL: import.meta.env.DEV ? '/api' : '/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setAuthHeader(token);
    }
  }

  private setAuthHeader(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    const response = await this.api.get(`/tasks/user/${userId}`);
    return response.data;
  }

  async createTask(task: Omit<Task, '_id'>): Promise<Task> {
    const response = await this.api.post('/tasks', task);
    return response.data;
  }

  async updateTask(taskId: string, update: Partial<Task>): Promise<Task> {
    const response = await this.api.put(`/tasks/${taskId}`, update);
    return response.data;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.api.delete(`/tasks/${taskId}`);
  }

  // Schedule Entries
  async getSchedule(userId: string): Promise<ScheduleEntry[]> {
    const response = await this.api.get(`/schedule/user/${userId}`);
    return response.data;
  }

  async createScheduleEntry(entry: Omit<ScheduleEntry, '_id'>): Promise<ScheduleEntry> {
    const response = await this.api.post('/schedule', entry);
    return response.data;
  }

  // Session Logs
  async createSessionLog(log: Omit<SessionLog, '_id'>): Promise<SessionLog> {
    const response = await this.api.post('/sessions', log);
    return response.data;
  }
}

export const dashboardService = new DashboardService();