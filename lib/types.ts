export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface Habit {
  _id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  maxStreak: number;
  notes: string;
  completedDates: string[];
  createdAt: string;
  color: string;
  icon: string;
}

export interface WeeklyAnalytics {
  date: string;
  fullDate: string;
  completed: number;
  total: number;
  percentage: number;
}
