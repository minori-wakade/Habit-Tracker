'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface HabitCalendarProps {
  habits: Habit[];
  selectedHabit?: Habit | null;
}

export function HabitCalendar({ habits, selectedHabit }: HabitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { daysInMonth, firstDayOfMonth, monthName, year } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
    return { daysInMonth, firstDayOfMonth, monthName, year };
  }, [currentDate]);

  // Get all completed dates from all habits or selected habit
  const completedDatesMap = useMemo(() => {
    const map = new Map<string, { count: number; habits: string[] }>();
    const habitsToCheck = selectedHabit ? [selectedHabit] : habits;

    habitsToCheck.forEach((habit) => {
      habit.completedDates.forEach((dateStr) => {
        const date = new Date(dateStr);
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        const existing = map.get(key) || { count: 0, habits: [] };
        existing.count++;
        existing.habits.push(habit.title);
        map.set(key, existing);
      });
    });

    return map;
  }, [habits, selectedHabit]);

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = [];
  const totalHabits = selectedHabit ? 1 : habits.length;

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${currentDate.getMonth()}-${day}`;
    const completionData = completedDatesMap.get(key);
    const completionCount = completionData?.count || 0;
    const isToday =
      new Date().getDate() === day &&
      new Date().getMonth() === currentDate.getMonth() &&
      new Date().getFullYear() === year;

    // Calculate intensity based on completion ratio
    let intensityClass = '';
    if (completionCount > 0 && totalHabits > 0) {
      const ratio = completionCount / totalHabits;
      if (ratio >= 0.8) {
        intensityClass = 'bg-success text-success-foreground';
      } else if (ratio >= 0.5) {
        intensityClass = 'bg-success/70 text-success-foreground';
      } else if (ratio >= 0.25) {
        intensityClass = 'bg-success/40 text-foreground';
      } else {
        intensityClass = 'bg-success/20 text-foreground';
      }
    }

    days.push(
      <div
        key={day}
        className={cn(
          'flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-colors',
          intensityClass,
          isToday && !completionCount && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
          isToday && completionCount > 0 && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
          !completionCount && !isToday && 'text-muted-foreground hover:bg-muted'
        )}
        title={
          completionData
            ? `${completionCount} habit${completionCount > 1 ? 's' : ''} completed: ${completionData.habits.join(', ')}`
            : undefined
        }
      >
        {day}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {selectedHabit ? `${selectedHabit.title} Calendar` : 'Habit Calendar'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {monthName} {year}
        </p>
      </CardHeader>
      <CardContent>
        {/* Day headers */}
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">{days}</div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="size-3 rounded bg-success/20" />
            <span>Some</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-3 rounded bg-success/50" />
            <span>Half</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-3 rounded bg-success" />
            <span>All</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
