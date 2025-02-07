import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ScheduleEntry, Task, TaskFormData } from '../models/types';
import { api } from '../lib/api';

interface Store {
  user: User | null;
  schedules: ScheduleEntry[] | null;
  tasks: Task[];
  sessionStartTime: number | null;
  setUser: (user: User | null) => void;
  setSchedules: (schedules: ScheduleEntry[]) => void;
  setTasks: (tasks: Task[]) => void;
  createTask: (task: TaskFormData) => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  createSchedule: (schedule: Omit<ScheduleEntry, '_id'>) => Promise<void>;
  startSession: () => void;
  endSession: () => void;
  createScheduleEntry: (data: ScheduleEntry) => Promise<void>;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      schedules: [],
      tasks: [],
      sessionStartTime: null,
      setUser: (user) => set({ user }),
      setSchedules: (schedules) => set({ schedules }),
      setTasks: (tasks) => set({ tasks }),
      startSession: () => set({ sessionStartTime: Date.now() }),
      endSession: () => set({ sessionStartTime: null }),
      createTask: async (task) => {
        const response = await api.post('/auth/tasks', task);
        set((state) => ({ tasks: [...state.tasks, response.data] }));
      },
      toggleTaskComplete: async (taskId) => {
        const response = await api.put(`/auth/tasks/${taskId}/toggle`);
        set((state) => ({
          tasks: state.tasks.map(task => 
            task._id === taskId ? response.data : task
          )
        }));
      },
      createSchedule: async (schedule) => {
        const response = await api.post('/auth/schedule', schedule);
        set((state) => ({ 
          schedules: [...(state.schedules || []), response.data]
        }));
      },
      createScheduleEntry: async (data) => {
        // Implementa la lógica para crear una entrada de horario aquí
        console.log('Creating schedule entry:', data);
        // Ejemplo: await api.createSchedule(data);
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ user: state.user, sessionStartTime: state.sessionStartTime })
    }
  )
);