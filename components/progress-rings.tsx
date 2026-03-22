'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit } from '@/lib/types';

interface ProgressRingsProps {
  habits: Habit[];
}

function ProgressRing({ progress, size = 80, strokeWidth = 8, color }: { 
  progress: number; 
  size?: number; 
  strokeWidth?: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/30"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
    </svg>
  );
}

export function ProgressRings({ habits }: ProgressRingsProps) {
  // Get top 4 habits by streak
  const topHabits = [...habits]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 4);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Habit Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {topHabits.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No habits yet. Add some habits to track your progress!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {topHabits.map((habit) => {
              const completedThisWeek = habit.completedDates.filter((date) => {
                const d = new Date(date);
                return d >= weekStart;
              }).length;
              const weeklyProgress = Math.round((completedThisWeek / 7) * 100);

              return (
                <div key={habit._id} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <ProgressRing progress={weeklyProgress} color={habit.color} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold">{weeklyProgress}%</span>
                    </div>
                  </div>
                  <span className="text-center text-xs text-muted-foreground line-clamp-1">
                    {habit.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
