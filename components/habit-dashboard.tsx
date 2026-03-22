'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { DashboardView } from '@/components/views/dashboard-view';
import { HabitsView } from '@/components/views/habits-view';
import { AnalyticsView } from '@/components/views/analytics-view';
import { useAuth } from '@/components/auth-provider';
import { Habit, WeeklyAnalytics } from '@/lib/types';
import {
  fetchHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabit,
  fetchWeeklyAnalytics,
} from '@/lib/api';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

// Sample data for demo mode when backend is not available
const sampleHabits: Habit[] = [
  {
    _id: '1',
    title: 'Morning Meditation',
    frequency: 'daily',
    streak: 12,
    maxStreak: 15,
    notes: '10 minutes of mindfulness practice to start the day right',
    completedDates: [
      new Date().toISOString(),
      new Date(Date.now() - 86400000).toISOString(),
      new Date(Date.now() - 86400000 * 2).toISOString(),
    ],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    color: '#6366f1',
    icon: 'moon',
  },
  {
    _id: '2',
    title: 'Drink 8 Glasses of Water',
    frequency: 'daily',
    streak: 5,
    maxStreak: 12,
    notes: 'Stay hydrated throughout the day',
    completedDates: [
      new Date(Date.now() - 86400000).toISOString(),
      new Date(Date.now() - 86400000 * 2).toISOString(),
    ],
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    color: '#3b82f6',
    icon: 'droplets',
  },
  {
    _id: '3',
    title: 'Read for 30 Minutes',
    frequency: 'daily',
    streak: 8,
    maxStreak: 8,
    notes: 'Fiction or non-fiction, just read something!',
    completedDates: [
      new Date().toISOString(),
      new Date(Date.now() - 86400000).toISOString(),
    ],
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    color: '#22c55e',
    icon: 'book',
  },
  {
    _id: '4',
    title: 'Exercise',
    frequency: 'daily',
    streak: 3,
    maxStreak: 20,
    notes: 'Any form of physical activity - gym, walk, yoga, etc.',
    completedDates: [new Date(Date.now() - 86400000 * 2).toISOString()],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    color: '#f59e0b',
    icon: 'dumbbell',
  },
  {
    _id: '5',
    title: 'Weekly Review',
    frequency: 'weekly',
    streak: 4,
    maxStreak: 6,
    notes: 'Reflect on the week and plan for next week',
    completedDates: [new Date(Date.now() - 86400000 * 7).toISOString()],
    createdAt: new Date(Date.now() - 86400000 * 28).toISOString(),
    color: '#8b5cf6',
    icon: 'target',
  },
];

const generateSampleWeeklyData = (habits: Habit[]): WeeklyAnalytics[] => {
  const data: WeeklyAnalytics[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toDateString();

    let completed = 0;
    habits.forEach((habit) => {
      const isCompleted = habit.completedDates.some(
        (d) => new Date(d).toDateString() === dateStr
      );
      if (isCompleted) completed++;
    });

    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: date.toISOString(),
      completed,
      total: habits.length,
      percentage: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0,
    });
  }
  return data;
};

export function HabitDashboard() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [habits, setHabits] = useState<Habit[]>(sampleHabits);
  const [weeklyData, setWeeklyData] = useState<WeeklyAnalytics[]>(generateSampleWeeklyData(sampleHabits));
  const [isLoading, setIsLoading] = useState(true);
  const [useDemoMode, setUseDemoMode] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [habitsData, analyticsData] = await Promise.all([
        fetchHabits(),
        fetchWeeklyAnalytics(),
      ]);
      setHabits(habitsData);
      setWeeklyData(analyticsData);
      setUseDemoMode(false);
    } catch {
      // If backend is not available, use demo mode
      console.log('[v0] Backend not available, using demo mode');
      setUseDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update weekly data whenever habits change
  useEffect(() => {
    setWeeklyData(generateSampleWeeklyData(habits));
  }, [habits]);

  const handleToggle = async (id: string) => {
    try {
      if (useDemoMode) {
        setHabits((prev) =>
          prev.map((h) => {
            if (h._id === id) {
              const today = new Date().toDateString();
              const isCompleted = h.completedDates.some(
                (d) => new Date(d).toDateString() === today
              );
              const newCompletedDates = isCompleted
                ? h.completedDates.filter((d) => new Date(d).toDateString() !== today)
                : [...h.completedDates, new Date().toISOString()];
              return {
                ...h,
                completedDates: newCompletedDates,
                streak: isCompleted ? Math.max(0, h.streak - 1) : h.streak + 1,
              };
            }
            return h;
          })
        );
        toast.success('Habit updated!');
      } else {
        const updatedHabit = await toggleHabit(id);
        setHabits((prev) => prev.map((h) => (h._id === id ? updatedHabit : h)));
        toast.success('Habit updated!');
      }
    } catch {
      toast.error('Failed to update habit');
    }
  };

  const handleAdd = async (habit: Partial<Habit>) => {
    try {
      if (useDemoMode) {
        const newHabit: Habit = {
          _id: Date.now().toString(),
          title: habit.title || '',
          frequency: habit.frequency || 'daily',
          streak: 0,
          maxStreak: 0,
          notes: habit.notes || '',
          completedDates: [],
          createdAt: new Date().toISOString(),
          color: habit.color || '#6366f1',
          icon: habit.icon || 'target',
        };
        setHabits((prev) => [newHabit, ...prev]);
        toast.success('Habit created!');
      } else {
        const newHabit = await createHabit(habit);
        setHabits((prev) => [newHabit, ...prev]);
        toast.success('Habit created!');
      }
    } catch {
      toast.error('Failed to create habit');
    }
  };

  const handleEdit = async (id: string, habit: Partial<Habit>) => {
    try {
      if (useDemoMode) {
        setHabits((prev) =>
          prev.map((h) => (h._id === id ? { ...h, ...habit } : h))
        );
        toast.success('Habit updated!');
      } else {
        const updatedHabit = await updateHabit(id, habit);
        setHabits((prev) => prev.map((h) => (h._id === id ? updatedHabit : h)));
        toast.success('Habit updated!');
      }
    } catch {
      toast.error('Failed to update habit');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (useDemoMode) {
        setHabits((prev) => prev.filter((h) => h._id !== id));
        toast.success('Habit deleted!');
      } else {
        await deleteHabit(id);
        setHabits((prev) => prev.filter((h) => h._id !== id));
        toast.success('Habit deleted!');
      }
    } catch {
      toast.error('Failed to delete habit');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            {user && (
              <span className="text-sm text-muted-foreground">
                Welcome, <span className="font-medium text-foreground">{user.name}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {useDemoMode && (
              <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                Demo Mode
              </span>
            )}
            <ThemeToggle />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="size-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {activeView === 'dashboard' && (
            <DashboardView
              habits={habits}
              weeklyData={weeklyData}
              onToggle={handleToggle}
            />
          )}
          {activeView === 'habits' && (
            <HabitsView
              habits={habits}
              onToggle={handleToggle}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {activeView === 'analytics' && (
            <AnalyticsView habits={habits} weeklyData={weeklyData} />
          )}
        </main>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}
