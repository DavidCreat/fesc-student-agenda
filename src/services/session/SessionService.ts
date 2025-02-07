import api from '../api/axios';

export interface SessionLogData {
  startTime: Date;
  endTime: Date;
  duration: number;
  activity: string;
}

class SessionService {
  private baseURL = '/api/sessions';

  async createSessionLog(sessionData: SessionLogData) {
    try {
      const { data } = await api.post(this.baseURL, sessionData);
      return data;
    } catch (error) {
      console.error('Error creating session log:', error);
      throw error;
    }
  }

  async getUserSessions() {
    try {
      const { data } = await api.get(this.baseURL);
      return data;
    } catch (error) {
      console.error('Error getting user sessions:', error);
      throw error;
    }
  }
}

export const sessionService = new SessionService();
