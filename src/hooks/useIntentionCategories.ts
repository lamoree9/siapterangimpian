
import { useState, useEffect } from 'react';

export interface IntentionCategory {
  value: string;
  label: string;
  icon: string;
  color: string;
}

const CATEGORIES_STORAGE_KEY = 'intention-categories';

const DEFAULT_CATEGORIES: IntentionCategory[] = [
  { value: 'spiritual', label: 'Spiritual', icon: 'Heart', color: 'bg-purple-100 text-purple-800' },
  { value: 'karir', label: 'Karir', icon: 'Briefcase', color: 'bg-blue-100 text-blue-800' },
  { value: 'kesehatan', label: 'Kesehatan', icon: 'Activity', color: 'bg-green-100 text-green-800' },
  { value: 'sosial', label: 'Sosial', icon: 'Users', color: 'bg-orange-100 text-orange-800' }
];

export const useIntentionCategories = () => {
  const [categories, setCategories] = useState<IntentionCategory[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (stored) {
      try {
        const parsedCategories = JSON.parse(stored);
        setCategories(parsedCategories);
      } catch (error) {
        console.error('Error loading intention categories:', error);
        setCategories(DEFAULT_CATEGORIES);
      }
    }
  }, []);

  const saveCategories = (newCategories: IntentionCategory[]) => {
    setCategories(newCategories);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(newCategories));
  };

  const addCategory = (label: string) => {
    const value = label.toLowerCase().replace(/\s+/g, '-');
    const categoryExists = categories.some(cat => cat.value === value);
    
    if (!categoryExists && label.trim()) {
      const colors = [
        'bg-red-100 text-red-800',
        'bg-yellow-100 text-yellow-800',
        'bg-indigo-100 text-indigo-800',
        'bg-pink-100 text-pink-800',
        'bg-teal-100 text-teal-800'
      ];
      
      const newCategory: IntentionCategory = {
        value,
        label: label.trim(),
        icon: 'Star',
        color: colors[categories.length % colors.length]
      };
      
      saveCategories([...categories, newCategory]);
      return value;
    }
    return value;
  };

  const removeCategory = (value: string) => {
    if (DEFAULT_CATEGORIES.some(cat => cat.value === value)) {
      return; // Cannot remove default categories
    }
    const updated = categories.filter(cat => cat.value !== value);
    saveCategories(updated);
  };

  return {
    categories,
    addCategory,
    removeCategory
  };
};
