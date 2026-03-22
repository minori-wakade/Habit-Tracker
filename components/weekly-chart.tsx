'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeeklyAnalytics } from '@/lib/types';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface WeeklyChartProps {
  data: WeeklyAnalytics[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Weekly Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="date"
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-card p-2 shadow-sm">
                        <p className="text-sm font-medium">
                          {payload[0].payload.completed}/{payload[0].payload.total} completed
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payload[0]?.value}% completion
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="percentage"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
