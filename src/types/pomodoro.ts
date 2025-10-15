
export interface PomodoroSession {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  type: 'focus' | 'break';
  completed: boolean;
  createdAt: string;
}

export interface PomodoroSettings {
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsUntilLongBreak: number;
}

export interface PomodoroStats {
  totalSessions: number;
  todaySessions: number;
  weekSessions: number;
  totalFocusTime: number; // in minutes
  averageSessionsPerDay: number;
  dailyStats: { date: string; sessions: number }[];
}
