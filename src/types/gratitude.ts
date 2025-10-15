
export interface GratitudeEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  entries: string[]; // Array of gratitude entries (1-99)
  mood: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GratitudeStats {
  totalEntries: number;
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
  topMoods: { mood: string; count: number }[];
  weeklyEntries: { week: string; count: number }[];
  topTopics: { topic: string; count: number }[];
}

export type MoodType = 
  | 'senang'
  | 'tenang' 
  | 'bersemangat'
  | 'syukur'
  | 'cemas'
  | 'lelah'
  | 'sedih'
  | 'marah'
  | 'bingung'
  | 'optimis';
