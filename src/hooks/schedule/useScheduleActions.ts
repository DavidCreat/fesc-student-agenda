import { useState } from 'react';
import  dashboardService  from '../../services/dashboard';
import { CreateScheduleEntryDTO, ScheduleEntry } from '../../models/types';

export const useScheduleActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSchedule = async (data: ScheduleEntry) => {
    setLoading(true);
    setError(null);
    try {
      await dashboardService.createScheduleEntry(data);
    } catch (err) {
      setError('Error al agregar la clase');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createSchedule, loading, error };
}; 