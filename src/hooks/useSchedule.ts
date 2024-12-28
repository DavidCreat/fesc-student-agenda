import { useState } from 'react';
import { useStore } from '../store/useStore';
import { validateScheduleTime } from '../utils/validation';
import type { ScheduleEntry } from '../models/types';

export const useSchedule = () => {
  const [error, setError] = useState<string | null>(null);
  const schedules = useStore((state) => state.schedules) || [];
  const { createSchedule } = useStore((state) => ({
    createSchedule: state.createSchedule
  }));

  const handleAddEntry = async (entry: Omit<ScheduleEntry, '_id'>) => {
    try {
      setError(null);

      if (!validateScheduleTime(entry.startTime, entry.endTime)) {
        throw new Error('La hora de inicio debe ser anterior a la hora de finalización');
      }

      // Check for schedule conflicts
      const hasConflict = schedules.some((existingEntry) => {
        return existingEntry.dayOfWeek === entry.dayOfWeek &&
          ((entry.startTime >= existingEntry.startTime && entry.startTime < existingEntry.endTime) ||
           (entry.endTime > existingEntry.startTime && entry.endTime <= existingEntry.endTime));
      });

      if (hasConflict) {
        throw new Error('Ya existe una clase programada en este horario');
      }

      await createSchedule(entry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar horario');
      throw err;
    }
  };

  return {
    error,
    handleAddEntry,
    schedules,
  };
};