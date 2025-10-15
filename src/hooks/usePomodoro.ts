
import { useState, useEffect, useCallback } from 'react';
import { PomodoroSession, PomodoroSettings, PomodoroStats } from '@/types/pomodoro';

const SESSIONS_STORAGE_KEY = 'pomodoro-sessions';
const SETTINGS_STORAGE_KEY = 'pomodoro-settings';

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 50,
  breakDuration: 10,
  longBreakDuration: 30,
  sessionsUntilLongBreak: 4
};

export const usePomodoro = () => {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const storedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }

    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const saveSessions = useCallback((newSessions: PomodoroSession[]) => {
    setSessions(newSessions);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(newSessions));
  }, []);

  const saveSettings = useCallback((newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
  }, []);

  const startSession = (type: 'focus' | 'break') => {
    const duration = type === 'focus' ? settings.focusDuration : settings.breakDuration;
    const session: PomodoroSession = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
      duration,
      type,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setCurrentSession(session);
    setTimeLeft(duration * 60); // Convert to seconds
    setIsRunning(true);
  };

  const completeSession = () => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        completed: true
      };
      saveSessions([...sessions, completedSession]);
      setCurrentSession(null);
      setIsRunning(false);
    }
  };

  const stopSession = () => {
    setCurrentSession(null);
    setIsRunning(false);
    setTimeLeft(0);
  };

  const getStats = (): PomodoroStats => {
    const today = new Date().toISOString().split('T')[0];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const completedSessions = sessions.filter(s => s.completed);
    const todaySessions = completedSessions.filter(s => s.date === today && s.type === 'focus').length;
    const weekSessions = completedSessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate >= oneWeekAgo && s.type === 'focus';
    }).length;

    const totalFocusTime = completedSessions
      .filter(s => s.type === 'focus')
      .reduce((total, s) => total + s.duration, 0);

    const dailyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const sessionsCount = completedSessions.filter(s => s.date === dateStr && s.type === 'focus').length;
      return { date: dateStr, sessions: sessionsCount };
    }).reverse();

    return {
      totalSessions: completedSessions.filter(s => s.type === 'focus').length,
      todaySessions,
      weekSessions,
      totalFocusTime,
      averageSessionsPerDay: weekSessions / 7,
      dailyStats
    };
  };

  return {
    sessions,
    settings,
    currentSession,
    timeLeft,
    isRunning,
    setTimeLeft,
    setIsRunning,
    startSession,
    completeSession,
    stopSession,
    saveSettings,
    getStats
  };
};
