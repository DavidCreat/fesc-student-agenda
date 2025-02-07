import { api } from '../api';

export interface DashboardData {
  tasks: {
    _id: string;
    userId: string;
    title: string;
    description: string;
    subject: string;
    completed: boolean;
    dueDate: string;
    createdAt: string;
  }[];
  schedule: {
    _id: string;
    userId: string;
    subject: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room: string;
    professor: string;
    semester: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

class DashboardService {
  async getDashboardData(): Promise<DashboardData> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No autorizado');
      }

      console.log('Obteniendo datos del dashboard...');
      
      const [tasksRes, scheduleRes] = await Promise.all([
        api.get('/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get('/schedule', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      return {
        tasks: tasksRes.data,
        schedule: scheduleRes.data
      };
    } catch (error: any) {
      console.error('Error getting dashboard data:', {
        error,
        errorMessage: error.message,
        errorResponse: error.response?.data
      });
      throw new Error(error.response?.data?.message || 'Error al obtener los datos del dashboard');
    }
  }
}

export const dashboardService = new DashboardService();
