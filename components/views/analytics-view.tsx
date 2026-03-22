'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit, WeeklyAnalytics } from '@/lib/types';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface AnalyticsViewProps {
  habits: Habit[];
  weeklyData: WeeklyAnalytics[];
}

export function AnalyticsView({ habits, weeklyData }: AnalyticsViewProps) {
  // Calculate statistics
  const today = new Date().toDateString();
  const completedToday = habits.filter((h) =>
    h.completedDates.some((d) => new Date(d).toDateString() === today)
  ).length;

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const avgStreak = habits.length > 0 ? Math.round(totalStreak / habits.length) : 0;

  // Habits by frequency
  const frequencyData = [
    { name: 'Daily', value: habits.filter((h) => h.frequency === 'daily').length },
    { name: 'Weekly', value: habits.filter((h) => h.frequency === 'weekly').length },
  ];

  // Streak distribution
  const streakRanges = [
    { range: '0', count: habits.filter((h) => h.streak === 0).length },
    { range: '1-3', count: habits.filter((h) => h.streak >= 1 && h.streak <= 3).length },
    { range: '4-7', count: habits.filter((h) => h.streak >= 4 && h.streak <= 7).length },
    { range: '8-14', count: habits.filter((h) => h.streak >= 8 && h.streak <= 14).length },
    { range: '15-30', count: habits.filter((h) => h.streak >= 15 && h.streak <= 30).length },
    { range: '30+', count: habits.filter((h) => h.streak > 30).length },
  ];

  const colors = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)'];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Insights into your habit tracking journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Habits</p>
            <p className="mt-1 text-3xl font-bold">{habits.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed Today</p>
            <p className="mt-1 text-3xl font-bold">{completedToday}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Streak Days</p>
            <p className="mt-1 text-3xl font-bold">{totalStreak}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Average Streak</p>
            <p className="mt-1 text-3xl font-bold">{avgStreak}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Completion Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-card p-2 shadow-sm">
                            <p className="text-sm font-medium">{payload[0].value}% completion</p>
                            <p className="text-xs text-muted-foreground">
                              {payload[0].payload.completed}/{payload[0].payload.total} habits
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-primary)', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Streak Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Streak Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={streakRanges}>
                  <XAxis dataKey="range" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-card p-2 shadow-sm">
                            <p className="text-sm font-medium">{payload[0].value} habits</p>
                            <p className="text-xs text-muted-foreground">
                              {payload[0].payload.range} day streak
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Habits by Frequency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Habits by Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={frequencyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {frequencyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Habits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performing Habits</CardTitle>
          </CardHeader>
          <CardContent>
            {habits.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No habits to display
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {[...habits]
                  .sort((a, b) => b.streak - a.streak)
                  .slice(0, 5)
                  .map((habit, index) => (
                    <div key={habit._id} className="flex items-center gap-3">
                      <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{habit.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {habit.streak} day streak
                        </p>
                      </div>
                      <div
                        className="h-2 w-16 rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${habit.color} ${Math.min(habit.streak * 3, 100)}%, var(--muted) ${Math.min(habit.streak * 3, 100)}%)`,
                        }}
                      />
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
