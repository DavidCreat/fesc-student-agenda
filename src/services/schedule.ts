import { api } from '../lib/api';
import { ScheduleEntry, CreateScheduleEntryDTO } from '../models/types';

class ScheduleService {
  private static instance: ScheduleService;

  private constructor() {}

  static getInstance(): ScheduleService {
    if (!ScheduleService.instance) {
      ScheduleService.instance = new ScheduleService();
    }
    return ScheduleService.instance;
  }

  async createSchedule(data: CreateScheduleEntryDTO): Promise<{ schedule: ScheduleEntry }> {
    try {
      const response = await api.post('/auth/schedule', data);
      return { schedule: response.data };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Error al crear clase');
    }
  }

  async getSchedule(): Promise<{ schedules: ScheduleEntry[] }> {
    try {
      const response = await api.get('/auth/schedule');
      return { schedules: response.data };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Error al obtener horario');
    }
  }
}

export const scheduleService = ScheduleService.getInstance(); 