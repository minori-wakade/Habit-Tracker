'use client';

import { useState } from 'react';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';
import { Target, Flame, Brain, BarChart3 } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-6">
      <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-2">

        {/* Left Section */}
        <div className="flex flex-col justify-center space-y-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Target className="size-10 text-green-600" />
            <span className="text-3xl font-bold text-green-700">
              Habit Tracker
            </span>
          </div>

          {/* Title + Subtitle */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight text-green-800">
              Build Better Habits,
              <br />
              One Day at a Time
            </h1>

            <p className="max-w-md text-lg text-green-700">
              Track your habits, build streaks, and stay motivated with
              AI-powered insights that help you stay consistent.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <Flame className="mb-2 size-6 text-green-600" />
              <h3 className="font-semibold text-green-800">
                Build Streaks
              </h3>
              <p className="text-sm text-green-600">
                Stay consistent and grow powerful habit streaks.
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <Brain className="mb-2 size-6 text-green-600" />
              <h3 className="font-semibold text-green-800">
                AI Habit Coach
              </h3>
              <p className="text-sm text-green-600">
                Get smart suggestions to improve your routines.
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <BarChart3 className="mb-2 size-6 text-green-600" />
              <h3 className="font-semibold text-green-800">
                Track Progress
              </h3>
              <p className="text-sm text-green-600">
                Visualize your growth with clean analytics.
              </p>
            </div>

          </div>
        </div>

        {/* Right Section - Auth Forms */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

            {isLogin ? (
              <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
              <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            )}

            <p className="mt-6 text-center text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

