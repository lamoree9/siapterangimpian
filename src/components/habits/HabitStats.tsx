
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { HabitStats } from '@/types/habit';
import { Target, TrendingUp, Flame, Award } from 'lucide-react';

interface HabitStatsComponentProps {
  stats: HabitStats;
}

export const HabitStatsComponent = ({ stats }: HabitStatsComponentProps) => {
  const chartConfig = {
    completed: {
      label: "Selesai",
    },
    total: {
      label: "Total",
    },
  };

  const completionRate = stats.todayTotal > 0 ? (stats.todayCompleted / stats.todayTotal) * 100 : 0;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Statistik & Progress</h3>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="mx-auto h-6 w-6 mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{stats.totalHabits}</div>
            <p className="text-sm text-muted-foreground">Total Kebiasaan</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="mx-auto h-6 w-6 mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">
              {stats.todayCompleted}/{stats.todayTotal}
            </div>
            <p className="text-sm text-muted-foreground">Hari Ini</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="mx-auto h-6 w-6 mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">{stats.totalStreaks}</div>
            <p className="text-sm text-muted-foreground">Total Streak</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="mx-auto h-6 w-6 mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{completionRate.toFixed(0)}%</div>
            <p className="text-sm text-muted-foreground">Hari Ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-1 gap-6">
        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress Mingguan</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <BarChart data={stats.weeklyProgress}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('id-ID', { weekday: 'short' });
                  }}
                />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('id-ID', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short'
                    });
                  }}
                />
                <Bar dataKey="completed" fill="#22c55e" name="Selesai" />
                <Bar dataKey="total" fill="#e5e7eb" name="Total" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Streaks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Streak Kebiasaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.streaks.slice(0, 5).map((streak) => (
                <div key={streak.habitId} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{streak.habitName}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      🔥 {streak.currentStreak}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      📊 {streak.longestStreak} max
                    </Badge>
                  </div>
                </div>
              ))}
              {stats.streaks.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada data streak
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Consistency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Konsistensi (30 Hari)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.consistency
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 5)
                .map((item) => (
                <div key={item.habitId} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.habitName}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {item.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
              {stats.consistency.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada data konsistensi
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Consistent Habit */}
      {stats.mostConsistent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">🏆 Kebiasaan Paling Konsisten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <h4 className="font-semibold text-lg">{stats.mostConsistent.habitName}</h4>
              <p className="text-2xl font-bold text-green-600">
                {stats.mostConsistent.percentage.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                Tingkat konsistensi dalam 30 hari terakhir
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
