import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ScheduleEntry, Task } from '../models/types.js';
import { api } from '../lib/api.js';
import { taskService } from '../services/task/TaskService';

interface CreateTaskData {
  title: string;
  description?: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface Store {
  user: User | null;
  isAuthenticated: boolean;
  schedules: ScheduleEntry[] | null;
  tasks: Task[];
  sessionStartTime: number | null;
  setUser: (user: User | null) => void;
  setSchedules: (schedules: ScheduleEntry[]) => void;
  setTasks: (tasks: Task[]) => void;
  loadTasks: () => Promise<void>;
  createTask: (task: CreateTaskData) => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createSchedule: (schedule: Omit<ScheduleEntry, '_id'>) => Promise<void>;
  startSession: () => void;
  endSession: () => void;
  createScheduleEntry: (data: ScheduleEntry) => Promise<void>;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      schedules: [],
      tasks: [],
      sessionStartTime: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSchedules: (schedules) => {
        console.log('Actualizando horarios en el store:', schedules);
        set({ schedules });
      },
      setTasks: (tasks) => set({ tasks }),
      startSession: () => set({ sessionStartTime: Date.now() }),
      endSession: () => set({ sessionStartTime: null }),
      loadTasks: async () => {
        try {
          const tasks = await taskService.getUserTasks();
          set({ tasks });
        } catch (error) {
          console.error('Error loading tasks:', error);
        }
      },
      createTask: async (task) => {
        try {
          const newTask = await taskService.createTask(task);
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        } catch (error) {
          console.error('Error creating task:', error);
          throw error;
        }
      },
      toggleTaskComplete: async (taskId) => {
        try {
          const task = await taskService.toggleTaskCompletion(taskId, true);
          set((state) => ({
            tasks: state.tasks.map(t => t._id === taskId ? task : t)
          }));
        } catch (error) {
          console.error('Error toggling task:', error);
          throw error;
        }
      },
      deleteTask: async (taskId) => {
        try {
          await taskService.deleteTask(taskId);
          set((state) => ({
            tasks: state.tasks.filter(t => t._id !== taskId)
          }));
        } catch (error) {
          console.error('Error deleting task:', error);
          throw error;
        }
      },
      createSchedule: async (schedule) => {
        const response = await api.post('/auth/schedule', schedule);
        set((state) => ({ 
          schedules: [...(state.schedules || []), response.data]
        }));
      },
      createScheduleEntry: async (data) => {
        try {
          const response = await api.post('/auth/schedule', data);
          set((state) => ({
            schedules: [...(state.schedules || []), response.data]
          }));
        } catch (error) {
          console.error('Error creating schedule entry:', error);
        }
      }
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);