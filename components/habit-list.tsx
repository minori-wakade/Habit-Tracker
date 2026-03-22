'use client';

import { Habit } from '@/lib/types';
import { HabitCard } from '@/components/habit-card';
import { Empty } from '@/components/ui/empty';
import { Target } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export function HabitList({
  habits,
  onToggle,
  onEdit,
  onDelete,
  showActions = false,
  emptyMessage = 'No habits found. Create your first habit to get started!',
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <Empty
        icon={Target}
        title="No habits yet"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
