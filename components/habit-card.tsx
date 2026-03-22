'use client';

import { Habit } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Flame, Target, Droplets, BookOpen, Dumbbell, Moon, Heart, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  target: Target,
  droplets: Droplets,
  book: BookOpen,
  dumbbell: Dumbbell,
  moon: Moon,
  heart: Heart,
  flame: Flame,
};

export function HabitCard({ habit, onToggle, onEdit, onDelete, showActions = false }: HabitCardProps) {
  const today = new Date().toDateString();
  const isCompletedToday = habit.completedDates.some(
    (date) => new Date(date).toDateString() === today
  );

  const Icon = iconMap[habit.icon] || Target;

  // Calculate weekly progress
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);
  
  const completedThisWeek = habit.completedDates.filter((date) => {
    const d = new Date(date);
    return d >= weekStart;
  }).length;
  
  const weeklyProgress = Math.round((completedThisWeek / 7) * 100);

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all hover:shadow-md',
      isCompletedToday && 'ring-2 ring-success/50'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isCompletedToday}
              onCheckedChange={() => onToggle(habit._id)}
              className="mt-0.5"
            />
            <div
              className="flex size-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: habit.color + '20' }}
            >
              <Icon className="size-5" style={{ color: habit.color }} />
            </div>
            <div>
              <h3 className={cn(
                'font-medium',
                isCompletedToday && 'line-through text-muted-foreground'
              )}>
                {habit.title}
              </h3>
              <p className="text-xs text-muted-foreground capitalize">
                {habit.frequency}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak Badge */}
            <div className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1">
              <Flame className="size-3.5 text-warning" />
              <span className="text-xs font-medium">{habit.streak}</span>
              {habit.maxStreak > 0 && (
                <span className="text-xs text-muted-foreground">/{habit.maxStreak}</span>
              )}
            </div>

            {showActions && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit?.(habit)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete?.(habit._id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Weekly Progress</span>
            <span className="font-medium">{weeklyProgress}%</span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
        </div>
        {/* Notes */}
        {habit.notes && (
          <div className="mt-3 rounded-md bg-muted/50 p-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {habit.notes}
            </p>
          </div>
        )}      </CardContent>
    </Card>
  );
}
