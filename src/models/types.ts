export interface User {
  _id: string;
  fullName: string;
  email: string;
  career: string;
  semester: number;
  schedule: 'day' | 'night';
}

export interface ScheduleEntry {
  _id?: string;
  userId: string;
  subject: string;
  professor: string;
  room: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string; // formato "HH:mm"
  endTime: string; // formato "HH:mm"
  semester: number;
  career: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleEntryDTO {
  subject: string;
  professor: string;
  room: string;
  dayOfWeek: ScheduleEntry['dayOfWeek'];
  startTime: string;
  endTime: string;
  semester: number;
}

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  completed: boolean;
  dueDate: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface SessionLog {
  _id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  activity: string;
}

export interface Recommendation {
  title: string;
  type: string;
  url: string;
}

export type TaskFormData = Omit<Task, '_id' | 'userId' | 'createdAt'> & {
  completed: boolean;
};