
import { useState, useEffect } from 'react';
import { GratitudeEntry, GratitudeStats, MoodType } from '@/types/gratitude';

const STORAGE_KEY = 'gratitude-entries';

export const useGratitude = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  const saveEntries = (newEntries: GratitudeEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const addEntry = (dateString: string, gratitudeEntries: string[], mood: MoodType, additionalNotes?: string) => {
    // Always create new entry with current timestamp
    const now = new Date().toISOString();
    const newEntry: GratitudeEntry = {
      id: crypto.randomUUID(),
      date: now,
      entries: gratitudeEntries,
      mood,
      additionalNotes,
      createdAt: now,
      updatedAt: now
    };
    saveEntries([...entries, newEntry]);
  };

  const getEntryByDate = (date: string): GratitudeEntry | undefined => {
    return entries.find(entry => entry.date === date);
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    saveEntries(updatedEntries);
  };

  const getStats = (dateFrom?: Date, dateTo?: Date): GratitudeStats => {
    // Filter entries by date range if provided
    let filteredEntries = entries;
    if (dateFrom || dateTo) {
      filteredEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        if (dateFrom && dateTo) {
          return entryDate >= dateFrom && entryDate <= dateTo;
        } else if (dateFrom) {
          return entryDate >= dateFrom;
        } else if (dateTo) {
          return entryDate <= dateTo;
        }
        return true;
      });
    }

    const totalEntries = filteredEntries.reduce((sum, entry) => sum + entry.entries.length, 0);
    const totalDays = filteredEntries.length;

    // Calculate streaks
    const sortedDates = filteredEntries
      .map(entry => new Date(entry.date))
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const previousDate = i > 0 ? sortedDates[i - 1] : null;
      
      if (i === 0) {
        // Check if today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        
        if (currentDate.getTime() === today.getTime()) {
          currentStreak = 1;
          tempStreak = 1;
        }
      } else if (previousDate) {
        const dayDiff = Math.abs(previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          tempStreak++;
          if (i === 1) currentStreak = tempStreak;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          if (i === 1) currentStreak = 0;
        }
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);

    // Top moods
    const moodCounts = filteredEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topMoods = Object.entries(moodCounts)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Weekly entries
    const weeklyData = filteredEntries.reduce((acc, entry) => {
      const date = new Date(entry.date);
      const year = date.getFullYear();
      const week = Math.ceil((date.getDate() - date.getDay()) / 7);
      const weekKey = `${year}-W${week}`;
      
      acc[weekKey] = (acc[weekKey] || 0) + entry.entries.length;
      return acc;
    }, {} as Record<string, number>);

    const weeklyEntries = Object.entries(weeklyData)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-8); // Last 8 weeks

    // Top topics (simple keyword extraction)
    const allText = filteredEntries.flatMap(entry => entry.entries).join(' ').toLowerCase();
    const words = allText.split(/\s+/).filter(word => word.length > 3);
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTopics = Object.entries(wordCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEntries,
      totalDays,
      currentStreak,
      longestStreak,
      topMoods,
      weeklyEntries,
      topTopics
    };
  };

  return {
    entries,
    addEntry,
    getEntryByDate,
    deleteEntry,
    getStats
  };
};
