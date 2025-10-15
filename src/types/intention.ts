
export interface DailyIntention {
  id: string;
  date: string; // YYYY-MM-DD
  intention: string;
  category?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IntentionStats {
  totalIntentions: number;
  completedIntentions: number;
  categoryCounts: { category: string; count: number }[];
  weeklyIntentions: { date: string; hasIntention: boolean }[];
}
