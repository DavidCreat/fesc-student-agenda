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
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'; // Ensure this matches
  startTime: string;
  endTime: string;
  semester: number;
  userId?: string; // Optional for creation
  career?: string; // Add this if needed
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
  startTime: string; // or Date
  duration: number; // in minutes
  // Add any other relevant fields
}

export interface Recommendation {
  title: string;
  type: string;
  url: string;
}

export type TaskFormData = Omit<Task, '_id' | 'userId' | 'createdAt'> & {
  completed: boolean;
};