import { useState } from 'react';
import { scheduleService, CreateScheduleData } from '../../services/schedule/ScheduleService';

export const useScheduleActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSchedule = async (data: CreateScheduleData) => {
    setLoading(true);
    setError(null);
    try {
      await scheduleService.createScheduleEntry(data);
    } catch (err) {
      setError('Error al agregar la clase');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSchedule,
    loading,
    error
  };
};