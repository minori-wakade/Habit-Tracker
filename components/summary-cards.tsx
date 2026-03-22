'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Habit } from '@/lib/types';
import { CheckCircle2, Flame, Target, TrendingUp } from 'lucide-react';

interface SummaryCardsProps {
  habits: Habit[];
}

export function SummaryCards({ habits }: SummaryCardsProps) {
  const today = new Date().toDateString();
  
  const completedToday = habits.filter((habit) =>
    habit.completedDates.some((date) => new Date(date).toDateString() === today)
  ).length;
  
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
  const longestStreak = Math.max(...habits.map((habit) => habit.maxStreak), 0);

  const cards = [
    {
      title: "Today's Progress",
      value: `${completedToday}/${totalHabits}`,
      subtitle: 'habits completed',
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      subtitle: 'for today',
      icon: TrendingUp,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      title: 'Total Streaks',
      value: totalStreak.toString(),
      subtitle: 'across all habits',
      icon: Flame,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Best Streak',
      value: longestStreak.toString(),
      subtitle: 'personal record',
      icon: Target,
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="mt-1 text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </div>
                <div className={`flex size-12 items-center justify-center rounded-full ${card.bgColor}`}>
                  <Icon className={`size-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
