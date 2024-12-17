import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ScheduleEntry, Task } from '../models/types';

interface Store {
  user: User | null;
  schedule: ScheduleEntry[];
  tasks: Task[];
  sessionStartTime: number | null;
  setUser: (user: User | null) => void;
  addScheduleEntry: (entry: ScheduleEntry) => void;
  addTask: (task: Task) => void;
  toggleTaskComplete: (taskId: string) => void;
  startSession: () => void;
  endSession: () => void;
  getSessionDuration: () => number;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      schedule: [],
      tasks: [],
      sessionStartTime: null,
      setUser: (user) => set({ user }),
      addScheduleEntry: (entry) => 
        set((state) => ({ schedule: [...state.schedule, entry] })),
      addTask: (task) => 
        set((state) => ({ tasks: [...state.tasks, task] })),
      toggleTaskComplete: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        })),
      startSession: () => set({ sessionStartTime: Date.now() }),
      endSession: () => set({ sessionStartTime: null }),
      getSessionDuration: () => {
        const { sessionStartTime } = get();
        return sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000 / 60) : 0;
      },
    }),
    {
      name: 'fesc-storage',
    }
  )
);