
export type ProblemCategory = 'emosi' | 'finansial' | 'relasi' | 'ibadah' | 'kesehatan' | 'karier' | 'keluarga' | 'pendidikan' | 'other';

export type ProblemStatus = 'active' | 'progress' | 'resolved';

export type EmotionType = 'marah' | 'sedih' | 'kecewa' | 'takut' | 'bingung' | 'frustrasi' | 'cemas' | 'stress' | 'putus_asa';

export interface Problem {
  id: string;
  name: string;
  category: ProblemCategory;
  description: string;
  difficulty: number; // 1-5
  startDate: string; // YYYY-MM-DD
  status: ProblemStatus;
  
  // Root cause analysis
  rootCauses: string[];
  whyAnalysis: string[]; // 5 Why's
  causeTriangle: {
    self: string;
    others: string;
    environment: string;
  };
  
  // Emotional response
  emotions: EmotionType[];
  emotionalReflection: string;
  
  // Solutions
  solutions: ProblemSolution[];
  spiritualPractices: string[];
  
  // Progress tracking
  lessons: string;
  progressNotes: string[];
  completionDate?: string;
  lastReviewDate?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface ProblemSolution {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  order: number;
}

export interface ProblemStats {
  totalProblems: number;
  activeProblems: number;
  resolvedProblems: number;
  averageDifficulty: number;
  categoryDistribution: { category: ProblemCategory; count: number }[];
  mostCommonEmotions: { emotion: EmotionType; count: number }[];
  weeklyInsights: {
    newProblems: number;
    resolvedProblems: number;
    mostActiveCategory: string;
  };
}

export interface SpiritualQuote {
  text: string;
  source: string;
  category: string;
}
