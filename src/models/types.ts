export interface User {
  _id: string;
  fullName: string;
  email: string;
  career: string;
  semester: number;
  schedule: 'day' | 'night';
}

export interface ScheduleEntry {
  _id: string;
  userId: string;
  subject: string;
  startTime: string;
  endTime: string;
  date: string;
  room?: string;
  professor?: string;
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