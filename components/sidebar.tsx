'use client';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Menu,
  X,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'habits', label: 'My Habits', icon: ListTodo },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Flame className="size-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            Habit Tracker
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onViewChange(item.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-primary'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                    )}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent p-4">
            <p className="text-sm font-medium text-sidebar-foreground">
              Stay consistent!
            </p>
            <p className="mt-1 text-xs text-sidebar-foreground/60">
              Complete your habits daily to build streaks.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
