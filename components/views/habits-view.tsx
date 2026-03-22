'use client';

import { useState } from 'react';
import { Habit } from '@/lib/types';
import { HabitList } from '@/components/habit-list';
import { HabitCalendar } from '@/components/habit-calendar';
import { AddHabitDialog } from '@/components/add-habit-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HabitsViewProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onAdd: (habit: Partial<Habit>) => void;
  onEdit: (id: string, habit: Partial<Habit>) => void;
  onDelete: (id: string) => void;
}

export function HabitsView({ habits, onToggle, onAdd, onEdit, onDelete }: HabitsViewProps) {
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCalendarHabit, setSelectedCalendarHabit] = useState<string>('all');

  const dailyHabits = habits.filter((h) => h.frequency === 'daily');
  const weeklyHabits = habits.filter((h) => h.frequency === 'weekly');
  const calendarHabit = selectedCalendarHabit === 'all' ? null : habits.find((h) => h._id === selectedCalendarHabit);

  const handleDelete = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Habits</h1>
          <p className="text-muted-foreground">Manage and track all your habits</p>
        </div>
        <AddHabitDialog onAdd={onAdd} />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({habits.length})</TabsTrigger>
          <TabsTrigger value="daily">Daily ({dailyHabits.length})</TabsTrigger>
          <TabsTrigger value="weekly">Weekly ({weeklyHabits.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <HabitList
            habits={habits}
            onToggle={onToggle}
            onEdit={setEditingHabit}
            onDelete={setDeletingId}
            showActions
            emptyMessage="No habits yet. Click 'Add Habit' to create your first one!"
          />
        </TabsContent>

        <TabsContent value="daily" className="mt-4">
          <HabitList
            habits={dailyHabits}
            onToggle={onToggle}
            onEdit={setEditingHabit}
            onDelete={setDeletingId}
            showActions
            emptyMessage="No daily habits yet. Add some to track your daily routines!"
          />
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <HabitList
            habits={weeklyHabits}
            onToggle={onToggle}
            onEdit={setEditingHabit}
            onDelete={setDeletingId}
            showActions
            emptyMessage="No weekly habits yet. Add some to track your weekly goals!"
          />
        </TabsContent>
      </Tabs>

      {/* Habit Calendar Section */}
      {habits.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Completion Calendar</h2>
            <Select value={selectedCalendarHabit} onValueChange={setSelectedCalendarHabit}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select habit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Habits</SelectItem>
                {habits.map((habit) => (
                  <SelectItem key={habit._id} value={habit._id}>
                    {habit.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <HabitCalendar habits={habits} selectedHabit={calendarHabit} />
        </div>
      )}

      {/* Edit Dialog */}
      <AddHabitDialog
        onAdd={onAdd}
        editHabit={editingHabit}
        onEdit={onEdit}
        open={!!editingHabit}
        onOpenChange={(open) => !open && setEditingHabit(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this habit? This action cannot be undone
              and all progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
