
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Target, Trash2 } from 'lucide-react';
import { Habit } from '@/types/habit';

interface HabitListProps {
  habits: (Habit & { completed: boolean })[];
  onToggleCompletion: (habitId: string) => void;
  onDeleteHabit: (habitId: string) => void;
  getStreak: (habitId: string) => { current: number; longest: number };
  getConsistency: (habitId: string) => number;
}

export const HabitList = ({ 
  habits, 
  onToggleCompletion, 
  onDeleteHabit, 
  getStreak, 
  getConsistency 
}: HabitListProps) => {
  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Target className="mx-auto h-12 w-12 mb-4" />
          <p>Belum ada kebiasaan untuk hari ini.</p>
          <p className="text-sm">Tambahkan kebiasaan baru untuk memulai tracking!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => {
        const streak = getStreak(habit.id);
        const consistency = getConsistency(habit.id);
        
        return (
          <Card key={habit.id} className={`transition-all ${habit.completed ? 'bg-green-50 border-green-200' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Checkbox
                    checked={habit.completed}
                    onCheckedChange={() => onToggleCompletion(habit.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-medium ${habit.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {habit.name}
                      </h3>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: habit.color }}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {habit.category}
                      </Badge>
                      {habit.idealTime && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {habit.idealTime}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        🔥 {streak.current} hari
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        📈 {consistency.toFixed(0)}%
                      </Badge>
                    </div>
                    
                    {habit.notes && (
                      <p className="text-sm text-muted-foreground">
                        {habit.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteHabit(habit.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
