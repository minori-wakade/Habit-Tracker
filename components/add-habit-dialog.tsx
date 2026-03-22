'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Target, Droplets, BookOpen, Dumbbell, Moon, Heart, Flame } from 'lucide-react';
import { Habit } from '@/lib/types';

interface AddHabitDialogProps {
  onAdd: (habit: Partial<Habit>) => void;
  editHabit?: Habit | null;
  onEdit?: (id: string, habit: Partial<Habit>) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const icons = [
  { id: 'target', icon: Target, label: 'Target' },
  { id: 'droplets', icon: Droplets, label: 'Water' },
  { id: 'book', icon: BookOpen, label: 'Reading' },
  { id: 'dumbbell', icon: Dumbbell, label: 'Exercise' },
  { id: 'moon', icon: Moon, label: 'Sleep' },
  { id: 'heart', icon: Heart, label: 'Health' },
  { id: 'flame', icon: Flame, label: 'Streak' },
];

const colors = [
  '#6366f1', // Indigo
  '#22c55e', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#14b8a6', // Teal
];

export function AddHabitDialog({ onAdd, editHabit, onEdit, open, onOpenChange }: AddHabitDialogProps) {
  const [title, setTitle] = useState(editHabit?.title || '');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(editHabit?.frequency || 'daily');
  const [notes, setNotes] = useState(editHabit?.notes || '');
  const [selectedIcon, setSelectedIcon] = useState(editHabit?.icon || 'target');
  const [selectedColor, setSelectedColor] = useState(editHabit?.color || colors[0]);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const habitData = {
      title: title.trim(),
      frequency,
      notes: notes.trim(),
      icon: selectedIcon,
      color: selectedColor,
    };

    if (editHabit && onEdit) {
      onEdit(editHabit._id, habitData);
    } else {
      onAdd(habitData);
    }

    setTitle('');
    setFrequency('daily');
    setNotes('');
    setSelectedIcon('target');
    setSelectedColor(colors[0]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="size-4" />
            Add Habit
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editHabit ? 'Edit Habit' : 'Add New Habit'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Habit Name</Label>
            <Input
              id="title"
              placeholder="e.g., Drink 8 glasses of water"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as 'daily' | 'weekly')}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or reminders..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {icons.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIcon(item.id)}
                    className={`flex size-10 items-center justify-center rounded-lg border transition-colors ${
                      selectedIcon === item.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <Icon className="size-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`size-8 rounded-full transition-transform ${
                    selectedColor === color ? 'scale-110 ring-2 ring-offset-2 ring-offset-background' : ''
                  }`}
                  style={{ backgroundColor: color, ringColor: color }}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="mt-2">
            {editHabit ? 'Save Changes' : 'Add Habit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
