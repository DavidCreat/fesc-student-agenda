import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth';
import { dashboardService } from '../services/dashboard';
import type { User, Task, ScheduleEntry } from '../models/types';

interface AppState {
  user: User | null;
  tasks: Task[];
  schedule: ScheduleEntry[];
  setUser: (user: User | null) => void;
  createTask: (task: Omit<Task, '_id'>) => Promise<void>;
  createScheduleEntry: (entry: Omit<ScheduleEntry, '_id'>) => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      tasks: [],
      schedule: [],

      setUser: (user) => set({ user }),

      initialize: async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const user = await authService.getCurrentUser();
            if (user) {
              set({ user });
              // Cargar tareas y horario del usuario
              const tasks = await dashboardService.getTasks(user._id);
              const schedule = await dashboardService.getSchedule(user._id);
              set({ tasks, schedule });
            }
          }
        } catch (error) {
          console.error('Error initializing store:', error);
          localStorage.removeItem('token');
          set({ user: null, tasks: [], schedule: [] });
        }
      },

      createTask: async (task) => {
        try {
          const newTask = await dashboardService.createTask(task);
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        } catch (error) {
          console.error('Error creating task:', error);
        }
      },

      createScheduleEntry: async (entry) => {
        try {
          const newEntry = await dashboardService.createScheduleEntry(entry);
          set((state) => ({ schedule: [...state.schedule, newEntry] }));
        } catch (error) {
          console.error('Error creating schedule entry:', error);
        }
      },

      toggleTaskComplete: async (taskId) => {
        try {
          const task = get().tasks.find((t) => t._id === taskId);
          if (task) {
            const updatedTask = await dashboardService.updateTask(taskId, {
              completed: !task.completed
            });
            set((state) => ({
              tasks: state.tasks.map((t) => 
                t._id === taskId ? updatedTask : t
              )
            }));
          }
        } catch (error) {
          console.error('Error toggling task:', error);
        }
      }
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);