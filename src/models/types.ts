export interface User {
  _id: string;
  email: string;
  fullName: string;
  career: string;
  semester: number;
  schedule: 'day' | 'night';
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleEntry {
  _id: string;
  userId: string;
  subject: string;
  professor: string;
  room: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
  semester: number;
  career: string;
}

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  subject: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export type TaskFormData = Omit<Task, '_id' | 'userId' | 'createdAt' | 'completed'>;

export interface SessionLog {
  _id: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number;
  subject: string;
  notes?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'article' | 'video' | 'course';
  url?: string;
  source: string;
  relevanceScore: number;
  tags: string[];
  career?: string;
  semester?: number;
  createdAt: string;
  updatedAt: string;
}