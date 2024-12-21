import { useState } from 'react';
import { useStore } from '../store/useStore';
import { validateScheduleTime } from '../utils/validation';
import type { ScheduleEntry } from '../models/types';

export const useSchedule = () => {
  const [error, setError] = useState<string | null>(null);
  const createScheduleEntry = useStore((state) => state.createScheduleEntry);
  const schedule = useStore((state) => state.schedule);

  const handleAddEntry = async (entry: Omit<ScheduleEntry, '_id'>) => {
    try {
      setError(null);

      if (!validateScheduleTime(entry.startTime, entry.endTime)) {
        throw new Error('La hora de inicio debe ser anterior a la hora de finalización');
      }

      // Check for schedule conflicts
      const hasConflict = schedule.some((existingEntry) => {
        return existingEntry.date === entry.date &&
          ((entry.startTime >= existingEntry.startTime && entry.startTime < existingEntry.endTime) ||
           (entry.endTime > existingEntry.startTime && entry.endTime <= existingEntry.endTime));
      });

      if (hasConflict) {
        throw new Error('Ya existe una clase programada en este horario');
      }

      await createScheduleEntry(entry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar horario');
      throw err;
    }
  };

  return {
    error,
    handleAddEntry,
    schedule,
  };
};