import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { scheduleService } from '../../services/schedule';
import { CreateScheduleEntryDTO } from '../../models/types';

export const useScheduleActions = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const user = useStore((state) => state.user);
  const setSchedules = useStore((state) => state.setSchedules);

  const handleCreateSchedule = async (data: CreateScheduleEntryDTO) => {
    try {
      setError(null);
      setLoading(true);
      
      if (!user?._id) throw new Error('Usuario no autenticado');

      const scheduleData = {
        ...data,
        userId: user._id,
      };

      const response = await scheduleService.createSchedule(scheduleData);
      const currentSchedules = useStore.getState().schedules || [];
      setSchedules([...currentSchedules, response.schedule]);
      
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear clase';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSchedule = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await scheduleService.getSchedule();
      if (response.schedules) {
        setSchedules(response.schedules);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener horario';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createSchedule: handleCreateSchedule,
    getSchedule: handleGetSchedule,
    loading,
    error
  };
}; 