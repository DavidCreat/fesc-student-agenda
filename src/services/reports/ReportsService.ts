import { api } from '../api';

export interface ReportData {
  sessions: {
    totalSessions: number;
    lastSession: Date;
    averageSessionDuration: number;
  };
  tasks: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
  schedule: {
    totalClasses: number;
    classesPerDay: Record<string, number>;
    mostFrequentRoom: string;
  };
}

class ReportsService {
  private baseURL = '/reports';

  async getReports(): Promise<ReportData> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No autorizado');
      }

      console.log('Obteniendo reportes...');
      console.log('URL:', this.baseURL);
      console.log('Token:', token ? 'Presente' : 'No encontrado');
      
      const { data } = await api.get<ReportData>(this.baseURL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Reportes obtenidos:', data);
      return data;
    } catch (error: any) {
      console.error('Error getting reports:', {
        error,
        errorMessage: error.message,
        errorResponse: error.response?.data,
        endpoint: this.baseURL
      });
      throw new Error(error.response?.data?.message || 'Error al obtener los reportes');
    }
  }
}

export const reportsService = new ReportsService();
