
import { useState, useEffect } from 'react';

const CATEGORIES_STORAGE_KEY = 'expense-categories';

const defaultCategories = [
  { value: 'makan', label: 'Makan' },
  { value: 'transportasi', label: 'Transportasi' },
  { value: 'hiburan', label: 'Hiburan' },
  { value: 'belanja', label: 'Belanja' },
  { value: 'lainnya', label: 'Lainnya' }
];

export const useCategories = () => {
  const [categories, setCategories] = useState(defaultCategories);

  useEffect(() => {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (stored) {
      try {
        const parsedCategories = JSON.parse(stored);
        setCategories(parsedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
  }, []);

  const saveCategories = (newCategories: typeof categories) => {
    setCategories(newCategories);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(newCategories));
  };

  const addCategory = (newCategory: string) => {
    const categoryValue = newCategory.toLowerCase().replace(/\s+/g, '-');
    const categoryExists = categories.some(cat => cat.value === categoryValue);
    
    if (!categoryExists && newCategory.trim()) {
      const newCategoryItem = {
        value: categoryValue,
        label: newCategory.trim()
      };
      saveCategories([...categories, newCategoryItem]);
      return categoryValue;
    }
    return categoryValue;
  };

  return {
    categories,
    addCategory
  };
};
