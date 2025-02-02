import api from './api/axios';
import { ScheduleEntry } from '../models/types';

export const fetchSchedule = async (userId: string): Promise<{ success: boolean; data: ScheduleEntry[] | null; message: string }> => {
  try {
    const response = await api.get(`/schedule/${userId}`);
    return {
      success: true,
      data: response.data,
      message: 'Schedule fetched successfully',
    };
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return {
      success: false,
      data: null,
      message: 'Error al obtener el horario',
    };
  }
};

export const createScheduleEntry = async (entry: Omit<ScheduleEntry, '_id'>): Promise<{ success: boolean; data: ScheduleEntry | null; message: string }> => {
  try {
    const response = await api.post('/schedule', entry);
    return {
      success: true,
      data: response.data,
      message: 'Schedule entry created successfully',
    };
  } catch (error) {
    console.error('Error creating schedule entry:', error);
    return {
      success: false,
      data: null,
      message: 'Error al crear la entrada del horario',
    };
  }
};