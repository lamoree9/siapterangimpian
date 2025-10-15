
export interface SpiritualPractice {
  id: string;
  date: string;
  sholat: boolean;
  quran: boolean;
  dzikir: boolean;
  sedekah: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DzikirSession {
  id: string;
  date: string;
  duration: number; // in minutes
  cycles: number;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface SpiritualQuote {
  id: string;
  text: string;
  author: string;
  category: 'motivasi' | 'hikmah' | 'spiritual';
}

export interface SpiritualStats {
  totalPractices: number;
  streakDays: number;
  practiceCompletion: {
    sholat: number;
    quran: number;
    dzikir: number;
    sedekah: number;
  };
  weeklyPractices: {
    date: string;
    sholat: boolean;
    quran: boolean;
    dzikir: boolean;
    sedekah: boolean;
  }[];
}
