
import { useState, useEffect } from 'react';
import { DailyIntention, IntentionStats } from '@/types/intention';

const STORAGE_KEY = 'daily-intentions';

export const useIntention = () => {
  const [intentions, setIntentions] = useState<DailyIntention[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setIntentions(JSON.parse(stored));
    }
  }, []);

  const saveIntentions = (newIntentions: DailyIntention[]) => {
    setIntentions(newIntentions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIntentions));
  };

  const addIntention = (date: string, intention: string, category?: string) => {
    const now = new Date().toISOString();
    const newIntention: DailyIntention = {
      id: crypto.randomUUID(),
      date,
      intention,
      category,
      completed: false,
      createdAt: now,
      updatedAt: now
    };
    saveIntentions([...intentions, newIntention]);
    return newIntention.id;
  };

  const updateIntention = (id: string, updates: Partial<DailyIntention>) => {
    const now = new Date().toISOString();
    const updated = intentions.map(intention =>
      intention.id === id
        ? { ...intention, ...updates, updatedAt: now }
        : intention
    );
    saveIntentions(updated);
  };

  const deleteIntention = (id: string) => {
    const updated = intentions.filter(intention => intention.id !== id);
    saveIntentions(updated);
  };

  const toggleIntentionComplete = (id: string) => {
    updateIntention(id, { completed: !intentions.find(i => i.id === id)?.completed });
  };

  const getIntentionsByDate = (date: string) => {
    return intentions.filter(i => i.date === date);
  };

  const getStats = (): IntentionStats => {
    const categoryCounts = intentions.reduce((acc, intention) => {
      if (intention.category) {
        const existing = acc.find(c => c.category === intention.category);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ category: intention.category, count: 1 });
        }
      }
      return acc;
    }, [] as { category: string; count: number }[]);

    // Get last 7 days
    const weeklyIntentions = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      return {
        date: dateStr,
        hasIntention: intentions.some(intention => intention.date === dateStr)
      };
    }).reverse();

    return {
      totalIntentions: intentions.length,
      completedIntentions: intentions.filter(i => i.completed).length,
      categoryCounts,
      weeklyIntentions
    };
  };

  return {
    intentions,
    addIntention,
    updateIntention,
    deleteIntention,
    toggleIntentionComplete,
    getIntentionsByDate,
    getStats
  };
};
