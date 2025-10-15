import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { GratitudeStats } from '@/types/gratitude';
import { Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface GratitudeStatsComponentProps {
  stats: GratitudeStats;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
}

const MOOD_COLORS: Record<string, string> = {
  senang: '#22c55e',
  tenang: '#3b82f6',
  bersemangat: '#f59e0b',
  syukur: '#8b5cf6',
  cemas: '#ef4444',
  lelah: '#6b7280',
  sedih: '#06b6d4',
  marah: '#dc2626',
  bingung: '#f97316',
  optimis: '#10b981'
};

export const GratitudeStatsComponent = ({ 
  stats, 
  dateFrom, 
  dateTo, 
  onDateFromChange, 
  onDateToChange 
}: GratitudeStatsComponentProps) => {
  const chartConfig = {
    count: {
      label: "Jumlah",
    },
  };

  const hasActiveFilters = dateFrom || dateTo;

  const handleReset = () => {
    onDateFromChange(undefined);
    onDateToChange(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <Card className="p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Filter Periode Statistik</h3>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date From */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Dari Tanggal
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background/50",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={onDateFromChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Sampai Tanggal
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background/50",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={onDateToChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {hasActiveFilters && (
            <p className="text-sm text-muted-foreground">
              Menampilkan statistik untuk periode: {dateFrom && format(dateFrom, "dd MMM yyyy", { locale: id })} 
              {dateFrom && dateTo && " - "}
              {dateTo && format(dateTo, "dd MMM yyyy", { locale: id })}
            </p>
          )}
        </div>
      </Card>

      <h3 className="text-lg font-semibold">Statistik & Insight</h3>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalEntries}</div>
            <p className="text-sm text-muted-foreground">Total Syukur</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalDays}</div>
            <p className="text-sm text-muted-foreground">Hari Tercatat</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.currentStreak}</div>
            <p className="text-sm text-muted-foreground">Streak Saat Ini</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.longestStreak}</div>
            <p className="text-sm text-muted-foreground">Rekor Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Entries Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Entri Syukur per Minggu</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <BarChart data={stats.weeklyEntries}>
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Moods Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Perasaan Terbanyak</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <PieChart>
                <Pie
                  data={stats.topMoods}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="mood"
                >
                  {stats.topMoods.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={MOOD_COLORS[entry.mood] || '#6b7280'} 
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Topik yang Paling Disyukuri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topTopics.slice(0, 8).map((topic, index) => (
                <div key={topic.topic} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{topic.topic}</span>
                  <Badge variant="outline" className="text-xs">
                    {topic.count}x
                  </Badge>
                </div>
              ))}
              {stats.topTopics.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada data topik yang cukup
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mood Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Insight Perasaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topMoods.slice(0, 5).map((mood, index) => (
                <div key={mood.mood} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{mood.mood}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-12 h-2 rounded-full bg-gray-200"
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(mood.count / stats.totalDays) * 100}%`,
                          backgroundColor: MOOD_COLORS[mood.mood] || '#6b7280'
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {((mood.count / stats.totalDays) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
              {stats.topMoods.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada data perasaan yang cukup
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
