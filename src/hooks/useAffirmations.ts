
import { useState, useEffect } from 'react';

interface Affirmation {
  id: string;
  text: string;
  type: 'morning' | 'evening';
  createdAt: string;
}

const DEFAULT_AFFIRMATIONS = {
  morning: [
    "Hari ini penuh berkah. Aku siap berkembang dan bertumbuh.",
    "Aku memiliki kekuatan untuk menghadapi hari ini dengan penuh semangat.",
    "Setiap tantangan hari ini adalah kesempatan untuk menjadi lebih baik.",
    "Aku bersyukur atas kesempatan baru yang akan datang hari ini."
  ],
  evening: [
    "Aku bersyukur atas hari ini. Aku sedang dalam proses terbaik.",
    "Hari ini telah memberikan pelajaran berharga untukku.",
    "Aku melepaskan semua yang tidak bisa kukontrol dan beristirahat dengan tenang.",
    "Besok adalah hari baru dengan kemungkinan-kemungkinan indah."
  ]
};

export const useAffirmations = () => {
  const [customAffirmations, setCustomAffirmations] = useState<Affirmation[]>([]);
  const [lastShownDate, setLastShownDate] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('customAffirmations');
    if (saved) {
      setCustomAffirmations(JSON.parse(saved));
    }

    const lastShown = localStorage.getItem('lastAffirmationShown');
    setLastShownDate(lastShown);
  }, []);

  const saveToStorage = (affirmations: Affirmation[]) => {
    localStorage.setItem('customAffirmations', JSON.stringify(affirmations));
    setCustomAffirmations(affirmations);
  };

  const getCurrentTimeType = (): 'morning' | 'evening' | null => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 9) return 'morning';
    if (hour >= 20 && hour <= 23) return 'evening';
    return null;
  };

  const shouldShowAutomatic = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    const timeType = getCurrentTimeType();
    
    if (!timeType) return false;
    
    const lastShownKey = `${today}-${timeType}`;
    return lastShownDate !== lastShownKey;
  };

  const markAsShown = () => {
    const today = new Date().toISOString().split('T')[0];
    const timeType = getCurrentTimeType();
    
    if (timeType) {
      const key = `${today}-${timeType}`;
      localStorage.setItem('lastAffirmationShown', key);
      setLastShownDate(key);
    }
  };

  const getRandomAffirmation = (type: 'morning' | 'evening'): string => {
    const defaultList = DEFAULT_AFFIRMATIONS[type];
    const customList = customAffirmations
      .filter(aff => aff.type === type)
      .map(aff => aff.text);
    
    const allAffirmations = [...defaultList, ...customList];
    return allAffirmations[Math.floor(Math.random() * allAffirmations.length)];
  };

  const addCustomAffirmation = (text: string, type: 'morning' | 'evening') => {
    const newAffirmation: Affirmation = {
      id: Date.now().toString(),
      text,
      type,
      createdAt: new Date().toISOString()
    };
    
    const updated = [...customAffirmations, newAffirmation];
    saveToStorage(updated);
  };

  const editCustomAffirmation = (id: string, newText: string) => {
    const updated = customAffirmations.map(aff =>
      aff.id === id ? { ...aff, text: newText } : aff
    );
    saveToStorage(updated);
  };

  const deleteCustomAffirmation = (id: string) => {
    const updated = customAffirmations.filter(aff => aff.id !== id);
    saveToStorage(updated);
  };

  return {
    getCurrentTimeType,
    shouldShowAutomatic,
    markAsShown,
    getRandomAffirmation,
    addCustomAffirmation,
    editCustomAffirmation,
    deleteCustomAffirmation,
    customAffirmations
  };
};
