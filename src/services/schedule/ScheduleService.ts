import api from '../api/axios';
import { ScheduleEntry } from '../../models/types';

export interface CreateScheduleData {
  subject: string;
  professor: string;
  room: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
  semester: number;
  career: string;
}

class ScheduleService {
  private baseURL = '/api/schedule';

  async createScheduleEntry(scheduleData: CreateScheduleData): Promise<ScheduleEntry> {
    try {
      console.log('Intentando crear horario con datos:', scheduleData);
      console.log('Token actual:', api.defaults.headers.common['Authorization']);
      const { data } = await api.post<ScheduleEntry>(this.baseURL, scheduleData);
      console.log('Respuesta del servidor:', data);
      return data;
    } catch (error: any) {
      console.error('Error detallado al crear horario:', {
        error,
        errorMessage: error.message,
        errorResponse: error.response?.data,
        requestData: scheduleData,
        endpoint: this.baseURL,
        headers: api.defaults.headers
      });
      throw error;
    }
  }

  async getUserSchedule(): Promise<ScheduleEntry[]> {
    try {
      console.log('Obteniendo horarios del usuario...');
      const { data } = await api.get<ScheduleEntry[]>(this.baseURL);
      console.log('Horarios obtenidos:', data);
      return data;
    } catch (error: any) {
      console.error('Error getting schedule:', {
        error,
        errorMessage: error.message,
        errorResponse: error.response?.data,
        endpoint: this.baseURL,
        headers: api.defaults.headers
      });
      throw error;
    }
  }

  async updateScheduleEntry(entryId: string, updates: Partial<CreateScheduleData>): Promise<ScheduleEntry> {
    try {
      console.log('Actualizando horario:', { entryId, updates });
      const { data } = await api.put<ScheduleEntry>(`${this.baseURL}/${entryId}`, updates);
      console.log('Horario actualizado:', data);
      return data;
    } catch (error: any) {
      console.error('Error updating schedule entry:', {
        error,
        errorMessage: error.message,
        errorResponse: error.response?.data,
        requestData: updates,
        endpoint: `${this.baseURL}/${entryId}`,
        headers: api.defaults.headers
      });
      throw error;
    }
  }

  async deleteScheduleEntry(entryId: string): Promise<void> {
    try {
      console.log('Eliminando horario:', entryId);
      await api.delete(`${this.baseURL}/${entryId}`);
      console.log('Horario eliminado exitosamente');
    } catch (error: any) {
      console.error('Error deleting schedule entry:', {
        error,
        errorMessage: error.message,
        errorResponse: error.response?.data,
        endpoint: `${this.baseURL}/${entryId}`,
        headers: api.defaults.headers
      });
      throw error;
    }
  }
}

export const scheduleService = new ScheduleService();
