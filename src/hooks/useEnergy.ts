
import { useState, useEffect } from 'react';
import { EnergyCheckIn, EnergySuggestion, EnergyStats } from '@/types/energy';

const STORAGE_KEY = 'energy-checkins';

const ENERGY_SUGGESTIONS: EnergySuggestion[] = [
  { type: 'physical', level: 1, suggestion: 'Lakukan peregangan ringan selama 5 menit atau jalan-jalan sebentar.' },
  { type: 'physical', level: 2, suggestion: 'Minum air putih dan lakukan gerakan ringan untuk mengaktifkan tubuh.' },
  { type: 'mental', level: 1, suggestion: 'Ambil istirahat sejenak dan fokus pada pernapasan dalam selama 3 menit.' },
  { type: 'mental', level: 2, suggestion: 'Coba journaling 5 menit untuk melatih kejernihan pikiran.' },
  { type: 'emotional', level: 1, suggestion: 'Tuliskan 3 hal yang kamu syukuri hari ini.' },
  { type: 'emotional', level: 2, suggestion: 'Dengarkan musik favorit atau hubungi orang terdekat.' },
  { type: 'social', level: 1, suggestion: 'Kirim pesan kepada teman atau keluarga untuk menyapa.' },
  { type: 'social', level: 2, suggestion: 'Rencanakan kegiatan bersama orang lain dalam waktu dekat.' },
  { type: 'spiritual', level: 1, suggestion: 'Luangkan waktu untuk berdoa atau berdzikir sejenak.' },
  { type: 'spiritual', level: 2, suggestion: 'Baca satu ayat Al-Quran dan renungkan maknanya.' }
];

