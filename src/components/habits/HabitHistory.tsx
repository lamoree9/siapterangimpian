
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Habit, HabitCompletion } from '@/types/habit';

interface HabitHistoryProps {
  habits: Habit[];
  completions: HabitCompletion[];
  getHabitsForDate: (date: string) => (Habit & { completed: boolean })[];
}

export const HabitHistory = ({ habits, completions, getHabitsForDate }: HabitHistoryProps) => {
  const [selectedHabit, setSelectedHabit] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Get unique dates from completions for history
  const getDatesWithActivity = () => {
    const dates = new Set<string>();
    
    // Add dates from completions
    completions.forEach(completion => {
      dates.add(completion.date);
    });
    
    // Add recent dates even if no completions
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.add(date.toISOString().split('T')[0]);
    }
    
    return Array.from(dates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  };

  const filteredDates = getDatesWithActivity();

  const getFilteredHistory = () => {
    let dates = filteredDates;
    
    if (selectedDate) {
      dates = dates.filter(date => date === selectedDate);
    }
    
    return dates.slice(0, 30); // Limit to last 30 entries
  };

  const filteredHistory = getFilteredHistory();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Riwayat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="habit-filter">Kebiasaan</Label>
              <Select value={selectedHabit} onValueChange={setSelectedHabit}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua kebiasaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kebiasaan</SelectItem>
                  {habits.map((habit) => (
                    <SelectItem key={habit.id} value={habit.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: habit.color }}
                        />
                        {habit.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date-filter">Tanggal</Label>
              <Input
                id="date-filter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4" />
              <p>Tidak ada riwayat yang sesuai dengan filter.</p>
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((date) => {
            const dayHabits = getHabitsForDate(date);
            const filteredHabits = selectedHabit === 'all' 
              ? dayHabits 
              : dayHabits.filter(h => h.id === selectedHabit);

            if (filteredHabits.length === 0) return null;

            const completed = filteredHabits.filter(h => h.completed).length;
            const total = filteredHabits.length;
            const completionRate = total > 0 ? (completed / total) * 100 : 0;

            return (
              <Card key={date}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {new Date(date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardTitle>
                    <Badge variant={completionRate === 100 ? 'default' : 'outline'}>
                      {completed}/{total} ({completionRate.toFixed(0)}%)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredHabits.map((habit) => (
                      <div key={habit.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: habit.color }}
                          />
                          <span className="text-sm font-medium">{habit.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {habit.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {habit.idealTime && (
                            <span className="text-xs text-muted-foreground">
                              {habit.idealTime}
                            </span>
                          )}
                          {habit.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
