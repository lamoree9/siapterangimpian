
import { useState, useEffect } from 'react';
import { SpiritualPractice, DzikirSession, SpiritualQuote, SpiritualStats } from '@/types/spiritual';

const PRACTICES_STORAGE_KEY = 'spiritual-practices';
const DZIKIR_STORAGE_KEY = 'dzikir-sessions';
const CUSTOM_DZIKIR_KEY = 'custom-dzikir';
const CUSTOM_DOA_KEY = 'custom-doa';

export interface Dzikir {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
  category: string;
}

export interface Doa {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: string;
}

const SPIRITUAL_QUOTES: SpiritualQuote[] = [
  {
    id: '1',
    text: 'Hidup ini adalah ladang untuk menanam kebaikan. Jangan sia-siakan kesempatan berbuat baik.',
    author: 'Emha Ainun Nadjib',
    category: 'hikmah'
  },
  {
    id: '2',
    text: 'Jadilah seperti air yang mengalir. Tenang tapi tegas, lembut tapi kuat.',
    author: 'Sabrang Mowo Damar Panuluh',
    category: 'motivasi'
  },
  {
    id: '3',
    text: 'Dan barangsiapa yang bertakwa kepada Allah niscaya Allah akan mengadakan baginya jalan keluar.',
    author: 'QS. At-Talaq: 2',
    category: 'spiritual'
  },
  {
    id: '4',
    text: 'Kekuatan sejati bukan terletak pada kemampuan membalas, tetapi pada kemampuan memaafkan.',
    author: 'Emha Ainun Nadjib',
    category: 'hikmah'
  },
  {
    id: '5',
    text: 'Hidup adalah proses belajar menjadi manusia yang lebih baik setiap harinya.',
    author: 'Sabrang Mowo Damar Panuluh',
    category: 'motivasi'
  }
];

export const useSpiritual = () => {
  const [practices, setPractices] = useState<SpiritualPractice[]>([]);
  const [dzikirSessions, setDzikirSessions] = useState<DzikirSession[]>([]);
  const [customDzikir, setCustomDzikir] = useState<Dzikir[]>([]);
  const [customDoa, setCustomDoa] = useState<Doa[]>([]);

  useEffect(() => {
    const storedPractices = localStorage.getItem(PRACTICES_STORAGE_KEY);
    if (storedPractices) {
      setPractices(JSON.parse(storedPractices));
    }

    const storedDzikir = localStorage.getItem(DZIKIR_STORAGE_KEY);
    if (storedDzikir) {
      setDzikirSessions(JSON.parse(storedDzikir));
    }

    const storedCustomDzikir = localStorage.getItem(CUSTOM_DZIKIR_KEY);
    if (storedCustomDzikir) {
      setCustomDzikir(JSON.parse(storedCustomDzikir));
    }

    const storedCustomDoa = localStorage.getItem(CUSTOM_DOA_KEY);
    if (storedCustomDoa) {
      setCustomDoa(JSON.parse(storedCustomDoa));
    }
  }, []);

  const savePractices = (newPractices: SpiritualPractice[]) => {
    setPractices(newPractices);
    localStorage.setItem(PRACTICES_STORAGE_KEY, JSON.stringify(newPractices));
  };

  const saveDzikirSessions = (newSessions: DzikirSession[]) => {
    setDzikirSessions(newSessions);
    localStorage.setItem(DZIKIR_STORAGE_KEY, JSON.stringify(newSessions));
  };

  const updatePractice = (date: string, practiceData: Partial<Pick<SpiritualPractice, 'sholat' | 'quran' | 'dzikir' | 'sedekah' | 'notes'>>) => {
    const existingIndex = practices.findIndex(p => p.date === date);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const updated = [...practices];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...practiceData,
        updatedAt: now
      };
      savePractices(updated);
    } else {
      const newPractice: SpiritualPractice = {
        id: crypto.randomUUID(),
        date,
        sholat: practiceData.sholat || false,
        quran: practiceData.quran || false,
        dzikir: practiceData.dzikir || false,
        sedekah: practiceData.sedekah || false,
        notes: practiceData.notes,
        createdAt: now,
        updatedAt: now
      };
      savePractices([...practices, newPractice]);
    }
  };

  const addDzikirSession = (duration: number, cycles: number) => {
    const session: DzikirSession = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      duration,
      cycles,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    saveDzikirSessions([...dzikirSessions, session]);
  };

  const getPracticeByDate = (date: string) => {
    return practices.find(p => p.date === date);
  };

  const getTodayQuote = (): SpiritualQuote => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return SPIRITUAL_QUOTES[dayOfYear % SPIRITUAL_QUOTES.length];
  };

  const getStats = (): SpiritualStats => {
    const totalPractices = practices.length;
    
    // Calculate streak
    let streakDays = 0;
    const sortedPractices = practices
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (let i = 0; i < sortedPractices.length; i++) {
      const practice = sortedPractices[i];
      const hasAnyPractice = practice.sholat || practice.quran || practice.dzikir || practice.sedekah;
      
      if (hasAnyPractice) {
        streakDays++;
      } else {
        break;
      }
    }

    const practiceCompletion = practices.reduce((acc, practice) => {
      if (practice.sholat) acc.sholat++;
      if (practice.quran) acc.quran++;
      if (practice.dzikir) acc.dzikir++;
      if (practice.sedekah) acc.sedekah++;
      return acc;
    }, { sholat: 0, quran: 0, dzikir: 0, sedekah: 0 });

    const weeklyPractices = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const practice = practices.find(p => p.date === dateStr);
      return {
        date: dateStr,
        sholat: practice?.sholat || false,
        quran: practice?.quran || false,
        dzikir: practice?.dzikir || false,
        sedekah: practice?.sedekah || false
      };
    }).reverse();

    return {
      totalPractices,
      streakDays,
      practiceCompletion,
      weeklyPractices
    };
  };

  const addCustomDzikir = (dzikir: Omit<Dzikir, 'id'>) => {
    const newDzikir: Dzikir = {
      ...dzikir,
      id: crypto.randomUUID()
    };
    const updated = [...customDzikir, newDzikir];
    setCustomDzikir(updated);
    localStorage.setItem(CUSTOM_DZIKIR_KEY, JSON.stringify(updated));
  };

  const deleteCustomDzikir = (id: string) => {
    const updated = customDzikir.filter(d => d.id !== id);
    setCustomDzikir(updated);
    localStorage.setItem(CUSTOM_DZIKIR_KEY, JSON.stringify(updated));
  };

  const addCustomDoa = (doa: Omit<Doa, 'id'>) => {
    const newDoa: Doa = {
      ...doa,
      id: crypto.randomUUID()
    };
    const updated = [...customDoa, newDoa];
    setCustomDoa(updated);
    localStorage.setItem(CUSTOM_DOA_KEY, JSON.stringify(updated));
  };

  const deleteCustomDoa = (id: string) => {
    const updated = customDoa.filter(d => d.id !== id);
    setCustomDoa(updated);
    localStorage.setItem(CUSTOM_DOA_KEY, JSON.stringify(updated));
  };

  return {
    practices,
    dzikirSessions,
    customDzikir,
    customDoa,
    updatePractice,
    addDzikirSession,
    getPracticeByDate,
    getTodayQuote,
    getStats,
    addCustomDzikir,
    deleteCustomDzikir,
    addCustomDoa,
    deleteCustomDoa
  };
};
