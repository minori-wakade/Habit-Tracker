'use client';

import { Habit, WeeklyAnalytics } from '@/lib/types';
import { SummaryCards } from '@/components/summary-cards';
import { HabitCard } from '@/components/habit-card';
import { WeeklyChart } from '@/components/weekly-chart';
import { ProgressRings } from '@/components/progress-rings';
import { HabitCalendar } from '@/components/habit-calendar';

interface DashboardViewProps {
  habits: Habit[];
  weeklyData: WeeklyAnalytics[];
  onToggle: (id: string) => void;
}

export function DashboardView({ habits, weeklyData, onToggle }: DashboardViewProps) {
  // Get daily habits
  const dailyHabits = habits.filter((h) => h.frequency === 'daily');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Track your daily habits and progress</p>
      </div>

      <SummaryCards habits={habits} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Habits */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">{"Today's Habits"}</h2>
          {dailyHabits.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                No daily habits yet. Add some habits to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {dailyHabits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  onToggle={onToggle}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="flex flex-col gap-6">
          <ProgressRings habits={habits} />
          <WeeklyChart data={weeklyData} />
        </div>
      </div>

      {/* Calendar Overview */}
      {habits.length > 0 && (
        <div className="mt-2">
          <h2 className="mb-4 text-lg font-semibold">Monthly Overview</h2>
          <HabitCalendar habits={habits} />
        </div>
      )}
    </div>
  );
}
