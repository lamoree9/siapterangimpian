
export type DreamCategory = 'house' | 'car' | 'career' | 'worship' | 'education' | 'health' | 'travel' | 'business' | 'family' | 'other';

export interface Dream {
  id: string;
  name: string;
  category: DreamCategory;
  reason: string;
  deadline?: string; // YYYY-MM-DD
  estimatedFund?: number;
  imageUrl?: string;
  steps: DreamStep[];
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
  reminderDate?: string;
  reflection?: string;
  connectedHabits: string[]; // habit IDs
}

export interface DreamStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  targetDate?: string;
  order: number;
}

export interface DreamStats {
  totalDreams: number;
  completedSteps: number;
  totalSteps: number;
  averageProgress: number;
  categoryCounts: { category: DreamCategory; count: number }[];
  upcomingDeadlines: { dreamId: string; dreamName: string; deadline: string }[];
  recentlyUpdated: { dreamId: string; dreamName: string; updatedAt: string }[];
}

export type ViewMode = 'grid' | 'timeline' | 'mindmap';
