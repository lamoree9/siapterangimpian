
export interface EnergyCheckIn {
  id: string;
  date: string;
  physical: number; // 1-5
  mental: number; // 1-5
  emotional: number; // 1-5
  social: number; // 1-5
  spiritual: number; // 1-5
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnergySuggestion {
  type: 'physical' | 'mental' | 'emotional' | 'social' | 'spiritual';
  level: number;
  suggestion: string;
}

export interface EnergyStats {
  averageScores: {
    physical: number;
    mental: number;
    emotional: number;
    social: number;
    spiritual: number;
  };
  weeklyTrends: {
    date: string;
    physical: number;
    mental: number;
    emotional: number;
    social: number;
    spiritual: number;
  }[];
  lowestScores: EnergySuggestion[];
  streak: number;
  comparison: {
    percentageChange: number;
    trend: 'up' | 'down' | 'stable';
  } | null;
  quickStats: {
    bestDay: {
      date: string;
      total: number;
    };
    worstDay: {
      date: string;
      total: number;
    };
    mostConsistentCategory: 'physical' | 'mental' | 'emotional' | 'social' | 'spiritual';
  } | null;
}
