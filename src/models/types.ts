export interface User {
  fullName: string;
  career: string;
  semester: number;
  schedule: 'day' | 'night';
  email: string;
}

export interface ScheduleEntry {
  id: string;
  day: string;
  subject: string;
  startTime: string;
  endTime: string;
}

export interface Task {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

export interface Recommendation {
  title: string;
  type: string;
  url: string;
}