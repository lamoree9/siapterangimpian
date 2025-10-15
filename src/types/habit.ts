
export type FrequencyType = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  name: string;
  frequency: FrequencyType;
  days: number[]; // 0-6 (Sunday to Saturday)
  idealTime?: string; // HH:MM format
  notes?: string;
  category: string;
  color: string;
  createdAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface HabitStats {
  totalHabits: number;
  todayCompleted: number;
  todayTotal: number;
  weeklyProgress: { date: string; completed: number; total: number }[];
  streaks: { habitId: string; habitName: string; currentStreak: number; longestStreak: number }[];
  consistency: { habitId: string; habitName: string; percentage: number }[];
  mostConsistent: { habitId: string; habitName: string; percentage: number } | null;
  totalStreaks: number;
}
