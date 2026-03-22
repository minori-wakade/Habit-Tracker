'use client';

import { useAuth } from '@/components/auth-provider';
import { HabitDashboard } from '@/components/habit-dashboard';
import { AuthPage } from '@/components/auth/auth-page';
import { Spinner } from '@/components/ui/spinner';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-8" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <HabitDashboard />;
}
