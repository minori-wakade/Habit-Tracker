import { Habit, WeeklyAnalytics, User } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://habit-tracker-server-urol.onrender.com';

// Helper to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Auth API
export async function registerUser(name: string, email: string, password: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }
  return res.json();
}

export async function loginUser(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
}

export async function getCurrentUser(): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

// Habits API
export async function fetchHabits(): Promise<Habit[]> {
  const res = await fetch(`${API_URL}/habits`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch habits');
  return res.json();
}

export async function createHabit(habit: Partial<Habit>): Promise<Habit> {
  const res = await fetch(`${API_URL}/habits`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(habit),
  });
  if (!res.ok) throw new Error('Failed to create habit');
  return res.json();
}

export async function updateHabit(id: string, habit: Partial<Habit>): Promise<Habit> {
  const res = await fetch(`${API_URL}/habits/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(habit),
  });
  if (!res.ok) throw new Error('Failed to update habit');
  return res.json();
}

export async function deleteHabit(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/habits/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete habit');
}

export async function toggleHabit(id: string): Promise<Habit> {
  const res = await fetch(`${API_URL}/habits/${id}/toggle`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to toggle habit');
  return res.json();
}

export async function fetchWeeklyAnalytics(): Promise<WeeklyAnalytics[]> {
  const res = await fetch(`${API_URL}/habits/analytics/weekly`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}