export const useEnergy = () => {
  const [checkIns, setCheckIns] = useState<EnergyCheckIn[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCheckIns(JSON.parse(stored));
    }
  }, []);

  const saveCheckIns = (newCheckIns: EnergyCheckIn[]) => {
    setCheckIns(newCheckIns);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCheckIns));
  };

  const addCheckIn = (date: string, scores: { physical: number; mental: number; emotional: number; social: number; spiritual: number }, notes?: string) => {
    const existingIndex = checkIns.findIndex(c => c.date === date);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const updated = [...checkIns];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...scores,
        notes,
        updatedAt: now
      };
      saveCheckIns(updated);
    } else {
      const newCheckIn: EnergyCheckIn = {
        id: crypto.randomUUID(),
        date,
        ...scores,
        notes,
        createdAt: now,
        updatedAt: now
      };
      saveCheckIns([...checkIns, newCheckIn]);
    }
  };

  const getCheckInByDate = (date: string) => {
    return checkIns.find(c => c.date === date);
  };

  const getSuggestions = (scores: { physical: number; mental: number; emotional: number; social: number; spiritual: number }) => {
    const suggestions: EnergySuggestion[] = [];
    
    Object.entries(scores).forEach(([type, score]) => {
      if (score <= 2) {
        const suggestion = ENERGY_SUGGESTIONS.find(s => s.type === type && s.level === score);
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }
    });

    return suggestions;
  };

  const getStreak = (): number => {
    if (checkIns.length === 0) return 0;

    const sortedCheckIns = [...checkIns].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (sortedCheckIns.find(c => c.date === dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  };

  const getComparison = () => {
    if (checkIns.length < 2) return null;

    const today = new Date().toISOString().split('T')[0];
    const currentCheckIn = checkIns.find(c => c.date === today);
    
    if (!currentCheckIn) return null;

    const lastWeekCheckIns = checkIns.filter(c => {
      const checkDate = new Date(c.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      return checkDate >= twoWeeksAgo && checkDate < weekAgo;
    });

    if (lastWeekCheckIns.length === 0) return null;

    const currentTotal = currentCheckIn.physical + currentCheckIn.mental + 
                        currentCheckIn.emotional + currentCheckIn.social + currentCheckIn.spiritual;
    
    const lastWeekAvgTotal = lastWeekCheckIns.reduce((sum, c) => 
      sum + c.physical + c.mental + c.emotional + c.social + c.spiritual, 0
    ) / lastWeekCheckIns.length;

    const percentageChange = ((currentTotal - lastWeekAvgTotal) / lastWeekAvgTotal) * 100;

    const trend: 'up' | 'down' | 'stable' = percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'stable';

    return {
      percentageChange: Math.round(percentageChange),
      trend
    };
  };

  const getQuickStats = () => {
    if (checkIns.length === 0) return null;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const recentCheckIns = checkIns.filter(c => last7Days.includes(c.date));
    
    if (recentCheckIns.length === 0) return null;

    let bestDay = recentCheckIns[0];
    let worstDay = recentCheckIns[0];
    
    recentCheckIns.forEach(checkIn => {
      const total = checkIn.physical + checkIn.mental + checkIn.emotional + checkIn.social + checkIn.spiritual;
      const bestTotal = bestDay.physical + bestDay.mental + bestDay.emotional + bestDay.social + bestDay.spiritual;
      const worstTotal = worstDay.physical + worstDay.mental + worstDay.emotional + worstDay.social + worstDay.spiritual;
      
      if (total > bestTotal) bestDay = checkIn;
      if (total < worstTotal) worstDay = checkIn;
    });

    const energyTypes = ['physical', 'mental', 'emotional', 'social', 'spiritual'] as const;
    const consistency = energyTypes.map(type => {
      const values = recentCheckIns.map(c => c[type]);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      return { type, stdDev };
    });

    const mostConsistent = consistency.reduce((min, curr) => 
      curr.stdDev < min.stdDev ? curr : min
    );

    return {
      bestDay: {
        date: bestDay.date,
        total: bestDay.physical + bestDay.mental + bestDay.emotional + bestDay.social + bestDay.spiritual
      },
      worstDay: {
        date: worstDay.date,
        total: worstDay.physical + worstDay.mental + worstDay.emotional + worstDay.social + worstDay.spiritual
      },
      mostConsistentCategory: mostConsistent.type
    };
  };

  const getStats = (): EnergyStats => {
    if (checkIns.length === 0) {
      return {
        averageScores: { physical: 0, mental: 0, emotional: 0, social: 0, spiritual: 0 },
        weeklyTrends: [],
        lowestScores: [],
        streak: 0,
        comparison: null,
        quickStats: null
      };
    }

    const averageScores = checkIns.reduce((acc, checkIn) => {
      acc.physical += checkIn.physical;
      acc.mental += checkIn.mental;
      acc.emotional += checkIn.emotional;
      acc.social += checkIn.social;
      acc.spiritual += checkIn.spiritual;
      return acc;
    }, { physical: 0, mental: 0, emotional: 0, social: 0, spiritual: 0 });

    Object.keys(averageScores).forEach(key => {
      averageScores[key as keyof typeof averageScores] = Math.round(averageScores[key as keyof typeof averageScores] / checkIns.length * 10) / 10;
    });

    const weeklyTrends = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const checkIn = checkIns.find(c => c.date === dateStr);
      return {
        date: dateStr,
        physical: checkIn?.physical || 0,
        mental: checkIn?.mental || 0,
        emotional: checkIn?.emotional || 0,
        social: checkIn?.social || 0,
        spiritual: checkIn?.spiritual || 0
      };
    }).reverse();

    const latestCheckIn = checkIns[checkIns.length - 1];
    const lowestScores = latestCheckIn ? getSuggestions(latestCheckIn) : [];

    return {
      averageScores,
      weeklyTrends,
      lowestScores,
      streak: getStreak(),
      comparison: getComparison(),
      quickStats: getQuickStats()
    };
  };

  return {
    checkIns,
    addCheckIn,
    getCheckInByDate,
    getSuggestions,
    getStats,
    getStreak,
    getComparison,
    getQuickStats
  };
};
