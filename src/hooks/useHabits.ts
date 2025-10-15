
import { useState, useEffect } from 'react';
import { Habit, HabitCompletion, HabitStats } from '@/types/habit';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }

    const savedCompletions = localStorage.getItem('habitCompletions');
    if (savedCompletions) {
      setCompletions(JSON.parse(savedCompletions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('habitCompletions', JSON.stringify(completions));
  }, [completions]);

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    setCompletions(prev => prev.filter(completion => completion.habitId !== id));
  };

  const toggleCompletion = (habitId: string, date: string) => {
    const existingCompletion = completions.find(
      c => c.habitId === habitId && c.date === date
    );

    if (existingCompletion) {
      setCompletions(prev => prev.map(completion =>
        completion.id === existingCompletion.id
          ? { ...completion, completed: !completion.completed, completedAt: !completion.completed ? new Date().toISOString() : undefined }
          : completion
      ));
    } else {
      const newCompletion: HabitCompletion = {
        id: Date.now().toString(),
        habitId,
        date,
        completed: true,
        completedAt: new Date().toISOString(),
      };
      setCompletions(prev => [...prev, newCompletion]);
    }
  };

  const getHabitsForDate = (date: string): (Habit & { completed: boolean })[] => {
    const dayOfWeek = new Date(date).getDay();
    
    return habits
      .filter(habit => {
        if (habit.frequency === 'daily') return true;
        if (habit.frequency === 'weekly') return habit.days.includes(dayOfWeek);
        if (habit.frequency === 'custom') return habit.days.includes(dayOfWeek);
        return false;
      })
      .map(habit => {
        const completion = completions.find(
          c => c.habitId === habit.id && c.date === date
        );
        return {
          ...habit,
          completed: completion?.completed || false,
        };
      });
  };

  const getStreak = (habitId: string): { current: number; longest: number } => {
    const habitCompletions = completions
      .filter(c => c.habitId === habitId && c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (habitCompletions.length === 0) return { current: 0, longest: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Calculate current streak
    for (let i = 0; i < habitCompletions.length; i++) {
      const completionDate = new Date(habitCompletions[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (completionDate.toDateString() === expectedDate.toDateString()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    const allDates = habitCompletions.map(c => c.date).sort();
    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(allDates[i - 1]);
        const currentDate = new Date(allDates[i]);
        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { current: currentStreak, longest: longestStreak };
  };

  const getConsistencyPercentage = (habitId: string, days: number = 30): number => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let totalExpected = 0;
    let totalCompleted = 0;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const dateString = d.toISOString().split('T')[0];

      let shouldTrack = false;
      if (habit.frequency === 'daily') shouldTrack = true;
      else if (habit.frequency === 'weekly' || habit.frequency === 'custom') {
        shouldTrack = habit.days.includes(dayOfWeek);
      }

      if (shouldTrack) {
        totalExpected++;
        const completion = completions.find(
          c => c.habitId === habitId && c.date === dateString && c.completed
        );
        if (completion) totalCompleted++;
      }
    }

    return totalExpected > 0 ? (totalCompleted / totalExpected) * 100 : 0;
  };

  const getStats = (): HabitStats => {
    const today = new Date().toISOString().split('T')[0];
    const todayHabits = getHabitsForDate(today);

    // Weekly progress
    const weeklyProgress = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayHabits = getHabitsForDate(dateString);
      
      weeklyProgress.push({
        date: dateString,
        completed: dayHabits.filter(h => h.completed).length,
        total: dayHabits.length,
      });
    }

    // Streaks
    const streaks = habits.map(habit => {
      const streak = getStreak(habit.id);
      return {
        habitId: habit.id,
        habitName: habit.name,
        currentStreak: streak.current,
        longestStreak: streak.longest,
      };
    });

    // Consistency
    const consistency = habits.map(habit => ({
      habitId: habit.id,
      habitName: habit.name,
      percentage: getConsistencyPercentage(habit.id),
    }));

    const mostConsistent = consistency.length > 0 
      ? consistency.reduce((max, current) => 
          current.percentage > max.percentage ? current : max
        )
      : null;

    return {
      totalHabits: habits.length,
      todayCompleted: todayHabits.filter(h => h.completed).length,
      todayTotal: todayHabits.length,
      weeklyProgress,
      streaks,
      consistency,
      mostConsistent,
      totalStreaks: streaks.reduce((sum, s) => sum + s.currentStreak, 0),
    };
  };

  return {
    habits,
    completions,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    getHabitsForDate,
    getStreak,
    getConsistencyPercentage,
    getStats,
  };
};
