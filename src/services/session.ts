import api from './api/axios';
import { SessionLog } from '../models/types';

export const fetchSessionLogs = async (userId: string): Promise<{ success: boolean; data: SessionLog[]; message: string }> => {
  try {
    const response = await api.get(`/session-logs/${userId}`);
    return {
      success: true,
      data: response.data,
      message: 'Session logs fetched successfully',
    };
  } catch (error) {
    console.error('Error fetching session logs:', error);
    return {
      success: false,
      data: [],
      message: 'Error al obtener los registros de sesión',
    };
  }
};

// Add any other session-related methods as needed with the same response format 